import { useDraggable, useDroppable, DragDropProvider } from '@dnd-kit/react';
import { useState } from 'react';
import { generateId } from '../components/UtilTools';
import { Row, Col, Button } from 'react-bootstrap';
import '../styles/createArticle.css'

function DragBlock({ blockType, disabled }) {
    const { ref } = useDraggable({ id: blockType, disabled });

    return ( 
        <Button ref={ref} disabled={disabled} variant='dark' className='drag-block'>
            {blockType}
        </Button>
    );
};

function DropBox({ id, children }) {
    const { ref } = useDroppable({ id });

    return (
        <div ref={ref} className='drop-box'>
            {children || 'Drop Here'} 
        </div>
    );
};

function RenderBlock({ block, onContentChange }) {
    const imageChangeHandler = (e) => {
        const imgFile = e.target.files[0];
        if (!imgFile) return;

        const reader = new FileReader();
        reader.onload = () => onContentChange(reader.result);

        reader.readAsDataURL(imgFile);
    }

    if (!block) return null;

    switch (block.blockType) {
        case 'Heading':
            return <input 
                        type='text' 
                        value={block.blockContent || ''} 
                        placeholder='Heading...' 
                        onChange={(e) => onContentChange(e.target.value)}
                        className='inputs input-headings'
                    />
        case 'Sub-Heading':
            return <input 
                        type='text' 
                        value={block.blockContent || ''} 
                        placeholder='Sub-Heading...' 
                        onChange={(e) => onContentChange(e.target.value)}
                        className='inputs input-headings'
                    />
        case 'Text':
            return <textarea 
                        value={block.blockContent || ''} 
                        placeholder='Text...' 
                        onChange={(e) => onContentChange(e.target.value)}
                        className='inputs'
                    />
        case 'Image': 
            return ( 
                <div className='d-flex flex-column'>
                    {block.blockContent ? <img src={block.blockContent} className='inputs-img'/> : null}
                    <input type='file' accept='image/*' onChange={imageChangeHandler} />
                </div>
            )
        default:
            return null;
    }
}

function CreateArticlePage({ account, contract }) {
    const [ articleTitle, setArticleTitle ] = useState('');

    const [ slots, setSlots ] = useState([
        {id: generateId(), slotWidth: 'full', block: null},
    ]);

    const imgCount = slots.filter((slot) => slot.block?.blockType === 'Image').length;

    const addBlockHandler = (source, target) => {
        setSlots((prevState) => (
            prevState.map((slot) => {
                if (slot.id === target.id) {
                    return {...slot, 
                        block: { 
                            blockId: generateId(), 
                            blockType: source.id, 
                            blockContent: '' 
                        }
                    };
                }
                return slot;
            }))
        )
    };

    const addFullSlotHandler = () => (
        setSlots((prevState) => [
            ...prevState, 
            {id: generateId(), slotWidth: 'full', block: null}
        ])
    );

    const addHalfSlotsHandler = () => (
        setSlots((prevState) => [
            ...prevState, 
            {id: generateId(), slotWidth: 'half', block: null},
            {id: generateId(), slotWidth: 'half', block: null}
        ])
    );

    const removeSlotHandler = (slotId) => (
        setSlots((prevState) => (
            prevState.filter(slot => slot.id !== slotId)
        ))
    );

    const updateContentHandler = (slotId, newContent) => {
        setSlots((prevState) => (
            prevState.map((slot) => (
                slot.id === slotId ? {...slot, block: {...slot.block, blockContent: newContent}} : slot
            ))
        ))
    };

    const publishArticleHandler = async () => {
        try {
            if (!account || !contract) {
                alert('Account or contract not loaded. Please try again.');
                return;
            }

            if (!articleTitle.trim()) {
                alert('Article title empty. Please add a title.');
                return;
            }

            const articleData = {
                title: articleTitle,
                blocks: slots.map((slot) => ({
                    blockType: slot.block?.blockType || null,
                    blockContent: slot.block?.blockContent || null
                }))
            }

            const response = await fetch('http://localhost:5000/upload-json-data', {
                method: 'POST',
                body: new Blob([JSON.stringify(articleData)],
                    { type: 'application/json'} 
                )
            });

            const responsedData = await response.json();

            if (!responsedData.cid) {
                alert('falied to upload article!');
                return;
            }

            const cid = responsedData.cid;
            console.log('Article uploaded:', cid);

            await contract.methods.publishArticle(cid, articleTitle)
                .send({ from: account }
            );
        }
        catch (err) {
            console.error('Error, could not publish article:', err);
        }
    };

    return (
        <DragDropProvider
            onDragEnd={(e) => { 
                if (e.canceled) return;

                const { source, target } = e.operation;

                if (!target) return;

                if (target) addBlockHandler(source, target);
            }}
        >
            <Row>
                <Col md={2} className='d-flex flex-column align-items-center p-4 gap-3 side-bar'>
                    <DragBlock blockType='Heading' />
                    <DragBlock blockType='Sub-Heading' />
                    <DragBlock blockType='Text' />
                    <DragBlock blockType='Image' disabled={imgCount >= 4} />
                    {imgCount >= 4 && (
                        <small className='text-center text-danger'>
                            A limit of 4 images per article
                        </small>
                    )}
                </Col>
                <Col md={10} className='p-5 border'>
                    <Row>
                        {slots.map((slot) => (
                            <Col 
                                key={slot.id}
                                md={slot.slotWidth === 'full' ? 12 : 6}
                                className='mb-3'
                            >
                                <DropBox id={slot.id}>
                                    <RenderBlock
                                        block={slot.block} 
                                        onContentChange={(value) => updateContentHandler(slot.id, value)}
                                    />
                                </DropBox>
                                <div className='text-center mt-2'>
                                    <Button
                                        onClick={() => removeSlotHandler(slot.id)}
                                        variant='danger'
                                        size='sm'
                                    >
                                        Remove Slot
                                    </Button>
                                </div>
                        </Col>
                    ))}
                    </Row>
                    <div className='d-flex justify-content-center gap-5 mt-2'>
                        <Button onClick={addFullSlotHandler}>
                            Add Full Slot
                        </Button>
                        <Button onClick={addHalfSlotsHandler}>
                            Add Half Slots
                        </Button>
                    </div>
                    <div className='d-flex justify-content-center align-items-center mt-4 gap-3'>
                        <input
                            type='text'
                            value={articleTitle} 
                            onChange={(e) => setArticleTitle(e.target.value)}
                            placeholder='Article Title'
                            className='form-control w-50'
                        />
                        <Button 
                            onClick={publishArticleHandler}
                            variant='success' 
                            size='lg'
                        >
                            Publish Article
                        </Button>
                    </div>
                </Col>
            </Row>
        </DragDropProvider>
    );
};

export default CreateArticlePage;