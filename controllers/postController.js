const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.post_get = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render("post", { title: "New Post", user: req.user._id });
  } else {
    res.render("post", { title: "New Post" });
  }
};

exports.post_post = [
  // validate and sanitize fields
  body("title", "Please enter a valid title.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("body", "Please enter a valid message.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    // extract validation errors from a request
    const errors = validationResult(req);

    // create new Post with escaped and trimmed data
    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      username: req.user.username,
      datePosted: new Date(),
    });

    if (!errors.isEmpty()) {
      // there are errors - render form again with sanitized values & error messages
      res.render("post", {
        title: "New Post",
        user: req.user._id,
        errors: errors.array(),
      });
    } else {
      post.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];
