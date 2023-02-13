const express = require("express");
const cookieParser = require("cookie-parser");
const { useErrorHandler } = require("../middleware/error-handler");


const auth = require("./auth");
// const users = require("./user");
const authM = require("../middleware/auth");
const post = require("./post");
const comment = require("./comment");

module.exports.default = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use("/api/v1/auth", auth);
    // app.use("/api/v1/users", users);
    app.use("/posts", post);
    app.use("/comments", comment);

    app.get('/', authM.verifyAuth,(req, res)=>{
        res.render('login')
    })
    app.get('/signup', authM.verifyAuth, (req, res)=>{
        res.render('signup')
    })
    app.get('/dashboard', authM.verifyToken, (req, res) =>
        res.render('dashboard',{title: 'Dashboard'})
    )
    app.get('/logout', authM.destroyAuth, (req, res) =>
    res.redirect('/')
)
    app.use(useErrorHandler);
};