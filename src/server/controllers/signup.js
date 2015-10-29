var User = require('../../models/user');

exports.postSignup = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      // User successfully added.
      // Login and redirect to welcome page.

      // http://passportjs.org/docs/login
      req.login(user, function(err){
        if (err) { 
          return next(err); 
        } else {
          return res.redirect('/welcome');
        }
      });
    }
  });
};