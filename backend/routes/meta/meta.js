const express = require('express');
const utils = require("../../utils");
const router = express.Router();
const forum = require("./forum.js");
const MetaStore = require("../../stores/metaStore.js");

const metaStore = new MetaStore();
//metaStore.start();
//metaStore._getGithubData();
/**
 * Endpoints for server-related data such as Github repository status,  
 * Donations, News, Forums, etc
 */
router.use("/forum", forum);
router.get("/supporters", (req, res, next) => {
    let { amount } = req.query;
    if (!amount) amount = 4; //default 

    try {
        const supporters = metaStore.getSupporters(amount);
        console.log("returning supporters", supporters);
        res.status(200).json({ supporters });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
