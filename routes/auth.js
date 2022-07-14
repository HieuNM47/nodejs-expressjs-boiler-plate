var express = require("express");
var router = express.Router({ mergeParams: true });

const AuthController = require("../controllers/AuthController");
const { route } = require("./api");

// router.get("/hihi", AuthController.hihi);

router.get("/", function (req, res) {
  res.render("index", { title: "auth" });
});

module.exports = router;
