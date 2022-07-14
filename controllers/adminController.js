const User = require("../models/user");
const Code = require("../models/code");
const { body, validationResult } = require("express-validator");

exports.admin_get = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render("admin", { title: "Become an Admin", user: req.user._id });
  } else {
    res.render("admin", { title: "Become an Admin" });
  }
};

exports.admin_post = [
  // validate and sanitize fields
  body("adminCode", "Code is not valid.").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    // extract validation errors from a request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // there are errors - render form again with sanitized values & error messages
      res.render("admin", {
        title: "Become an Admin",
        errors: errors.array(),
      });
    } else {
      Code.findOne({ name: "admin" }).exec(function (err, adminCode) {
        if (err) return next(err);
        // admin code is not correct - re-render
        if (req.body.adminCode !== adminCode.code) {
          res.render("admin", {
            title: "Become an Admin",
            user: req.user._id,
          });
        } else {
          // admin code is correct - update user's admin status
          User.findOneAndUpdate(
            { _id: req.user._id },
            { admin: true, member: true },
            { new: false }
          ).exec(function (err, user) {
            if (err) return next(err);
            res.redirect("/");
          });
        }
      });
    }
  },
];
