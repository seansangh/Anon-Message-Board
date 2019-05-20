/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient= require('mongodb').MongoClient;
var CONNECTION_STRING= process.env.DB;
var ObjectId= require('mongodb').ObjectId;
var ObjectID= require('mongodb').ObjectID;
module.exports = function (app) {
  
  app.route('/api/threads/:board')
  .put(function(req,res){
    if(req.body.thread_id.length != 24 || ObjectID.isValid(req.body.thread_id)==false){
      res.send('invalid id')
    }
    else{
 
  MongoClient.connect(CONNECTION_STRING, function(err,db){
    if(err){
    console.log(err)
    }
    db.collection('mb').findOne({_id:ObjectId(req.body.thread_id)}, function(err,docs){
    if(!docs){
    console.log('error')
      res.send('error')
    }      
    else{

  MongoClient.connect(CONNECTION_STRING, function(err,db){
       db.collection('mb').update({_id:ObjectId(req.body.thread_id)}, {$set:{reported:true}}, {new: true}, function(err,docs){
         if(err){
          console.log('error')
         }     
       })
  })
      res.send('success')

      
    }
    })    
  }) 
      
    }
  })
  .post(function(req,res){
    var mb={board: req.body.board,text:req.body.text, created_on: new Date().toUTCString(), bumped_on: new Date().toUTCString(), reported: false, delete_password: req.body.delete_password, replies: []}
    MongoClient.connect(CONNECTION_STRING, function(err,db){
    if(err){
    console.log(err)
    }
    db.collection('mb').insert(mb,function(err,docs){
      if(err){
      console.log(err);
      }
      db.close();
    })
    
    }) 
    res.redirect("https://regular-caravan.glitch.me" + '/b/' + req.body.board)
  })
  .delete(function(req,res){
    console.log(req.body.thread_id +" =1; " + req.body.delete_password+" =2")
    if(req.body.thread_id.length != 24 || ObjectID.isValid(req.body.thread_id)==false){
      res.send('invalid id')
    }
    else{
  MongoClient.connect(CONNECTION_STRING, function(err,db){
    if(err){
    console.log(err)
    }
    db.collection('mb').findOne({_id:ObjectId(req.body.thread_id)}, function(err,docs){
    if(!docs){
    console.log('error')
      res.send('error')
    }
    else if(req.body.delete_password != docs.delete_password){
       res.send('incorrect password')
    }  
    else{
      MongoClient.connect(CONNECTION_STRING, function(err,db){
       db.collection('mb').deleteOne({_id:ObjectId(req.body.thread_id)}, function(err,docs){

        return res.send('success')

       })
      })
    }
    })
  })
    }
    
    
    });
  
  app.route('/api/replies/:board')
   .post(function(req,res){
  //  var mb={board: req.body.board, text: req.body.text, thread_id: req.body.thread_id, created_on: new Date().toUTCString(), bumped_on: new Date().toUTCString(), reported: false, delete_password: req.body.delete_password, replies: []}
    //res.redirect("https://regular-caravan.glitch.me" + '/b/' + req.body.board);
    if(req.body.thread_id.length != 24 || ObjectID.isValid(req.body.thread_id)==false){
      res.send('invalid id')
    }  
    else{
    
  MongoClient.connect(CONNECTION_STRING, function(err,db){
    if(err){
    console.log(err)
    }
    db.collection('mb').findOne({_id:ObjectId(req.body.thread_id)}, function(err,docs){
    if(!docs){
    console.log('if')
      res.send('invalid id')
    }
    else{console.log('else')
      MongoClient.connect(CONNECTION_STRING, function(err,db){
       db.collection('mb').findOneAndUpdate({_id:ObjectId(req.body.thread_id)}, {$set:{bumped_on:new Date().toUTCString()}}, {new: true}, function(err,docs){
       db.close();
       })
      })

      MongoClient.connect(CONNECTION_STRING, function(err,db){
       var cd={_id: new ObjectId(),text:req.body.text, created_on: new Date().toUTCString(), delete_password: req.body.delete_password, reported: false}; 
       db.collection('mb').findOneAndUpdate({_id:ObjectId(req.body.thread_id)}, {$push:{replies:cd}}, {new: true}, function(err,docs){
       db.close();
       })
      })      
    res.redirect("https://regular-caravan.glitch.me" + '/b/' + req.body.board + '/' + req.body.thread_id);
    }
    db.close()
    })
    
    })
    }
    
    
  });
  app.route('/api/replies/:board')  
  .delete(function(req,res){
    if(req.body.thread_id.length != 24 || ObjectID.isValid(req.body.thread_id)==false || req.body.reply_id.length != 24 || ObjectID.isValid(req.body.reply_id)==false){
  res.send('Invalid Id')
  }
  else{
  MongoClient.connect(CONNECTION_STRING, function(err,db){
    if(err){
    console.log(err)
    }
    db.collection('mb').findOne({_id:ObjectId(req.body.thread_id)}, function(err,docs){
    if(!docs){
    console.log('error')
      res.send('error')
    }
    else{
      var one=""; var two=""; var ar=[];
    docs.replies.forEach((me)=>{
    if(me._id == req.body.reply_id && me.delete_password != req.body.delete_password){
    console.log(me._id + " : this is not the answer") 
      one='passFail';
    }
    else if(me._id == req.body.reply_id && me.delete_password == req.body.delete_password){
      two="success";
      me.text='[deleted]';
      console.log('correct answer')
    }
    else{  
    console.log(me._id + " : this is not the answer")  
    }
    ar.push(me);
    })
    if(one=="" && two==""){
      res.send('incorrect id')
    }
      else{
    if(one!=''){
     
      res.send('incorrect password');
    }
    else{
      console.log('ar= ' + ar)
  MongoClient.connect(CONNECTION_STRING, function(err,db){
       db.collection('mb').update({_id:ObjectId(req.body.thread_id)}, {$set:{replies:ar}}, {new: true}, function(err,docs){
         if(err){
           console.log('err');
         }
       })
   })  
      console.log('success') 
      res.send('success');
    }  
      }
    }
    })
    
  })
  }
  
  });

  
  app.route('/api/threads/:board')
  .get((req,res)=>{
    req.params.board

    MongoClient.connect(CONNECTION_STRING,(err,db)=>{
    if(err){
    console.log(err)
    }
    
    db.collection('mb').find({board: req.params.board}).toArray(function(err,docs){
      if(docs.length>0){
      
    MongoClient.connect(CONNECTION_STRING,(err,db)=>{      
    db.collection('mb').find({board: req.params.board}).sort({bumped_on:1}).limit(10).map(function(u) { return {_id: ObjectId(u._id),text: u.text, created_on: u.created_on, bumped_on: u.bumped_on, replies: u.replies}; } ).toArray((err,docs)=>{
      docs.forEach((me)=>{
        if(me.replies.length>3){
        var re= me.replies.splice(3)
        }
      })
      
      docs.forEach((me)=>{
        for(var i=0; i< me.replies.length; i++){
         delete me.replies[i].delete_password;
         delete me.replies[i].reported;
        }
      })
      
      
      res.send(docs)
    //res.send("[{"+docs[0].text + "," + docs[0].created_on + "," + docs[0].bumped_on+"}]")
    })
    })
        
      }
     else{
       res.send('The board is empty')
     } 
      
    })
      
    })
    
    
  });

  app.route('/api/replies/:board')
  .put(function(req,res){
    if(req.body.thread_id.length != 24 || ObjectID.isValid(req.body.thread_id)==false || req.body.reply_id.length != 24 || ObjectID.isValid(req.body.reply_id)==false){
      res.send('invalid id')
    }
    else{
 
  MongoClient.connect(CONNECTION_STRING, function(err,db){
    if(err){
    console.log(err)
    }
    db.collection('mb').findOne({_id:ObjectId(req.body.thread_id)}, function(err,docs){
    if(!docs){
    console.log('error')
      res.send('invalid id.')
    }      
    else{

  MongoClient.connect(CONNECTION_STRING, function(err,db){
       db.collection('mb').findOne({_id:ObjectId(req.body.thread_id)}, function(err,docs){
         if(err){
          console.log('error')
         }     
         else{
         
         
 
      var one=""; var two=""; var ar=[];
    docs.replies.forEach((me)=>{
    if(me._id == req.body.reply_id){
      me.reported=true;
      console.log('correct answer')
    }
    else{  
    console.log(me._id + " : this is not the answer")  
    }
      ar.push(me)
    })

  MongoClient.connect(CONNECTION_STRING, function(err,db){
       db.collection('mb').update({_id:ObjectId(req.body.thread_id)}, {$set:{replies:ar}}, {new: true}, function(err,docs){
         if(err){
           console.log('err');
         }
       })
   })  
      console.log('success') 
      res.send('success');       
         
         }
       })
  })

      
    }
    })    
  }) 
      
    }
  })  
    .get((req,res)=>{
    if(Object.keys(req.query)== 'thread_id'){
  //res.send(Object.keys(req.query) + " empty query")
    if(req.query.thread_id.length != 24 || ObjectID.isValid(req.query.thread_id)==false){
       res.send('invalid id')
      }
      else{   
    MongoClient.connect(CONNECTION_STRING, (err,db)=>{  
    db.collection('mb').findOne({_id: ObjectId(req.query.thread_id)},(err,docs)=>{
      if(!docs){
      res.send('invalid id.')
      }
      else{
      delete docs.reported;
      delete docs.delete_password;
      docs.replies.forEach((me)=>{
      delete me.delete_password;
      delete me.reported;
      })
        res.send(docs)  
      }
    //res.send("[{"+docs[0].text + "," + docs[0].created_on + "," + docs[0].bumped_on+"}]")
    })                                   
    })
      
      }
    }//end of query based get
    else{
  
res.send('Invalid query')      
    
    }
  })  
  
    
};
