/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
const Book = require('../models/books');

mongoose.connect(MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})


module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
    
      const books = await Book.find();
    
      if (books.length === 0) {
        return res.send('no books found')
      }
      res.send(books)
       // response will be array of book objects
      // json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async function (req, res){
      var title = req.body.title;
      
      const book = new Book({
        title,
        _id: new ObjectId()
      })
      
      if (!title){
        return res.status(400).send('Please enter a title')
      }
      
      try {
        await book.save()
        res.send(book)
        
      } catch(e) {
        res.status(400).send(e)
      }
  })
      

    .delete(async function(req, res){
    
    try {
      await Book.deleteMany({})
      // res.send('complete delete successful')
      res.redirect('referer')
    } catch(e) {
      res.send('complete delete failed')
    }
    
      // if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      var bookid = ObjectId(req.params.id);
    
      try {
        const book = await Book.findOne({_id: bookid})
        if (!book) {
          res.status(404).send('no book exists');
        }
        res.send(book)
      } catch(e){
        console.log('error')
        res.status(400).send()
      }
    
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async function(req, res){
      var bookid = ObjectId(req.params.id);
      var comment = req.body.comment;
      try {

        const book = await Book.findOne({_id: bookid});

        let comments = book.comments
        let commentcount = book.commentcount + 1
        comments.push(comment)

        book.comments = comments
        book.commentcount = commentcount

        await book.save()

        res.send(book)
      } catch(e) {
        res.send('error')
      }
      //json res format same as .get
    })
    
    .delete(async function(req, res){
      var bookid = ObjectId(req.params.id);
    
      try {
        await Book.deleteOne({_id: bookid})
        res.send('delete successful')      
      } catch (e) {
        res.send('error')        
      }
      //if successful response will be 'delete successful'
    });
  
};
