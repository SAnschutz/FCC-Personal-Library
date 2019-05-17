const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  comments: [
  ],
  commentcount: {
    type: Number,
    default: 0
  }
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book