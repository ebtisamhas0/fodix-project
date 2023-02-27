const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authController = require("../controllers/user");

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.route('/').get(auth.verifyAuth, (req, res) =>
    res.render('login',{title: 'Login'})
)
router.route('/signup').get(auth.verifyAuth,  (req, res) =>
    res.render('signup',{title: 'Sign Up'})
)
router.route('/dashboard').get(auth.verifyToken, (req, res) =>
    res.render('dashboard',{title: 'Dashboard'})
)
router.route('/logout').get(auth.destroyAuth, (req, res) =>
res.redirect('/')
)
module.exports = router;
