var express = require("express");
var router = express.Router();

const AuthController = require("../controllers/AuthController");

router.get("/hihi", AuthController.hihi);

module.exports = router;
