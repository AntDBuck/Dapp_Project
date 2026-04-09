import { Container, Row, Col, Button } from "react-bootstrap";
import { formatTime } from "./UtilTools";

/**
 * ViewArticle functional component.
 * Renders and displays the requested article.
 * @param {Object} props.articleBody The article data arranged in rows and columns.
 * @param {Object} props.articleMetaData The metadata about the article (stored on blockchain).
 * @param {string} props.account The hexidecimal string representing user's account.
 * @param {function} props.onDelete Refernce to delete function in parent.
 * @param {function} props.onVote Reference to voting function in parent.
 * @param {Number} props.prevVote The old vote value.
 * @component
 * @returns {JSX.Element} The rendered article.
 */
function ViewArticle({ articleBody, articleMetaData, account, onDelete, onVote, prevVote }) 
{
    const isOwner = articleMetaData.author.toLowerCase() === account.toLowerCase();

    const deleteCheck = () =>
    {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        onDelete(articleMetaData.articleId);
    };

    /**
     * Callback function to parent.
     * Handles the passing of a new vote after a click.
     * Enables unvoting functionailty.
     * @param {Number} newVote A number that represents the button clicked.
     */
    const voteCheck = (newVote) =>
    {
        const trueVote = newVote === prevVote ? 0 : newVote;
        onVote(articleMetaData.articleId, trueVote, prevVote);
    };

    return (
        <Container fluid className='border border-dark rounded py-4 px-5 article-view'>
            <div className='d-flex justify-content-between'>
                <div className='d-flex flex-column gap-3'>
                    <small><b>CID:</b> {articleMetaData.cid}</small>
                    <small><b>Author:</b> {articleMetaData.author}</small>
                    <small><b>Date Published:</b> {formatTime(articleMetaData.publishedTime)}</small>
                </div>
                <div className='d-flex flex-column gap-4'>
                    <div className='d-flex gap-3'>
                        {
                            prevVote !== 0 && 
                            <small 
                                className={`
                                    d-flex 
                                    align-items-center 
                                    ${prevVote === 1 ? 'text-success' : 'text-danger'}
                                `}
                            >
                                <b>{prevVote === 1 ? 'Article Liked' : 'Article Disliked'}</b>
                            </small>
                        }
                        <Button 
                            variant='outline-success'
                            size='lg'
                            onClick={() => voteCheck(1)}
                        >
                            👍 {Number(articleMetaData.likes)}
                        </Button>
                        <Button 
                            variant='outline-danger'
                            size='lg'
                            onClick={() => voteCheck(-1)}
                        >
                            👎 {Number(articleMetaData.dislikes)}
                        </Button>
                    </div>
                    {
                        isOwner &&
                        <Button variant='danger' onClick={deleteCheck}>
                            Delete Article
                        </Button>
                    }
                </div>
            </div>
            <hr />
            <h1 className='text-center'>{articleBody.title}</h1>
            <hr />
            {
                articleBody.rows?.map((row, rowIndex) => 
                (
                    <Row key={rowIndex}>
                        {
                            row.columns?.map((col, colIndex) => 
                            {
                                const block = col.block;
                                if (!block) return null;

                                const colWidth = (12 / row.columns.length);

                                return (
                                    <Col key={colIndex} md={colWidth}>
                                        {
                                            block.blockType === 'Sub-Heading' && 
                                            (
                                                <h3 className='text-center'>{block.blockContent}</h3>
                                            )
                                        }
                                        {
                                            block.blockType === 'Text' && 
                                            (
                                                <p>{block.blockContent}</p>                               
                                            )
                                        }
                                        {
                                            block.blockType === 'Image' && 
                                            (
                                                <img src={block.blockContent} className='w-100' />
                                            )
                                        }
                                    </Col>
                                );
                            })
                        }
                    </Row>
                ))
            }
        </Container>
    )
};

export default ViewArticle;