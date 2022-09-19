const TokenModel = require("../models/Token");
const UserModel = require("../models/User");
const PostModel = require("../models/Post");

var crypto = require("crypto");
const bcrypt = require('bcrypt');
const utils = require("../utils");

const SALT_ROUNDS = 10;
const VALID_TAGS = ["Sudoku", "Poker", "Crossword", "Tic-Tac-Toe", "Suggestions", "Bugs", "Other"];

module.exports = async function createForumPost(token, title, content, tags, callback) {
    utils.is_valid_post(title, content, tags, (err) => {
        if (err) {
            callback(err, null);
            return;
        }
        TokenModel.findOne({token: token}, (err, token_information) => {
            if (err || !token_information ) {
                callback(err, null);
                return;
            }
            PostModel.create({
                author_id: token_information.author_id,
                title: title,
                content: content,
                tags: tags,
            }, (err, post) => {
                if (err) {
                    callback(err, null)
                    return;
                }
                callback(null, post);
                return;
            })
        });
    })
}