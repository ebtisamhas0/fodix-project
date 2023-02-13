const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const customerController = require("../controllers/customer");

router.route("").post(customerController.create);



module.exports = router;
