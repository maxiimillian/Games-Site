var express = require('express')
var connection = require("../connection")
var crypto = require("crypto");
var utils = require("../utils");
var Table = require("../modules/table");

var router = express.Router()

router.use(function(req, res, next){
    let t = new Table("placeholder");
    t.create_deck();

    console.log(t.deck);
    t.shuffle_deck();
    console.log(t.deck);
    next();
})


module.exports = router