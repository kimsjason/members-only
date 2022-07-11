var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET register page. */
router.get("/register", userController.register_get);

/* POST register page. */
router.post("/register", userController.register_post);

module.exports = router;
