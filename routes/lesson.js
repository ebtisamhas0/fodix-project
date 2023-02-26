const express = require("express");
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Course = require("../models/courses");
const Lesson = require("../models/lessons");
const router = express.Router();       


      // get user name from db
        // fetchName = id => {
        //   return User.findOne({_id: id}).then(user => user.name);
        // };
        router.get('/course/:id/lesson/new', (req, res) => {
            res.render('lesson/create', {title: 'Create a lesson', courseId: req.params.id})
           })
        // Create and Post lessons
        router.post('/course/:id/lesson/new', async (req, res) => {
            // find out which course you are adding a lesson to
                const id = req.params.id;
            // find the user
                const user = check_user(req);
                if(user === null){
                    res.redirect('/')
                }
            // get the lesson info and record course id
                const lesson = new Lesson({
                name: req.body.name,
                typeOfLesson: req.body.lessonType,
                data: [req.body.information],
                course: id
            })
            // save lesson
            await lesson.save();
            // get this particular course
            const courseRelated = await Course.findById(id);
            // push the comment into the post.comments array
            courseRelated.lessons.push(lesson);
            // save and redirect...
            await courseRelated.save(function(err) {
            if(err) {console.log(err)}
            res.redirect('/lessons/')
            })

        })

        router.get('/lesson/:id', async (req, res) => {
            let lessonId = req.params.id;
            await Lesson.findById(lessonId)
                .then(lesson => {
                    res.render('lesson/show', {title: lesson.name, information: lesson})
                })
                .catch(error => {
                    res.json({ error: error })
                })
        });

        router.get('/', (req, res) => {
            Lesson.find()
               .exec(function(err, results) {
                if(err) {console.log(err)}
                res.render('lesson/index', {title: 'All Lessons', courses: results})
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


module.exports = router;