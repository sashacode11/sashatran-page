const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  tools: {
    type: Array,
  },
  projectUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Post', PostSchema);
