var express = require('express')
var connection = require("../connection")

const createUser = require("../database/createUser");
const refreshToken = require("../database/refreshToken");
const loginUser = require("../database/loginUser");
const getProfile = require("../database/getProfile");

var router = express.Router()

router.use(function(req, res, next){
    console.log("called...");
    next();
})

router.post("/profile", function (req, res) {
    let token = req.body.token;
    let user_id = req.body.user_id;

    getProfile(token, user_id , (err, profile) => {
        if (err) {
            res.json({success: false, message:"failed"});
            return;
        } else if (!profile) {
            res.json({success: false, message: "Unknown User"});
            return;
        } else {
            res.json({success: true, profile: profile});
            return;
        }

       
    });

});

router.post("/login", function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    loginUser(username, password, (err, user) => {
        if (err) {
            console.log("LOGIN ERR: ", err);
            res.json({success: false, message:"failed"});
        } else if (!user) {
            res.json({success: false, message:"Unvalid Authentication"});
        } else {
            res.json({success:true, token:user.token})
        }
        res.end()
    });
});

router.post('/refresh', function (req, res) {
  let token = req.body.token;
  console.log("Refreshing...");

  refreshToken(token, (err, new_token) => {
    if (err) {
        console.log("ERR", err);
        res.status(400).json({success:false, message:"failed"});
    }
    else if (new_token == null) {
        console.log("token is null")
        res.status(400).json({success:false, message:"failed"});
    } else {
        console.log("No refresh err");
        res.status(200).send({success:true, "token": new_token});
    }
    res.end()
  });


})

router.post('/register', function (req, res) { 
    console.log("called3");
    let username = req.body.username;
    let password = req.body.password;   
    let email = req.body.email;

    if (!username || !email || !password) {
        res.status(400).json({"error": "400 <Missing Information>"})
        res.end();
        return;
    }

    createUser(username, email, password, (err, user) => {
        if (err) {
            res.status(400).json({success:false, message:"failed"});
        } else if (!user) {
            res.status(400).json({"error": "400 <Missing Information>"})
        } else {
            res.status(200).send(user);
        }

        res.end()
    });    
})
  

module.exports = router