import { formatTime, formatAddress } from "./UtilTools";

function ListArticles({ articles }) 
{
    return (
        <section>
            {
                articles.length === 0 ? 
                (
                    <h3>No articles found.</h3>
                ) :
                (
                    articles.map((article) =>
                        (
                            <div key={article.articleId}>
                                <h4>{article.title}</h4>
                                <p>Author: {formatAddress(article.author)}</p>
                                <p>Published on: {formatTime(article.publishedTime)}</p>
                                <p>Last updated: {formatTime(article.updatedTime)}</p>
                                <p>CID: {article.cid}</p>
                            </div>
                        )
                    )
                )
            }
        </section>
    );
};

export default ListArticles;