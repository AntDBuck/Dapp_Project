import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import IsLoading from "../components/IsLoading";
import ListArticles from "../components/ListArticles";
import ViewArticle from "../components/ViewArticle";

function AllArticlesPage({ contract, account }) 
{
    const [articles, setArticles] = useState([]);
    const [status, setStatus] = useState('loading');
    const [filteredArticles, setFilteredArticles] = useState('all');
    const [selectedArticleBody, setSelectedArticleBody] = useState(null);
    const [selectedArticleMeta, setSelectedArticleMeta] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() =>
    {
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
                            likes: article.likes,
                            dislikes: article.dislikes,
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
                                    likes: article.likes,
                                    dislikes: article.dislikes,
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

            const voted = await contract.methods.getHasVoted(metaData.articleId).call({ from: account });
            setHasVoted(voted);
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

    const voteOnArticle = async (articleId, isLike) =>
    {
        setStatus('voting');
        try 
        {
            await contract.methods.voteOnArticle(articleId, isLike).send({ from: account });

            setArticles((prevArticles) => 
            (
                prevArticles.map((article) => 
                (
                    article.articleId === articleId ?
                    {
                        ...article,
                        likes: isLike ? Number(article.likes) + 1 : article.likes,
                        dislikes: !isLike ? Number(article.dislikes) + 1 : article.dislikes
                    }
                    : article
                ))
            ));

            if (selectedArticleMeta?.articleId === articleId)
            {
                setSelectedArticleMeta((prevMetaData) =>
                (
                    {
                        ...prevMetaData,
                        likes: isLike ? Number(prevMetaData.likes) + 1 : prevMetaData.likes,
                        dislikes: !isLike ? Number(prevMetaData.dislikes) + 1 : prevMetaData.dislikes
                    }
                ));
            }
            setHasVoted(true);
        }
        catch (err)
        {
            console.error('Voting failed:', err);
            alert('You have already voted!');
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
                                        hasVoted={hasVoted}
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