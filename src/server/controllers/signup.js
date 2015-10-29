var User = require('../../models/user');

exports.signup = function(req, res) {
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });

  console.log('posted user:', user);

  user.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'New user added to the database!' });
  });
};