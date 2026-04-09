import { Container, Row, Col } from "react-bootstrap";
import newsImg from '../assets/news-home.jpg';

/**
 * HomePage functional component
 * Displays the welcome screen once connected with MetaMask account.
 * @component
 * @returns {JSX.Element} The rendered HomePage component.
 */
function HomePage()
{
    return (
        <Container>
            <h1 className='pt-4 pb-2 text-center'>WELCOME TO THE NEWS MAKER DAPP!</h1>
            <hr />
            <h3 className='text-center my-4'>
                A distrubted news making and sharing platform built using blockchain and IPFS storage.
            </h3>
            <Row className='mt-5'>
                <Col md={6}>
                    <p>
                        Get started by clicking the <b>All Articles</b> link to view all the articles created by fellow users just like yourself! Don't forget to give a like/dislike whilst reading articles. Users like you have the power to decide the quality and trustworthiness of the news on this platform. Make your voice heard! 
                    </p>
                    <p>
                        Make sure you also check out the <b>Create Article</b> link and perhaps create and publish your very own news article! Create a heading to standout, place sub-headings to section content, inform with text paragraphs, and strengthen your message with uploaded images.
                    </p>
                    <p>
                        Thank you for taking the time to read this section. We are honoured that you have chosen to participate in this community.
                    </p>
                    <h4 className='text-center pt-3'>
                        Now get out there and make some news!
                    </h4>
                </Col>
                <Col md={6}>
                    <img 
                        src={newsImg} 
                        alt='A stack of newspapers.' 
                        className='w-100 rounded border border-black' 
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;