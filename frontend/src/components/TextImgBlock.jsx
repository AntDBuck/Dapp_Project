import { Container, Row, Col } from "react-bootstrap";

function TextImgBlock(
    { 
        bgColor='#fff', 
        textColor='#000',
        h3Text='',
        pText='',  
        imgPath='', 
        altText='', 
        reverse=false 
    })
{
    return (
        <section style={{ backgroundColor: bgColor, color: textColor }} className='py-4'>
            <Container>
                <Row className='align-items-center text-center'>
                    <Col md={6} className={reverse ? 'order-md-2' : 'order-md-1'}>
                        <h3>{h3Text}</h3>
                        <p>{pText}</p>
                    </Col>
                    <Col md={6} className={reverse ? 'order-md-1' : 'order-md-2'}>
                        <img src={imgPath} alt={altText} className='w-100 rounded' />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default TextImgBlock;