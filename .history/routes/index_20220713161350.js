var express = require("express");
var router = express.Router();
var authRouter = require("./auth");

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

app.use("/auth/", authRouter);

module.exports = router;
