var express = require("express");
var router = express.Router();
var authRouter = require("./auth");

var app = express();

app.use("/auth", authRouter);

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

router.get("/health", function (req, res) {
  try {
    return res.status(200).json({message: "Healthy"});
  } catch (error) {
    return res.status(500).json({message: error});
  }
});

module.exports = router;
