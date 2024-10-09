const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  image: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
  },
  body: {
    type: String,
    required: [true, 'Content is required'],
  },
  tools: {
    type: Array,
  },
  projectUrl: {
    type: String,
  },
});

module.exports = mongoose.model('Post', PostSchema);
