var express = require("express");
const AuthController = require("../controllers/AuthController");

var router = express.Router();

router.post("/hihi", AuthController.hihi);

module.exports = router;
