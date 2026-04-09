import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import IsLoading from "../components/IsLoading";
import ListArticles from "../components/ListArticles";
import ViewArticle from "../components/ViewArticle";

/**
 * AllArticlesPage functional component.
 * Features:
 * - Loads all article metadata from the blockchain.
 * - Shows all articles or user's articles.
 * - Fetches an article from Pinata's IPFS Gateway.
 * - Enables deletion and voting of articles.
 * - Renders ViewArticle and ListArticles.
 * @param {Contract} props.contract The smart contract.
 * @param {string} props.account The hexidecimal string representing user's account.
 * @component
 * @returns {JSX.Element} Returns the all articles page component.
 */
function AllArticlesPage({ contract, account }) 
{
    const [articles, setArticles] = useState([]);
    const [status, setStatus] = useState('loading');
    const [filteredArticles, setFilteredArticles] = useState('all');
    const [selectedArticleBody, setSelectedArticleBody] = useState(null);
    const [selectedArticleMeta, setSelectedArticleMeta] = useState(null);
    const [voteType, setVoteType] = useState(Number(0));

    useEffect(() =>
    {
        /**
         * Gets either all or user's article metadata from the blockchain.
         * Article state is updated.
         * Deleted articles are filtered out.
         */
        const loadArticles = async () =>
        {
            if (!contract || !account ) return;

            setStatus('loading');

            try
            {
                let fetchedArticles = [];

                if (filteredArticles === 'all')
                {
                    const allArticles = await contract.methods.getAllArticles().call({ from: account });

                    fetchedArticles = allArticles.filter((article) => !article.deleted).map((article => 
                    (
                        {
                            articleId: article.articleId,
                            cid: article.cid,
                            title: article.title,
                            publishedTime: article.publishedTime,
                            likes: Number(article.likes),
                            dislikes: Number(article.dislikes),
                            author: article.author
                        }
                    )))
                }
                else if (filteredArticles === 'mine')
                {
                    const myArticleCount = await contract.methods.getMyArticleCount().call({ from: account });
                    
                    for (let i = 0; i < myArticleCount; i++)
                    {
                        const article = await contract.methods.getMyArticle(i).call({ from: account });

                        if (!article.deleted)
                        {
                            fetchedArticles.push(
                                {
                                    articleId: article.articleId,
                                    cid: article.cid,
                                    title: article.title,
                                    publishedTime: article.publishedTime,
                                    likes: Number(article.likes),
                                    dislikes: Number(article.dislikes),
                                    author: article.author
                                }
                            );
                        }
                    }
                }
                setArticles(fetchedArticles);
            }
            catch (err) 
            {
                console.error('Could not get articles:', err);
            }
            finally
            {
                setStatus('ready');
            }
        };

        loadArticles();
        console.log(contract)
    }, [contract, account, filteredArticles]
    );

    /**
     * Handles article click event.
     * An article's body data is fetched from Pinata's IPFS Gateway via the article's CID.
     * The article's metadata is found via CID filtering. 
     * Voting type is fetched from blockchain. 
     * @param {string} cid The content identifer of the clicked article.
     */
    const articleClick = async (cid) => 
    {
        setStatus('fetching');
        try 
        {
            const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
            const articleData = await res.json();
            setSelectedArticleBody(articleData);

            const metaData = articles.find((article) => article.cid === cid);
            setSelectedArticleMeta(metaData);

            const voted = await contract.methods.getVoteType(metaData.articleId).call({ from: account });

            if (voted === undefined) setVoteType(Number(0));
            else setVoteType(voted);
        }
        catch (err) {
            console.log('Article could not be loaded from Pinata gateway:', err);
            alert('Error, could not load article!');
        }
        finally
        {
            setStatus('ready');
        }
    };

    /**
     * Handles the deletion click event of a specific article.
     * Article CID is set to empty string and flagged as deleted on blockchain.
     * @param {Number} articleId The article ID of the article to delete.
     */
    const deleteArticle = async (articleId) =>
    {
        setStatus('deleting');
        try
        {
            await contract.methods.deleteArticle(articleId).send({ from: account });

            setArticles((prevArticles) => 
            (
                prevArticles.filter((article) =>
                (
                    article.articleId !== articleId
                ))
            ));
            setSelectedArticleBody(null);
            setSelectedArticleMeta(null);
        }
        catch (err)
        {
            console.error('Error deleting article:', err);
        }
        finally
        {
            setStatus('ready');
        }
    };

    /**
     * Handles the voting click event on a specific article.
     * Also updates state to show incremented/decremented voting change.
     * Triggers blockchain voting update.
     * @param {Number} articleId The article ID of the article to vote on.
     * @param {Number} newVote Represents the new vote type.
     * @param {Number} prevVote Represents the old vote type.
     */
    const voteOnArticle = async (articleId, newVote, prevVote) =>
    {
        setStatus('voting');
        try 
        {
            await contract.methods.voteOnArticle(articleId, newVote).send({ from: account });

            setArticles((prevArticles) => 
            (
                prevArticles.map((article) => 
                {
                    if (article.articleId !== articleId) return article;

                    let likes = article.likes;
                    let dislikes = article.dislikes;

                    if (prevVote === 1) likes--;
                    else if (prevVote === -1) dislikes--;

                    if (newVote === 1) likes++;
                    else if (newVote === -1) dislikes++;

                    return { ...article, likes, dislikes };
                })
            ));

            if (selectedArticleMeta?.articleId === articleId)
            {
                setSelectedArticleMeta((prevMetaData) =>
                {
                    let likes = prevMetaData.likes;
                    let dislikes = prevMetaData.dislikes;

                    if (prevVote === 1) likes--;
                    else if (prevVote === -1) dislikes--;

                    if (newVote === 1) likes++;
                    else if (newVote === -1) dislikes++;

                    return { ...prevMetaData, likes, dislikes };
                });
            }
            setVoteType(newVote);
        }
        catch (err)
        {
            console.error('Voting failed:', err);
            alert('Voting failed!');
        }
        finally
        {
            setStatus('ready');
        }
    };

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col md={2} className='d-flex flex-column align-items-center pt-5 gap-5 side-bar'>
                        <Button
                            variant='dark'
                            size='lg'
                            disabled={status !== 'ready'}
                            onClick={() =>
                                {
                                    setFilteredArticles('all');
                                    setSelectedArticleBody(null);
                                    setSelectedArticleMeta(null);
                                }
                            }
                        >
                            All Articles
                        </Button>
                        <Button
                            variant='dark'
                            size='lg'
                            disabled={status !== 'ready'}
                            onClick={() => 
                                {
                                    setFilteredArticles('mine');
                                    setSelectedArticleBody(null);
                                    setSelectedArticleMeta(null);
                                }
                            }
                        >
                            My Articles
                        </Button>
                    </Col>
                    <Col md={10} className='pe-5 pt-3 ps-5'>
                        <h1 className='text-center pb-2'>
                            {filteredArticles === 'all' ? 'All Articles' : 'My Articles'}
                            <span className='text-muted'> ({articles.length})</span>
                        </h1>
                        {status === 'loading' && <IsLoading msg='Loading Articles...' />}
                        {status === 'deleting' && <IsLoading msg='Deleting Article...' />}
                        {status === 'fetching' && <IsLoading msg='Fetching Article...' />}
                        {status === 'voting' && <IsLoading msg='Processing Vote...' />}
                        {
                            status === 'ready' && 
                            <>
                                {
                                    selectedArticleBody && selectedArticleMeta ? 
                                    <ViewArticle 
                                        articleBody={selectedArticleBody} 
                                        articleMetaData={selectedArticleMeta}
                                        account={account}
                                        onDelete={deleteArticle}
                                        onVote={voteOnArticle}
                                        prevVote={Number(voteType)}
                                    /> :
                                    <ListArticles 
                                        articles={articles}
                                        onArticleClick={articleClick} 
                                    />
                                }
                            </>
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AllArticlesPage;