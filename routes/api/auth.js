const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authController = require("../controllers/api/user");

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/fetchByToken").get(auth.verifyToken, authController.fetch);

module.exports = router;
