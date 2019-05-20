/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var tId;
var tId2;
var tId3;
chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
     test('posting a new thread', function(done){
      chai.request(server)
       .post('/api/threads/:board')
       .send({board: 'fcc', text: 'my text', delete_password: 'delete'})
       .end(function(err,res){
         assert.equal(res.status, 200)
      })
      chai.request(server)
       .post('/api/threads/:board')
       .send({board: 'fcc', text: 'my text', delete_password: 'delete'})
       .end(function(err,res){
         assert.equal(res.status, 200)
         done();
      })       
     })
    });
    
    suite('GET', function() {
      test('getting most recent 10 threads with 3 replies', function(done){
       chai.request(server)
        .get('/api/threads/fcc')
        .end(function(err,res){
          assert.equal(res.status, 200)
          assert.isBelow(res.body.length,11)
          assert.property(res.body[0], '_id')
          assert.property(res.body[0], 'text')
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'bumped_on')
          assert.property(res.body[0], 'replies')
          assert.isArray(res.body[0].replies)
          assert.isBelow(res.body[0].replies.length,4)
         tId= res.body[0]._id;
         tId2= res.body[1]._id;
          done();
       })
      })
    });
    
    suite('DELETE', function() {
      test('deleting a thread', function(done){
       chai.request(server)
        .delete('/api/threads/:board')
        .send({board:"fcc",thread_id: tId, delete_password: "delete"})
        .end(function(err,res){
         assert.isAtLeast(res.status,200)
         assert.equal(res.text, 'success')
         done();
       })
      })
      test('improperly deleting a thread', function(done){
       chai.request(server)
        .delete('/api/threads/:board')
        .send({board:"fcc",thread_id: tId2, delete_password: ""})
        .end(function(err,res){
         assert.isAtLeast(res.status,200)
         assert.equal(res.text, 'incorrect password')
         done();
       })
      })      
    });
    
    suite('PUT', function() {
      test('reporting a reply', function(done){
       chai.request(server)
        .put('/api/threads/:board')
        .send({board:"fcc", thread_id:tId2})
        .end(function(err,res){
         assert.equal(res.status, 200)
         assert.equal(res.text, 'success')
         done();
       })
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('post a reply to a board', function(done){
       chai.request(server)
        .post('/api/replies/:board')
        .send({thread_id: tId2, text: 'my text', delete_password:'delete'})
        .end(function(err,res){
         assert.equal(res.status, 200)
         done()
       })
      })
    });
    
    suite('GET', function() {
      test('get a reply from a board', function(done){
       chai.request(server)
        .get('/api/replies/fcc')
        .query({thread_id:tId2})
        .end(function(err,res){
          assert.equal(res.status, 200)
          assert.property(res.body, '_id')
          assert.property(res.body, 'text')
          assert.property(res.body, 'created_on')
          assert.property(res.body, 'bumped_on')
          assert.property(res.body, 'replies')
          assert.isArray(res.body.replies)
         done()
       })
      })      
    });
    
    suite('PUT', function() {
      test('reporting a reply to a board', function(done){
       chai.request(server)
        .put('/api/replies/:board')
        .send({thread_id:tId2, reply_id:tId2})
        .end(function(err,res){
         assert.equal(res.status, 200)
         assert.equal(res.text, 'success')
         done()
       })
      })      
    });
    
    suite('DELETE', function() {
      test('deleting a reply to a board', function(done){
       chai.request(server)
        .delete('/api/replies/:board')
        .send({thread_id: tId2, reply_id: tId2, delete_password: 'delete'})
        .end(function(err,res){
         assert.isAtLeast(res.status, 200)
         assert.equal(res.text, 'incorrect id')
         done()
       })
      })      
    });
    
  });

});
