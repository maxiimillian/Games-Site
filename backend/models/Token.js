var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var TokenSchema = new Schema({
    token: {type: String, unique: true, required: true},
    user_id: {type: String, required: true, unique: true},
});

var TokenModel = mongoose.model("token", TokenSchema);

exports.TokenSchema = TokenSchema;
module.exports = TokenModel;

