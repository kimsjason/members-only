var express = require("express");
var router = express.Router();

const Post = require("../models/post");
const userController = require("../controllers/userController");
const loginController = require("../controllers/loginController");
const membershipController = require("../controllers/membershipController");
const adminController = require("../controllers/adminController");
const postController = require("../controllers/postController");

/* GET home page. */
router.get("/", function (req, res, next) {
  Post.find().exec(function (err, posts) {
    if (err) return next(err);
    if (req.isAuthenticated()) {
      res.render("index", {
        title: "Members Only",
        user: req.user._id,
        member: req.user.member,
        admin: req.user.admin,
        posts: posts,
      });
    } else {
      res.render("index", {
        title: "Members Only",
        posts: posts,
      });
    }
  });
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

/* GET admin page */
router.get("/admin", adminController.admin_get);

/* POST admin page */
router.post("/admin", adminController.admin_post);

/* GET new post page */
router.get("/post", postController.post_get);

/* POST new post page */
router.post("/post", postController.post_post);

module.exports = router;
