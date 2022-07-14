var express = require("express");
const AuthController = require("../controllers/AuthController");

var router = express.Router();

router.get("/hihi", AuthController.hihi);

module.exports = router;
