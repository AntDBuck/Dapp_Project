// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/// @title Smart contract for News Maker Dapp.
contract NewsMakerDapp 
{
    // Globally define name of contract.
    string public contractName = "News Maker Dapp";

    // Globally define number of articles and map count to each article.
    uint256 public allArticlesCount;
    mapping(uint256 => Article) public allArticles;

    // Define number of articles per user.
    mapping(address => uint256) internal totalArticlesOf;
    // Define article ownership from user address and number of articles.
    mapping(address => mapping(uint256 => Article)) internal articleOf;

    // Article type.
    struct Article 
    {
        uint256 articleId;
        string cid;
        string title;
        string description;
        uint256 publishedTime;
        uint256 updatedTime;
        address author;
        bool deleted;
    }

    // Article events defined for uploading, deleting, and updating.
    event ArticlePublishedEvent(address author, uint256 articleId);
    event ArticleDeletedEvent(address author, uint256 articleId);
    event ArticleUpdatedEvent(address author, uint256 articleId);

    /// @notice Returns the total number of all articles.
    /// @return count The total number of articles globally.
    function getAllArticleCount() public view returns (uint256 count)
    {
        count = allArticlesCount;
    }

    /// @notice Returns the total number of articles from a specific publisher.
    /// @param _user The address of the publisher.
    /// @return count The total number of articles from a publisher.
    function getTotalArticleCountOf(address _user) public view returns (uint256 count) 
    {
        count = totalArticlesOf[_user];
    }

    /// @notice Returns the total number of articles from the current publisher.
    /// @return count The total number of articles of the current publisher.
    function getMyTotalArticleCount() public view returns (uint256 count)
    {
        count = totalArticlesOf[msg.sender];
    }

    /// @notice Returns a specific article based on publisher address and article ID.
    /// @param _user The address of the publisher.
    /// @param _articleId The ID of the article to get.
    /// @return article The requested article from memory.
    function getArticleOf(address _user, uint256 _articleId) public view returns (Article memory article)
    {
        article = articleOf[_user][_articleId];
    }

    /// @notice Returns the article of the current user based on article ID.
    /// @param _articleId The ID of the article to get.
    /// @return article The requested article from memory.
    function getMyArticle(uint256 _articleId) public view returns (Article memory article)
    {
        article = articleOf[msg.sender][_articleId];
    }

    /// @notice Uploads new article metadata onto blockchain.
    /// @param _cid The Content ID of the article on the IPFS network.
    /// @param _title The title used in the article.
    /// @param _description The brief description describing the article.
    function publishArticle(string memory _cid, string memory _title, string memory _description) public 
    {
        // Non-empty field checks.
        require(
            bytes(_cid).length > 0 && 
            bytes(_title).length > 0 && 
            bytes(_description).length > 0 &&
            msg.sender != address(0)
        );

        // Increment global article count and user article count.
        allArticlesCount++;
        totalArticlesOf[msg.sender]++;

        // New article ID mapped to incremented global count.
        uint256 newArticleId = allArticlesCount;

        // Define new article.
        Article memory newArticle = Article(
            newArticleId,
            _cid,
            _title,
            _description,
            block.timestamp,
            block.timestamp,
            msg.sender,
            false
        );

        // Add new article to global mapping.
        allArticles[newArticleId] = newArticle;

        // Add new article to user mapping.
        articleOf[msg.sender][totalArticlesOf[msg.sender]] = newArticle;

        emit ArticlePublishedEvent(msg.sender, newArticleId);
    }

    /// @notice Deletes article specified via article ID.
    /// @param _articleId The ID of the article to delete.
    function deleteArticle(uint256 _articleId) public 
    {
        // Get reference to article from storage.
        Article storage articleRef = articleOf[msg.sender][_articleId];

        // Authorisation check.
        require(articleRef.author == msg.sender);

        // Set fields to empty strings, update updated timestamp, and set deleted flag to true.
        articleRef.cid = "";
        articleRef.title = "";
        articleRef.description = "";
        articleRef.updatedTime = block.timestamp;
        articleRef.deleted = true;

        emit ArticleDeletedEvent(msg.sender, _articleId);
    }

    /// @notice Update article content (title and description).
    /// @param _articleId The ID of the article to update.
    /// @param _title The title used in the article.
    /// @param _description The brief description describing the article.
    function updateArticle(uint256 _articleId, string memory _title, string memory _description) public 
    {
        // Get reference to article from storage.
        Article storage articleRef = articleOf[msg.sender][_articleId];

        // Authorisation check and deletion check.
        require(articleRef.author == msg.sender);
        require(articleRef.deleted != true);

        // Set old values to passed values and update updated timestamp.
        articleRef.title = _title;
        articleRef.description = _description;
        articleRef.updatedTime = block.timestamp;

        emit ArticleUpdatedEvent(msg.sender, _articleId);
    }
}
