import { Container, Row, Col, Button } from "react-bootstrap";
import { formatTime } from "./UtilTools";

function ViewArticle({ articleBody, articleMetaData, account, onDelete, onVote, hasVoted }) 
{
    const isOwner = articleMetaData.author.toLowerCase() === account.toLowerCase();

    const deleteCheck = () =>
    {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        onDelete(articleMetaData.articleId);
    };

    const voteCheck = (isLike) =>
    {
        onVote(articleMetaData.articleId, isLike);
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
                            hasVoted && 
                            <small className='d-flex align-items-center'>
                                <b>Already Voted!</b>
                            </small>
                        }
                        <Button 
                            variant='outline-success'
                            size='lg'
                            disabled={hasVoted}
                            onClick={() => voteCheck(true)}
                        >
                            👍 {Number(articleMetaData.likes)}
                        </Button>
                        <Button 
                            variant='outline-danger'
                            size='lg'
                            disabled={hasVoted}
                            onClick={() => voteCheck(false)}
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