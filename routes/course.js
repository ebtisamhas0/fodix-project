const express = require("express");
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Course = require("../models/courses");
const courseController = require("../controllers/api/course");
const router = express.Router();       

router.route("/fetchcourses").get(courseController.index)

      // get user name from db
        fetchName = id => {
          return User.findOne({_id: id}).then(user => user.name);
        };

        //  Get each post details. 
        // router.get('/course/:id', async (req, res) => {
        //     let userName;
        //     let postUsername;
        //     let userComments = [];
        //     const user = check_user(req);
        //     fetchName(user).then(name => userName = name)
        //     Post.findById(req.params.id)
        //         .populate('comments')
        //         .exec(async function (err, results) {
        //           if (err) { console.log(err); };
        //           // call fetch name to get post user name
        //           fetchName(results.user).then(name => postUsername = name)
        //           //make a loop to call fetch name to get names of the commenters and save it in an array
        //           for (let comment of results.comments) {
        //             await fetchName(comment.user).then((name) => {
        //               comment =
        //               {
        //                 text: comment.text,
        //                 post: comment.post,
        //                 userName: name,
        //                 user: comment.user,
        //                 date: comment.date
        //               };
        //             });
        //             userComments.push(comment);
        //           };
        //           res.render('course/show', { title: 'discussion details', post: results, comments: userComments, currentUser: user, postUsername: postUsername });
        //         })
        //     })
   
          router.get('/new', (req, res) => {
            res.render('course/create', {title: 'Create a course'})
           })
   
          router.post('/new', (req, res) => {
            // find the user
            const user = check_user(req);
            if(user === null){
                res.redirect('/')
            }
            const course = new Course({
              name: req.body.name,
              isActive: req.body.activation
             });
             course.save(function(err) {
              if(err) {console.log(err)}
                res.redirect('/')
             })
            })
   
          router.get('/', (req, res) => {
             Course.find()
                .exec(function(err, results) {
                 if(err) {console.log(err)}
                 res.render('course/index', {title: 'All courses', courses: results})
              })
          });

          router.delete('/course/:id', async (req, res) => {
            let courseId = req.params.id
            await Course.findByIdAndRemove(courseId)
                .then(() => {
                    res.json({ message: "course is deleted" })
                })
                .catch(error => {
                    res.json({ error: error })
                })
              res.redirect('/')
          })

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



module.exports = router;