var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var CommentSchema = new Schema({
    post_id: {type: String},
    author_id: {type: String},
    content: {type: String, required: true},
    date: {type: Date, default: Date.now},
});

var CommentModel = mongoose.model("comment", CommentSchema);

exports.CommentSchema = CommentSchema;
module.exports = CommentModel;
