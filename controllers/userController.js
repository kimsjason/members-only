const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.register_get = function (req, res, next) {
  res.render("register", { title: "Sign Up" });
};

exports.register_post = [
  // validate and sanitize fields
  body("firstName", "Please enter your first name.")
    .trim()
    .isLength({ min: 1 })
    .isAlpha()
    .withMessage("First name cannot contain numbers or special characters.")
    .escape(),
  body("lastName", "Please enter your last name.")
    .trim()
    .isAlpha()
    .withMessage("Last name cannot contain numbers or special characters.")
    .isLength({ min: 1 })
    .escape(),
  body("username", "Please enter a valid username.")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Username must be at least 8 characters.")
    .isAlphanumeric()
    .withMessage("Username cannot contain special characters.")
    .escape(),
  body("password", "Please enter a valid password.")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .not()
    .isUppercase()
    .withMessage("Password must contain at least one lowercase character.")
    .not()
    .isLowercase()
    .withMessage("Password must contain at least one uppercase character.")
    .escape(),
  body("confirmPassword", "Passwords do not match.")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .escape(),
  // proceed to process request after validation and sanitization
  (req, res, next) => {
    // extract validation errors from a request
    const errors = validationResult(req);

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      // create new User with escaped and trimmed data
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hashedPassword,
        member: false,
        admin: false,
      });

      if (!errors.isEmpty()) {
        // there are errors - render form again with sanitized values & error messages
        res.render("register", {
          title: "Sign Up",
          user: newUser,
          errors: errors.array(),
        });
      } else {
        // data is valid
        // check if username already exists
        User.findOne({ username: req.body.username }).exec(function (
          err,
          user
        ) {
          if (err) return next(err);
          if (user) {
            res.render("register", {
              title: "Sign Up",
              user: newUser,
              errors: [
                {
                  value: "",
                  msg: "Username already exists.",
                  param: "userName",
                  location: "body",
                },
              ],
            });
          } else {
            newUser.save(function (err) {
              if (err) return next(err);
              res.redirect("/login");
            });
          }
        });
      }
    });
  },
];
