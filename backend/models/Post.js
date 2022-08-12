var mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var PostSchema = new Schema({
    author_id: {type: String},
    title: {type: String, required: true},
    tags: [
        {type: String}
    ],
    date: {type: Date, default: Date.now},
    content: {type: String, required: true},

});

var PostModel = mongoose.model("post", PostSchema);

exports.PostSchema = PostSchema;
module.exports = PostModel;
