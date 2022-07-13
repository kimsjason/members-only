const User = require("../models/user");
const Code = require("../models/code");
const { body, validationResult } = require("express-validator");

exports.membership_get = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render("membership", { title: "Become a Member", user: req.user._id });
  } else {
    res.render("membership", { title: "Become a Member" });
  }
};

exports.membership_post = [
  // validate and sanitize fields
  body("memberCode", "Code is not valid.").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    // extract validation errors from a request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // there are errors - render form again with sanitized values & error messages
      res.render("membership", {
        title: "Become a Member",
        errors: errors.array(),
      });
    } else {
      Code.findOne({ name: "member" }).exec(function (err, memberCode) {
        if (err) return next(err);
        // member code is not correct - re-render
        if (req.body.memberCode !== memberCode.code) {
          res.render("membership", {
            title: "Become a Member",
          });
        }
        // member code is correct - update user's membership status
        User.findOneAndUpdate(
          { _id: req.user._id },
          { member: true },
          { new: false }
        ).exec(function (err, user) {
          if (err) return next(err);
          res.redirect("/");
        });
      });
    }
  },
];
