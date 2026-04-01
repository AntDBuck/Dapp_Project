import { useState, useEffect } from "react";
import Title from "../components/Title";
import IsLoading from "../components/IsLoading";
import ListArticles from "../components/ListArticles";
import { Container, Row, Col } from "react-bootstrap";

function AllArticlesPage({ contract, account })
{
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => 
    {
        const loadArticles = async () =>
        {
            if (!contract) return;

            try 
            {
                const allArticles = await contract.methods.getAllArticles().call({ from: account });

                const formattedArticles = allArticles.map((article) => 
                (    
                    {
                        articleId: article.articleId,
                        cid: article.cid,
                        title: article.title,
                        publishedTime: article.publishedTime,
                        updatedTime: article.updatedTime,
                        author: article.author
                    }
                ));

                setArticles(formattedArticles);
                setLoading(false);
            }
            catch (err) 
            {
                console.error('Could not get articles:', err);
                setLoading(false);
            };
        };

        loadArticles();
        console.log(contract)
    }, [contract, account]
    );

    return (
        <div>
            <Title titleString='All Articles' />
            {loading ? <IsLoading /> : 
                <Container>
                    <Row>
                        <Col md={3}>
                            <p>Sorting and filtering component goes here</p>
                        </Col>
                        <Col md={6}>
                            <ListArticles articles={articles} />
                        </Col>
                    </Row>
                </Container>
            }
        </div>
    );
};

export default AllArticlesPage;