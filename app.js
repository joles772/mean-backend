const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

//WCHfVt3RBijkTYL3

mongoose.connect("mongodb+srv://Jan:WCHfVt3RBijkTYL3@cluster0-ciyfi.mongodb.net/test?retryWrites=true")
    .then(()=>{
        console.log("Connected to database!");
    }).catch(() =>{
        console.log("Connection failed");
    });

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept" 
    );
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            postId: createdPost._id
        });
    });
    
});

app.get('/api/posts',(req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: 'posts fetched successfully',
            posts: documents
        });
    });
    
});

app.get('/api/posts/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post){
            res.status(200).json(post);
        } else {
            res.status(404).json({message: "Post not found"})
        }
    })
});

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result);
      res.status(200).json({ message: "Post deleted!" });
    });
});

app.put("/api/posts/:id", (req, res, next) => {
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      console.log(result);
      res.status(200).json({ message: "Update successful!" });
    });
  });


module.exports = app;