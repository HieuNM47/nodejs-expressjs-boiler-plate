var express = require("express");
var router = express.Router();
var authRouter = require("./auth");

var app = express();

app.use("/auth/", authRouter);

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

router.get("/kkk", function (req, res) {
  res.render("index", { title: "kkk" });
});

module.exports = router;
