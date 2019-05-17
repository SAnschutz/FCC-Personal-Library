/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var ObjectId = require('mongodb').ObjectId;
var testId;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'Test title'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, '_id',  'Book should contain _id');
            assert.isArray(res.body.comments, 'comments field should be an array');
            assert.equal(res.body.commentcount, 0, 'commentcount should be set to 0');
              testId = res.body._id; //set up testId for later tests
        done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res){
            assert.equal(res.status, 400);
            done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        const id = new ObjectId().toHexString()
        chai.request(server)
          .get(`/api/books/${id}`)
          .end(function(err, res){
            assert.equal(res.status, 404)
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        const id = testId;
        chai.request(server)
          .get(`/api/books/${id}`)
          .end(function(err, res){
            assert.equal(res.status, 200)
        done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const id = testId;
        const comment = 'Test comment'
        chai.request(server)
          .post(`/api/books/${id}`)
          .send({comment})
          .end(function(err, res){
            const finalComment = res.body.comments.length - 1;
            assert.equal(res.status, 200);
            assert.equal(res.body.comments[finalComment], 'Test comment')
            done();
        });
      });
      
    });
    

});
  
//clean up database after tests
  after(function(done){
    const id = testId;
    chai.request(server)
    .delete(`/api/books/${id}`)
    .end(function(err, res){
      console.log(`test book object deleted`);
      done()
    })
  })

})

