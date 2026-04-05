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

    // Mapping of article id => account address => has voted true or false. 
    mapping(uint256 => mapping(address => bool)) hasVoted;

    // Article type.
    struct Article 
    {
        uint256 articleId;
        string cid;
        string title;
        uint256 publishedTime;
        address author;
        uint256 likes;
        uint256 dislikes;
        bool deleted;
    }

    // Article events defined for uploading, deleting, and voting.
    event ArticlePublishedEvent(address author, uint256 articleId);
    event ArticleDeletedEvent(address author, uint256 articleId);
    event VoteOnArticleEvent(address voter, uint256 _articleId, bool isLike);

    /// @notice Returns the total number of articles.
    /// @return count The total number of articles globally.
    function getArticleCount() public view returns (uint256 count)
    {
        count = articleCount;
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
            msg.sender,
            0,
            0,
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

        // Set cid to empty strings and set deleted flag to true.
        articleRef.cid = "";
        articleRef.deleted = true;

        emit ArticleDeletedEvent(msg.sender, _articleId);
    }

    /// @notice Adds like/dislike to specified article from a specific voter.
    /// @param _articleId The ID of the article which is voted on.
    /// @param isLike The like/dislike boolean check.
    function voteOnArticle(uint256 _articleId, bool isLike) public
    {
        // Require that this account has not liked/disliked this article.
        require(!hasVoted[_articleId][msg.sender], "Account already voted!");

        // Get reference to article from global store.
        Article storage articleRef = articles[_articleId];

        // Check if voter liked or disliked, then increment matching type.
        if (isLike)
        {
            articleRef.likes++;
        }
        else 
        {
            articleRef.dislikes++;
        }

        // Update mapping so that voter can not vote on this article again.
        hasVoted[_articleId][msg.sender] = true;

        emit VoteOnArticleEvent(msg.sender, _articleId, isLike);
    }

    /// @notice Returns a boolean check of user voting on a specific article.
    /// @param _articleId The ID of the article to check.
    /// @return voteCheck A boolean check on profile voting for this article.
    function getHasVoted(uint256 _articleId) public view returns (bool voteCheck)
    {
        voteCheck = hasVoted[_articleId][msg.sender];
    }
}
