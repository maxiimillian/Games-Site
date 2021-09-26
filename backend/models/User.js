var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var UserSchema = new Schema({
    user_id: {type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    bio: {type: String},
    profile: {type: String},

});

var UserModel = mongoose.model("user", UserSchema);

exports.UserSchema = UserSchema;
module.exports = UserModel;
