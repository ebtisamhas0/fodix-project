const Error = require("../middleware/error-handler");

const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const service = require("../service/mongo.service");

// regiser user

exports.signup = async (req, res, next) => {
    try {
        if (!req.body || !req.body.email || !req.body.password || !req.body.name ) {
            throw new Error.BadRequest("Insufficient request body data");
        }

        // if same email exists in db, throw error
        const user = await service.findOne(userModel, { email: req.body.email.toLowerCase() });
        if (user) {
            throw new Error.BadRequest("User already exist with given email");
        }

        const body = req.body

        body["password"] = await bcrypt.hash(req.body.password, 10);

        let userResponse = await service.create(userModel, body);

        return res.status(200).json({message: 'success'}).redirect("/")
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        let filter = {};
        if (!req.body.email || !req.body.password) {
            throw new Error.BadRequest("Insufficient request body data");
        }

        filter["email"] = req.body.email.trim().toLowerCase()

        const user = await service.findOne(userModel, filter);

        if (!user) {
            throw new Error.BadRequest("Email or Password is wrong, please chech your enteries.");
        }

        // login via password
            const result = await bcrypt.compare(req.body.password, user.password);
            if (!result) {
                throw new Error.Unauthorized("Email or Password is wrong, please chech your enteries.");
            }

        let token = jwt.sign({ _id: user._id, roles: user.roles }, process.env.ACCESS_SECRET_TOKEN, {
            expiresIn: "24h",
        });

        return res.cookie('Authorization', 'Bearer ' + token, {
            httpOnly: true,
            sameSite: "strict",
            expires: new Date(Date.now() + 24 * 3600000
            ) // cookie will be removed after 24 hours
        }).status(200).json({message: 'success'}).redirect("/");

    } catch (err) {
        next(err);
    }
};