const CommentModel = require("../models/Comment");
const PostModel = require("../models/Post");
const VALID_TAGS = [
  "Sudoku",
  "Poker",
  "Crossword",
  "Tic-Tac-Toe",
  "Suggestions",
  "Bugs",
  "Other",
];
/**
 * Class to fetch posts based of various parameters and
 * methods to make it easier to sort and format a response
 */
class Posts {
  constructor({ sortBy = "date", direction = "asc", query = "", tags = [] }) {
    this.sortBy = sortBy.toLowerCase();
    this.direction = direction.toLowerCase();
    this.query = query;
    this.tags = tags;
    this.posts = [];
  }

  /**
   * Takes in a value and inverts it if the order should be descending
   */
  _determineSortOrder(value) {
    if (this.sortBy == "desc") {
      return value * -1;
    }
    return value;
  }

  /**
   * Uses the author ids provided to the class and adds them all to the class post array
   */
  async getPosts() {
    let matchQuery = {
      $match: {
        $or: [
          { content: { $regex: this.query, $options: "i" } },
          { title: { $regex: this.query, $options: "i" } },
        ],
      },
    };
    if (this.tags.length != 0) {
      let tagsQuery = {
        $elemMatch: {
          $in: this.tags,
        },
      };
      matchQuery["$match"]["tags"] = tagsQuery;
    }
    let posts = await PostModel.aggregate([
      matchQuery,
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [{ $match: { $expr: { $eq: ["$$postId", "$post_id"] } } }],
          as: "comment_count",
        },
      },
      { $addFields: { comment_count: { $size: "$comment_count" } } },
    ]).exec();
    this.posts = posts;
  }

  /**
   * Sorts the class post array by compraring each element to the sortBy provided
   * (defaults to sorting by popularity)
   */
  sortPosts() {
    const sortProperty = this.sortBy;

    this.posts.sort((a, b) => {
      if (a[sortProperty] < b[sortProperty]) {
        return this._determineSortOrder(-1);
      } else if (a[sortProperty] > b[sortProperty]) {
        return this._determineSortOrder(1);
      }
      return 0;
    });
    return;
  }

  /**
   * Clears any duplicate posts in the class post array
   * Depends on a sort first since its only checking the post after it
   */
  removeDuplicates() {
    let lastId = 0;
    let isFirst = true;
    let filteredPosts = [];

    this.sortPosts();

    for (let i = 0; i < this.posts.length; i++) {
      if (i == this.posts.length) {
        break; //last post
      }

      const currentPost = this.posts[i];
      if (isFirst) {
        //Since lastId hasn't been set yet
        isFirst = false;
        lastId = currentPost.id;
        filteredPosts.push(currentPost);
      } else {
        if (currentPost.id != lastId) {
          filteredPosts.push(currentPost);
        }
        lastId = currentPost.id;
      }
    }

    this.posts = filteredPosts;
  }

  /**
   * Formatting the data to be a proper response
   * - Turning tags to an array
   */
  formatPosts() {
    for (let i = 0; i < this.posts.length; i++) {
      const tags = this.posts[i].tags;
      this.posts[i].tags = tags.split(",");
    }
  }
}

module.exports = async function getFormPosts(
  query,
  sortBy,
  direction,
  tags,
  callback
) {
  try {
    const posts = new Posts({
      query: query,
      sortBy: sortBy,
      direction: direction,
      tags: tags,
    });

    await posts.getPosts();
    callback(null, posts.posts);
  } catch (err) {
    callback(err, null);
  }
};
