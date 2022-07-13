const { body, validationResult } = require("express-validator");
const passport = require("passport");

exports.login_get = function (req, res, next) {
  res.render("login", { title: "Login" });
};

exports.login_post = [
  // validate and sanitize fields
  body("username", "Please enter a valid username")
    .trim()
    .isLength({ min: 8 })
    .escape(),
  body("password", "Please enter a valid password")
    .trim()
    .isLength({ min: 8 })
    .escape(),

  (req, res, next) => {
    // extract validation errors from a request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // there are errors - render form again with sanitized values & error messages
      res.render("login", { title: "Login", errors: errors.array() });
    } else {
      next();
    }
  },
  // authenticate password and create session
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
];

exports.logout_get = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
