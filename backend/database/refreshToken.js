const TokenModel = require("../models/Token");

var crypto = require("crypto");

module.exports = async function refreshToken(token, callback) {
    try {
        if (token) {
            TokenModel.findOne({token: token}, function (err, current_token) {
      
              if (err) {
                throw err;

              } else if (current_token == null) {

                    let information = {token: crypto.randomBytes(20).toString('hex'), user_id: "GA"+crypto.randomBytes(20).toString('hex')}
        
                    TokenModel.create(information, (err, new_token) => {
                        if (err) throw err;
                
                        callback(null, new_token.token)
                    });

              } else {
                  let new_token = crypto.randomBytes(20).toString('hex');
      
                  TokenModel.updateOne({token: token}, {token: new_token}, function(err, updated_token) {
                      callback(null, new_token.token)
                  })
              }
            });

        } else {
            let information = {token: crypto.randomBytes(20).toString('hex'), user_id: "GA"+crypto.randomBytes(20).toString('hex')}
      
            TokenModel.create(information, (err, token) => {
              if (err) throw err;
      
              callback(null, token.token)
            })
        }
    } catch (err) {
        callback(err, null);
    }

}