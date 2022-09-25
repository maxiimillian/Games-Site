const express = require('express');
const router = express.Router();
const createForumPost = require("../../database/createForumPost");
const getForumPosts = require("../../database/getForumPosts");
const utils = require("../../utils");

router.get("/", (req, res, next) => {
    try {
        
    } catch (err) {
        next(err);
    }
});

router.get("/posts", (req, res, next) => {
    let { tags, sortBy, query, direction } = req.query;
    if (!Array.isArray(tags)) {
        if (tags == undefined || tags.length == 0) {
            tags = [];
        } else {
            tags = tags.split(",");
        }
    }
    try {
        if (!utils.is_valid_tags(tags)) {
            res.status(400).json({"error": "Invalid Tags"});
        } else {
            getForumPosts(query, sortBy, direction, tags, (err, posts) => {
                if (err ) {
                    res.status(400).json({"err": err});
                } else {
                    res.status(200).json({"posts": posts});
                }
            }); 

        }
    } catch (err) {
        next(err);
    }
});

router.post("/create", (req, res) => {
    let { token, title, content, tags } = req.body;
    if (!Array.isArray(tags)) {
        tags = tags.split(",");
    }
    try {
        createForumPost(token, title, content, tags, (err, post) => {
            if (err) {
                res.status(400).json({"error": err});
            } else {
                res.status(200);
            }
        });
    } catch (err) {
        next(err);
    }
});
module.exports = router;