import { Container, Row, Col, Button } from "react-bootstrap";
import { formatTime } from "./UtilTools";

function ViewArticle({ articleBody, articleMetaData, account, onDelete }) 
{
    const isOwner = articleMetaData.author.toLowerCase() === account.toLowerCase();

    const deleteCheck = () => 
    {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        onDelete(articleMetaData.articleId);
    };

    return (
        <Container fluid className='border border-dark rounded py-4 px-5'>
            <div className='d-flex justify-content-between'>
                <div className='d-flex flex-column gap-3'>
                    <small><b>CID:</b> {articleMetaData.cid}</small>
                    <small><b>Author:</b> {articleMetaData.author}</small>
                </div>
                <div className='d-flex flex-column gap-3'>
                    <small><b>Date Published:</b> {formatTime(articleMetaData.publishedTime)}</small>
                    {
                        isOwner &&
                        <Button 
                            variant='danger'
                            size='sm'
                            onClick={deleteCheck}
                        >
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