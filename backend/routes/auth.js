var express = require('express')
var connection = require("../connection")
var mongoose = require("mongoose");
var crypto = require("crypto");
const bcrypt = require('bcrypt');
var utils = require("../utils");

const UserModel = require('../models/User');
const TokenModel = require('../models/Token');
const { is_valid_email } = require('../utils');

const saltRounds = 10;

var router = express.Router()

router.use(function(req, res, next){
    console.log("called...");
    next();
})

router.post("/profile", function (req, res) {
    var token = req.body.token;
    console.log(req.body);
    if (token) {
        TokenModel.findOne({token: token}, function (err, tokenObj) {
            if (err || tokenObj == null) {
                return res.json({success: false, message: "Unknown Token"});
            }
            UserModel.findOne({user_id: tokenObj.user_id}, function(err, user) {
                if (err || user == null) {
                    console.log("ERR", err);
                    return res.json({success: false, message: "Unknown User"});
                }
                return res.json({success: true, username: user.username, bio: user.bio, profile: user.profile})
            });
        });
    }
})

router.post("/login", function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    console.log("login", username, password, username != null && password != null);
    if (username != null && password != null) {

        UserModel.findOne({username: username}, (err, user) => {

            if (err) return res.json({success: false, message:"failed:"+err});
            if (user == null) return res.json({success: false, message:"Unvalid Authentication"});

            bcrypt.compare(password, user.password, (err, result) => {

                if (err) return res.json({success:false, message:"Something went wrong"});

                if (result) {

                    TokenModel.findOne({user_id: user.user_id}, (err, token) => {

                        if (err) return res.json({success:false, message:"Something went wrong"});

                        let new_token = crypto.randomBytes(20).toString('hex');

                        if (token != null) {

                            TokenModel.updateOne({user_id: user.user_id}, {token: new_token}, function(err, token) {
                                if (err) return res.json({sucess: false, message: "Something went wrong"});
                                return res.json({success:true, token:new_token})
                            });  
                        } else {

                            let information = {token: crypto.randomBytes(20).toString('hex'), user_id: user.user_id};

                            TokenModel.create(information, (err, token) => {

                                if (err) return res.json({success:false, message: "Something went wrong"});
                        
                                return res.json({success:true, token:token.token})
                            });
                        }
                    });
                } else {    

                    return res.json({success:false, message:"Unvalid Authentication"});
                }
            });

        });
    }
});

router.post('/refresh', function (req, res) {
  let token = req.body.token;

  if (token) {
      TokenModel.findOne({token: token}, function (err, current_token) {

        if (err || current_token == null) {
            let information = {token: crypto.randomBytes(20).toString('hex'), user_id: "GA"+crypto.randomBytes(20).toString('hex')}

            TokenModel.create(information, (err, new_token) => {
              if (err) return res.json({success:false, message:"failed"+err});
      
              return res.json({success:true, token:new_token.token})
            });
            return;
        } else {
            let new_token = crypto.randomBytes(20).toString('hex');

            TokenModel.updateOne({token: token}, {token: new_token}, function(err, updated_token) {
                return res.json({success:true, token:new_token})
            })
        }
      });
  } else {
      let information = {token: crypto.randomBytes(20).toString('hex'), user_id: "GA"+crypto.randomBytes(20).toString('hex')}

      TokenModel.create(information, (err, token) => {
        if (err) return res.json({success:false, message:"failed"+err});

        return res.json({success:true, token:token.token})
      })
  }
  

})

router.post('/register', function (req, res) { 
    var username = req.body.username;
    var password = req.body.password;   
    var email = req.body.email;

    utils.is_valid_username(username, (is_valid_username) => {
        utils.is_valid_email(email, function (is_valid_email) {
            console.log(is_valid_username, utils.is_valid_password(password), is_valid_email);
            if (is_valid_username && is_valid_email && utils.is_valid_password(password)) {
    
            bcrypt.hash(password, saltRounds, function(err, hash) {
                let user_id = crypto.randomBytes(20).toString('hex');
    
                let user_information = {user_id: user_id, username: username, password: hash, email: email};
                UserModel.create(user_information, (err, user) => {
                    if (err) return res.json({success:false, message:"failed"+err});
                })
    
                token_information = {token: crypto.randomBytes(20).toString('hex'), user_id: user_id}
    
                TokenModel.create(token_information, (err, token) => {
                  if (err) return res.json({success:false, message:"failed"+err});
     
                  return res.json({success:true, token:token.token})
                })
        
                    
            });
            } else {
                console.log("16");
                res.status(400).json({"error": "400 <Missing Information>"})
                res.end()
            }
        })

    }) 
    
})
  

module.exports = router