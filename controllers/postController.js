const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

const colors = ["yellow", "orange", "pink", "purple", "green"];
const randomColor = (colors) => {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

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
      color: randomColor(colors),
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

exports.delete_post_get = function (req, res, next) {
  if (req.isAuthenticated() && req.user.admin) {
    Post.deleteOne({ _id: req.params.id }).exec(function (err) {
      if (err) console.log(err);
      else {
        console.log("Deleted");
      }
    });
  }
  res.redirect("/");
};
