const Error = require("../../middleware/error-handler");
const { responseHandler } = require("../../middleware/response-handler");

const userModel = require("../../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const service = require("../../service/mongo.service");

// validate user token data
exports.fetch = async (req, res, next) => {
    try {
        const user = await service.findOne(userModel, { _id: req.user._id }, { password: 0 });
        responseHandler(user, res)
    }
    catch (err) {
        next(err);
    }
}

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
        responseHandler(
            {
                id: userResponse._id,
                email: userResponse?.email,
                phone: userResponse?.phone
            },
            res
        )
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
            throw new Error.BadRequest("User not exist");
        }

        // login via password
            const result = await bcrypt.compare(req.body.password, user.password);
            if (!result) {
                throw new Error.Unauthorized("Incorrect password");
            }

        let token = jwt.sign({ _id: user._id, roles: user.roles }, process.env.ACCESS_SECRET_TOKEN, {
            expiresIn: "24h",
        });
        // return the JWT token for the future API calls
        responseHandler(
            {
                _id: user._id,
                email: user.email,
                roles: user.roles,
                Authorization: token,
            },
            res
        );

    } catch (err) {
        next(err);
    }
};