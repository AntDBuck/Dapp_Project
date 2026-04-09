import { Button } from "react-bootstrap";
import { formatTime, formatAddress } from "./UtilTools";

/**
 * ListArticle functional component.
 * Displays a list of clickable article cards.
 * @param {Array} props.articles An array of articles.
 * @param {function} props.onArticleClick Reference to article click function. CID is passed back to parent.
 * @component
 * @returns {JSX.Element} The rendered list of articles.
 */
function ListArticles({ articles, onArticleClick }) 
{
    return (
        <section className='article-card-section gap-3'>
            {
                articles.length === 0 ? (<h3>No articles found.</h3>) : 
                (
                    articles.map((article) => 
                    (
                        <Button
                            key={article.articleId}
                            variant='outline-dark'
                            className='article-button'
                            onClick={() => onArticleClick(article.cid)}
                        >
                            <h5 className='mt-2'><b>{article.title}</b></h5>
                            <div className='article-card-content gap-4'>
                                <p><b>Author:</b> {formatAddress(article.author)}</p>
                                <p><b>Published on:</b> {formatTime(article.publishedTime)}</p>
                                <p><b>Likes:</b> {Number(article.likes)}</p>
                                <p><b>Dislikes:</b> {Number(article.dislikes)}</p>
                            </div>
                            <p><b>CID:</b> {article.cid}</p>
                        </Button>
                    ))
                )
            }
        </section>
    );
};

export default ListArticles;