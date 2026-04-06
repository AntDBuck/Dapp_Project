import { useDraggable, useDroppable, DragDropProvider } from '@dnd-kit/react';
import { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { generateId, imgCompressAndBase64Convert, titleValidator } from '../components/UtilTools';
import IsLoading from '../components/IsLoading';

function DragBlock({ blockType, disabled }) 
{
    const { ref } = useDraggable({ id: blockType, disabled });

    return ( 
        <Button ref={ref} disabled={disabled} variant='dark' className='drag-block'>
            {blockType}
        </Button>
    );
};

function DropBox({ id, children }) 
{
    const { ref } = useDroppable({ id });

    return (
        <div ref={ref} className='drop-box'>
            {children || 'Drop Here'} 
        </div>
    );
};

function RenderBlock({ block, onContentChange }) 
{
    const imageChange = async (e) => 
    {
        const imgFile = e.target.files[0];
        if (!imgFile) return;

        const base64Img = await imgCompressAndBase64Convert(imgFile);
        onContentChange(base64Img);
    }

    if (!block) return null;

    switch (block.blockType) 
    {
        case 'Sub-Heading':
            return <input 
                        type='text' 
                        value={block.blockContent || ''} 
                        placeholder='Sub-Heading...'
                        maxLength={50}
                        onChange={(e) => onContentChange(e.target.value)}
                        className='inputs input-headings'
                    />
        case 'Text':
            return <textarea
                        value={block.blockContent || ''} 
                        placeholder='Text...'
                        maxLength={1000}
                        onChange={(e) => 
                        {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px'
                            onContentChange(e.target.value)
                        }}
                        className='inputs'
                    />
        case 'Image': 
            return ( 
                <div className='d-flex flex-column align-items-center w-100 mx-5 my-1'>
                    {block.blockContent ? <img src={block.blockContent} className='inputs-img'/> : null}
                    <input type='file' accept='image/*' onChange={imageChange} />
                </div>
            )
        default:
            return null;
    }
};

function CreateArticlePage({ account, contract }) 
{
    const [ status, setStatus ] = useState(false);
    const [ articleTitle, setArticleTitle ] = useState('');

    const [ rows, setRows ] = useState(
        [
            {id: generateId(), columns : [{ id: generateId(), block: null }]}
        ]
    );
    
    const imgCount = rows
    .flatMap((row) => row.columns)
    .filter((col) => col.block?.blockType === 'Image').length;

    const inRowLimit = rows.length < 10;

    const addBlock = (source, target) => 
    (
        setRows((prevRows) => 
        (
            prevRows.map((row) => 
            (
                {
                    ...row,
                    columns: row.columns.map((col) => 
                    (
                        col.id === target.id ? 
                        {
                            ...col, 
                            block: {blockId: generateId(), blockType: source.id, blockContent: ''}
                        } 
                        : col
                    ))
                }
            ))
        ))
    );

    const addFullRow = () => 
    (
        setRows((prevRows) => 
        [
            ...prevRows, 
            {
                id: generateId(), 
                columns: [{ id: generateId(), block: null }]
            }
        ])
    );

    const addHalfRow = () => 
    (
        setRows((prevRows) => 
        [
            ...prevRows,
            {
                id: generateId(),
                columns: 
                [
                    {id: generateId(), block: null},
                    {id: generateId(), block: null}
                ]
            }
        ])
    );

    const removeRow = (rowId) => 
    (   
        setRows((prevRows) => 
        (
            prevRows.filter((row) => row.id !== rowId)
        ))
    );

    const updateContent = (colId, newContent) => 
    (
        setRows((prevRows) => 
        (
            prevRows.map((row) => 
            (
                {
                    ...row,
                    columns: row.columns.map((col) => 
                    (
                        col.id === colId ? 
                        {
                            ...col, 
                            block: {...col.block, blockContent: newContent}
                        }
                        : col
                    )) 
                }
            ))
        ))
    );

    const publishArticle = async () => 
    {
        setStatus(true);
        try 
        {
            if (!account || !contract) 
            {
                alert('Account or contract not loaded. Please try again.');
                return;
            }

            if (!articleTitle.trim()) 
            {
                alert('Article title empty. Please add a title.');
                return;
            }

            const articleData = 
            {
                title: articleTitle,
                rows: rows.map((row) => 
                (
                    {
                        columns: row.columns.map((col) => 
                        (
                            {
                                block: col.block ? 
                                {
                                    blockType: col.block.blockType,
                                    blockContent: col.block.blockContent
                                }
                                : null
                            }
                        ))
                    }
                ))
            }

            const response = await fetch('http://localhost:5000/upload-json-data', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleData)
            });

            const responsedData = await response.json();

            if (!responsedData.cid) 
            {
                alert('falied to upload article!');
                return;
            }

            const cid = responsedData.cid;
            console.log('Article uploaded:', cid);

            await contract.methods.publishArticle(cid, articleTitle).send({ from: account });
        }
        catch (err) 
        {
            console.error('Error, could not publish article:', err);
        }
        finally
        {
            setStatus(false);
        }
    };

    return (
        <DragDropProvider
            onDragEnd={(e) => 
            { 
                if (e.canceled) return;

                const { source, target } = e.operation;

                if (!target) return;
                addBlock(source, target);
            }}
        >
            <Row>
                <Col md={2} className='d-flex flex-column align-items-center p-4 gap-4 side-bar'>
                    <DragBlock blockType='Sub-Heading' disabled={status} />
                    <DragBlock blockType='Text' disabled={status} />
                    <DragBlock blockType='Image' disabled={status || imgCount >= 4} />
                    {
                        imgCount >= 4 && 
                        (
                            <small className='text-center text-danger'>
                                A limit of 4 images per article
                            </small>
                        )
                    }
                </Col>
                <Col md={10} className='p-5'>
                    {
                        status ? <IsLoading msg='Publishing Article...' /> :
                        <>
                            <Row>
                                <div className='d-flex justify-content-center mb-4'>
                                    <input
                                        type='text'
                                        value={articleTitle} 
                                        onChange={(e) => setArticleTitle(titleValidator(e.target.value))}
                                        placeholder='Article Title'
                                        maxLength={30}
                                        className='form-control mx-5 py-2 input-title'
                                    />
                                </div>
                                {
                                    rows.map((row) => 
                                    (
                                        <Row key={row.id}>
                                            {
                                                row.columns.map((col) => 
                                                (
                                                    <Col 
                                                        key={col.id}
                                                        md={12 / row.columns.length}
                                                        className='mb-2'
                                                    >
                                                        <DropBox id={col.id}>
                                                            <RenderBlock
                                                                block={col.block} 
                                                                onContentChange={(content) => updateContent(col.id, content)}
                                                            />
                                                        </DropBox>
                                                    </Col>
                                                ))
                                            }
                                            <div className='text-center mb-4'>
                                                <Button
                                                    onClick={() => removeRow(row.id)}
                                                    variant='danger'
                                                    size='sm'
                                                >
                                                    Remove Row
                                                </Button>
                                            </div>
                                        </Row>
                                    ))
                                }
                            </Row>
                            {
                                !inRowLimit && 
                                <p className='text-danger text-center'>Row limit of 10 reached!</p>
                            }
                            <div className='d-flex justify-content-center gap-5 mt-2'>
                                <Button disabled={!inRowLimit} onClick={addFullRow}>
                                    Add Whole Slot
                                </Button>
                                <Button disabled={!inRowLimit} onClick={addHalfRow}>
                                    Add Half Slots
                                </Button>
                            </div>
                            <div className='text-center mt-4'>
                                <Button 
                                    onClick={publishArticle}
                                    variant='success' 
                                    size='lg'
                                >
                                    Publish Article
                                </Button>
                            </div>
                        </>
                    }
                </Col>
            </Row>
        </DragDropProvider>
    );
};

export default CreateArticlePage;