const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  username: { type: String, required: true },
  datePosted: { type: Date, required: true },
});

module.exports = mongoose.model("Post", PostSchema);
