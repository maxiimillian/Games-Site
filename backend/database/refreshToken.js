const TokenModel = require("../models/Token");

var crypto = require("crypto");

module.exports = async function refreshToken(token, callback) {
    try {
        if (token) {
            console.log(token, TokenModel);
            TokenModel.findOne({token: token}, function (err, current_token) {
              if (err) {
                console.log("126", err);
                return callback(err, null)
              } else if (current_token == null) {

                    let information = {token: crypto.randomBytes(20).toString('hex'), user_id: "GA"+crypto.randomBytes(20).toString('hex')}
        
                    TokenModel.create(information, (err, new_token) => {
                        if (err){
                            console.log("1");
                            return callback(err, null)
                        }
                        console.log("12");
                        return callback(null, new_token.token)
                    });

              } else {
                    callback(null, token);
              }
            });

        } else {
            let information = {token: crypto.randomBytes(20).toString('hex'), user_id: "GA"+crypto.randomBytes(20).toString('hex')}
      
            TokenModel.create(information, (err, token) => {
              if (err) {
                  console.log("13");
                  return callback(err, null)
              }
              console.log("144442");
              return callback(null, token.token)
            })
        }
    } catch (err) {
        console.log("ERR EHRE", err);
        callback(err, null);
        return;
    }

}