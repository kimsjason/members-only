var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");
const membershipController = require("../controllers/membershipController");
const loginController = require("../controllers/loginController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Members Only", user: req.user });
});

/* GET register page. */
router.get("/register", userController.register_get);

/* POST register page. */
router.post("/register", userController.register_post);

/* GET login page. */
router.get("/login", loginController.login_get);

/* POST login page. */
router.post("/login", loginController.login_post);

/* GET logout */
router.get("/log-out", loginController.logout_get);

/* GET membership page */
router.get("/membership", membershipController.membership_get);

/* POST membership page */
router.post("/membership", membershipController.membership_post);

module.exports = router;
