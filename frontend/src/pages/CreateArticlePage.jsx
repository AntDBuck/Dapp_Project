import { useDraggable, useDroppable, DragDropProvider } from '@dnd-kit/react';
import { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { generateId, imgCompressAndBase64Convert, titleValidator } from '../components/UtilTools';
import IsLoading from '../components/IsLoading';

/**
 * Drag block which utilises draggable hook from DND-Kit.
 * Acts as a draggable interface block for the rendering of specific components.
 * @param {string} props.blockType A string representing the type of block to render.
 * @param {boolean} props.disabled A boolean status to control button operation.
 * @component
 * @returns {JSX.Element} A draggable bootstrap button.
 */
function DragBlock({ blockType, disabled }) 
{
    const { ref } = useDraggable({ id: blockType, disabled });

    return ( 
        <Button ref={ref} disabled={disabled} variant='dark' size='lg' className='drag-block'>
            {blockType}
        </Button>
    );
};

/**
 * Drop box slots which utilise the droppable hook from DND-Kit.
 * Dropped blocks render inside slots.
 * @param {string} props.id The unique ID for the slot.
 * @param {Object || string} props.children The rendered content in the slot.
 * @component
 * @returns {JSX.Element} A droppable slot.
 */
function DropBox({ id, children }) 
{
    const { ref } = useDroppable({ id });

    return (
        <div ref={ref} className='drop-box'>
            {children || 'Drop Here'} 
        </div>
    );
};

/**
 * Renders content into a slot based on draggable block type.
 * @param {Object} block The block data that holds block type.
 * @param {function} onContentChange Function to handle content change from inputs and images. 
 * @component
 * @returns {JSX.Element} A rendered text or image.
 */
function RenderBlock({ block, onContentChange }) 
{
    /**
     * Handles image selection, conversion, and compression.
     * @param {event} e The uploaded image changed event. 
     */
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

/**
 * Create Article Page functional component.
 * Features:
 * - Renders draggable block and dropbox interfaces.
 * - Manages row, column, and block states.
 * - Monitors and disables buttons if conditions are met.
 * @param {string} props.account The hexidecimal string representing user's account.
 * @param {Contract} props.contract The smart contract.
 * @component
 * @returns {JSX.Element} Renders interactive article maker page.
 */
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

    /**
     * Handles the adding of blocks to rows and columns and updates row state.
     * @param {Object} source The draggable block.
     * @param {Object} target The dropzone column.
     */
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

    /**
     * Handles the adding of a single row with a single column.
     * The row state is updated.
     */
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

    /**
     * Handles the adding of a single row with two columns.
     * The row state is updated.
     */
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

    /**
     * Handles the removing of a row.
     * The row state is updated.
     * @param {string} rowId The ID that represents the row to delete.
     */
    const removeRow = (rowId) => 
    (   
        setRows((prevRows) => 
        (
            prevRows.filter((row) => row.id !== rowId)
        ))
    );

    /**
     * Handles the updating of block content after user input.
     * The row state is updated.
     * @param {string} colId The ID that represents the column to update.
     * @param {string} newContent A string representation of text and images.
     */
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

    /**
     * Handles the publishing of articles.
     * Features:
     * - constructs new data from row, column, block state.
     * - POST JSON version of data to backend (then sent to IPFS Gateway).
     * - Retreives CID from backend.
     * - Article metadata (CID and title) is added to the blockchain.
     */
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

            // Backend endpoint.
            const response = await fetch('http://localhost:5000/upload-json-data', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleData)
            });

            const responsedData = await response.json();

            if (!responsedData.cid) 
            {
                alert('failed to upload article!');
                return;
            }

            const cid = responsedData.cid;
            console.log('Article uploaded:', cid);

            await contract.methods.publishArticle(cid, articleTitle).send({ from: account });

            alert('Article Successfully Published!');
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
                <Col md={2} className='side-bar'>
                    <div className='d-flex flex-column align-items-center gap-5 p-2 mt-5 side-bar-buttons'>
                        <DragBlock blockType='Sub-Heading' disabled={status} />
                        <DragBlock blockType='Text' disabled={status} />
                        <DragBlock blockType='Image' disabled={status || imgCount >= 4} />
                        {
                            imgCount >= 4 && 
                            (
                                <small className='text-center text-danger'>
                                    <b>A limit of 4 images per article!</b>
                                </small>
                            )
                        }       
                    </div>
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