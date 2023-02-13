const express = require("express");
const jwt = require('jsonwebtoken');
const Comment = require('../models/comments');
const User = require('../models/users');
const Post = require('../models/posts');
const router = express.Router();       

       //  Get each post details. 

        router.get('/post/:id', (req, res) => {
            const user = check_user(req);
            find_user(user)
            Post.findById(req.params.id)
                .populate('comments')
                .exec(function(err, results) {
              if(err) {console.log(err)}
                res.render('post/show', {title: 'discussion details', post: 
             results, comments: results.comments, currentUser: user})
              })
            })
   
          router.get('/new', (req, res) => {
            res.render('post/create', {title: 'Create a discussion'})
           })
   
          router.post('/new', (req, res) => {
            // find the user
            const user = check_user(req);
            if(user === null){
                res.redirect('/')
            }
            const post = new Post({
              title: req.body.title,
              text: req.body.text,
              user: user
             });
             post.save(function(err) {
              if(err) {console.log(err)}
                res.redirect('/')
             })
            })
   
          router.get('/', (req, res) => {
             Post.find()
                .exec(function(err, results) {
                 if(err) {console.log(err)}
                 res.render('post/index', {title: 'All Posts', posts: results})
              })
          });


    function check_user(header){
      let token = header.cookies.Authorization;
      if (!token) {
          next();
      }
      try {
          if (token.includes("Bearer")) {
              token = token.substr(7);
          }
          //if can verify the token, set req.user and pass to next middleware
          const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
          const user = decoded._id;
          return user;
      } catch (ex) {
          console.log(ex + 'test')
          return null;
      }
  }

  function find_user(id){
    let user_names = [];
    let hala = User.find({ _id: id })
  }

module.exports = router;