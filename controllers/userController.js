const User = require("../models/user");

exports.register_get = function (req, res, next) {
  res.render("register", { title: "Register a New Account" });
};

exports.register_post = function (req, res, next) {
  User.findOne({ username: req.body.username }).exec(function (err, user) {
    if (err) return next(err);
    if (user) {
      res.render("register", {
        title: "Register a New User",
        errors: "Username already exists.",
      });
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
      });

      newUser.save(function (err) {
        if (err) return next(err);
        res.redirect("/login");
      });
    }
  });
};
