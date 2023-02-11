const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "user" },
  title: { type: String, required: true },
  tags: [{ type: String }],
  date: { type: Date, default: Date.now },
  content: { type: String, required: true },
  vote: { type: Number },
});
const PostModel = mongoose.model("post", PostSchema);

exports.PostSchema = PostSchema;
module.exports = PostModel;
