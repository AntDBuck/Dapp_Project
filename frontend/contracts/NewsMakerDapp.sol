// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/// @title Smart contract for News Maker Dapp.
contract NewsMakerDapp 
{
    // Globally define name of contract.
    string public contractName = "News Maker Dapp";

    // Globally define number of articles and map count to each article.
    uint256 public articleCount;
    mapping(uint256 => Article) public articles;

    // Mapping of article indices by author from global article source.
    mapping(address => uint256[]) public articlesByAuthor;

    // Article type.
    struct Article 
    {
        uint256 articleId;
        string cid;
        string title;
        uint256 publishedTime;
        uint256 updatedTime;
        address author;
        bool deleted;
    }

    // Article events defined for uploading, deleting, and updating.
    event ArticlePublishedEvent(address author, uint256 articleId);
    event ArticleDeletedEvent(address author, uint256 articleId);
    event ArticleUpdatedEvent(address author, uint256 articleId);

    /// @notice Returns the total number of articles.
    /// @return count The total number of articles globally.
    function getArticleCount() public view returns (uint256 count)
    {
        count = articleCount;
    }

    /// @notice Returns the total number of articles from a specific author.
    /// @param _author The address of the author.
    /// @return count The total number of articles from a author.
    function getArticleCountByAuthor(address _author) public view returns (uint256 count) 
    {
        count = articlesByAuthor[_author].length;
    }

    /// @notice Returns the total number of articles from the current author.
    /// @return count The total number of articles of the current author.
    function getMyArticleCount() public view returns (uint256 count)
    {
        count = articlesByAuthor[msg.sender].length;
    }

    /// @notice Returns all articles.
    /// @return allArticles All articles in an array.
    function getAllArticles() public view returns (Article[] memory)
    {
        // Check an article exists.
        require(articleCount >= 1, "No articles have been published.");

        // New count for all non-deleted articles.
        uint nonDeletedCount = 0;

        // Loop through articleCount...
        for (uint index = 1; index <= articleCount; index++)
        {
            // Increment non-deleted article count if article delete flag is not deleted.
            if (!articles[index].deleted)
            {
                nonDeletedCount++;
            }
        }

        // New article array to hold all non-deleted articles.
        Article[] memory allArticles = new Article[](nonDeletedCount);
        // Index for allArticles.
        uint newIndex = 0;

        // Loop through articleCount...
        for (uint index = 1; index <= articleCount; index++)
        {
            // Add article to allArticles array if article has not been deleted.
            if (!articles[index].deleted)
            {
                allArticles[newIndex] = articles[index];
                newIndex++;
            }
        }

        return allArticles;
    }

    /// @notice Returns a specific article based on author address and article ID.
    /// @param _author The address of the author.
    /// @param _index The position of the article in the author-article mapping.
    /// @return article The requested article from memory.
    function getArticleByAuthor(address _author, uint256 _index) public view returns (Article memory article)
    {
        uint256 articleIndex = articlesByAuthor[_author][_index];
        article = articles[articleIndex];
    }

    /// @notice Returns the article of the current user based on article ID.
    /// @param _index The position of the article in the author-article mapping.
    /// @return article The requested article from memory.
    function getMyArticle(uint256 _index) public view returns (Article memory article)
    {
        uint256 articleIndex = articlesByAuthor[msg.sender][_index];
        article = articles[articleIndex];
    }

    /// @notice Uploads new article metadata onto blockchain.
    /// @param _cid The Content ID of the article on the IPFS network.
    /// @param _title The title used in the article.
    function publishArticle(string memory _cid, string memory _title) public 
    {
        // Non-empty field checks.
        require(
            bytes(_cid).length > 0 && 
            bytes(_title).length > 0 && 
            msg.sender != address(0)
        );

        // Increment global article count.
        articleCount++;

        // New article ID mapped to incremented global count.
        uint256 newArticleId = articleCount;

        // Define new article.
        Article memory newArticle = Article(
            newArticleId,
            _cid,
            _title,
            block.timestamp,
            block.timestamp,
            msg.sender,
            false
        );

        // Add new article to global mapping.
        articles[newArticleId] = newArticle;

        // Add new article reference to author's array.
        articlesByAuthor[msg.sender].push(newArticleId);

        emit ArticlePublishedEvent(msg.sender, newArticleId);
    }

    /// @notice Deletes article specified via article ID.
    /// @param _articleId The ID of the article to delete.
    function deleteArticle(uint256 _articleId) public 
    {
        // Get reference to article from global store.
        Article storage articleRef = articles[_articleId];

        // Authorisation and deletion check.
        require(articleRef.author == msg.sender, "Must be author of article to delete!");
        require(articleRef.deleted != true, "Article has already been deleted!");

        // Set cid to empty strings, update updated timestamp, and set deleted flag to true.
        articleRef.cid = "";
        articleRef.updatedTime = block.timestamp;
        articleRef.deleted = true;

        emit ArticleDeletedEvent(msg.sender, _articleId);
    }

    /// @notice Update article content (title).
    /// @param _articleId The ID of the article to update.
    /// @param _title The title used in the article.
    function updateArticle(uint256 _articleId, string memory _title) public 
    {
        // Get reference to article from storage.
        Article storage articleRef = articles[_articleId];

        // Authorisation check and deletion check.
        require(articleRef.author == msg.sender, "Must be author of article to update!");
        require(articleRef.deleted != true, "Article has been deleted!");

        // Set old values to passed values and update updated timestamp.
        articleRef.title = _title;
        articleRef.updatedTime = block.timestamp;

        emit ArticleUpdatedEvent(msg.sender, _articleId);
    }
}
