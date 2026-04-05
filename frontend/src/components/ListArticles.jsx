import { Button } from "react-bootstrap";
import { formatTime, formatAddress } from "./UtilTools";

function ListArticles({ articles, onArticleClick }) {
    return (
        <section className='article-card-section gap-1'>
            {articles.length === 0 ? (<h3>No articles found.</h3>) : (
                articles.map((article) => (
                    <Button
                        key={article.articleId}
                        onClick={() => onArticleClick(article.cid)}
                        variant='outline-dark'
                        className='article-button'
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
            )}
        </section>
    );
};

export default ListArticles;