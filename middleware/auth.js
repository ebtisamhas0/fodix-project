const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const { responseHandler } = require("./response-handler");

module.exports.verifyToken = function (req, res, next) {
    //get the token from the header if present
    let token = 
    req.headers.authorization || req.body.authorization || req.query.authorization || req.headers["x-access-authorization"] || req.cookies.Authorization;
    //if no token found, return response (without going to the next middelware)
    if (!token) {
        return responseHandler(null, res, 'Unauthorized!', 401);
    }
    try {
        if (token.includes("Bearer")) {
            token = token.substr(7);
        }
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decoded;
        next();
    } catch (ex) {
        console.log(ex + 'test')
        responseHandler(null, res, "Unauthorized", 401);
    }
};

module.exports.verifyAuth = function (req, res, next) {
    //get the token from the header if present
    let token = 
    req.headers.authorization || req.body.authorization || req.query.authorization || req.headers["x-access-authorization"] || req.cookies.Authorization;
    //if no token found, return response (without going to the next middelware)
    if (!token) {
        next();
    }
    try {
        if (token.includes("Bearer")) {
            token = token.substr(7);
        }
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decoded;
        res.redirect('/dashboard')
    } catch (ex) {
        console.log(ex + 'test')
        responseHandler(null, res, "Unauthorized", 401);
    }
};

module.exports.destroyAuth = function (req, res, next) {
    //get the token from the header if present
    let token = 
    req.headers.authorization || req.body.authorization || req.query.authorization || req.headers["x-access-authorization"] || req.cookies.Authorization;
    //if no token found, return response (without going to the next middelware)
    if (!token) {
        next();
    }
    try {
        if (token.includes("Bearer")) {
            token = token.substr(7);
        }
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decoded;
        res.cookie('Authorization', null, {
            httpOnly: true,
            sameSite: "strict",
            expires: new Date(Date.now()
            ) // cookie will be removed after 24 hours
        })
        .redirect('/')
    } catch (ex) {
        console.log(ex + 'test')
        responseHandler(null, res, "Unauthorized", 401);
    }
};