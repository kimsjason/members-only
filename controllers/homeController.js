const Post = require("../models/post");

exports.index = function (req, res, next) {
  Post.find().exec(function (err, posts) {
    if (err) return next(err);
    if (req.isAuthenticated()) {
      // format post dates before sending to view template
      const formattedPosts = posts.map((post) => {
        post._doc.datePosted = post._doc.datePosted.toLocaleDateString();
        return post;
      });
      res.render("index", {
        title: "Posts",
        user: req.user._id,
        member: req.user.member,
        admin: req.user.admin,
        posts: formattedPosts,
      });
    } else {
      res.render("index", {
        title: "Posts",
        posts: posts,
      });
    }
  });
};
