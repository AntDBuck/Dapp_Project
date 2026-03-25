import { Container } from "react-bootstrap";

function Title( {titleString} ) 
{
    const titleStyle = {
        paddingTop: '1rem',
        paddingBottom: '1rem',
        textAlign: 'center'
    };

    return (
        <section style={titleStyle}>
            <Container>
                <h1>{titleString}</h1>
            </Container>
        </section>
    );
};

export default Title;