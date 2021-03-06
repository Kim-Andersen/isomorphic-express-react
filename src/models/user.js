var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

// Define our user schema
var UserSchema = new mongoose.Schema({
  created: { 
    type: Date, 
    default: Date.now, 
    required: true
  },
  loginProvider: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  username: {
    type: String,
    unique: true,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  facebookId: {
    type: String,
    unique: true,
    required: false
  },
  linkedinId: {
    type: String,
    unique: true,
    required: false
  },
  twitterId: {
    type: String,
    unique: true,
    required: false
  },
  oauthAccessToken: {
    type: String,
    unique: true,
    required: false
  },
  oauthRefreshToken: {
    type: String,
    unique: true,
    required: false
  }
});

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.generateApiToken = function(apiTokenSecret){
  // if user is found and password is right create a token
  var token = jwt.sign(this, apiTokenSecret, {
    expiresIn: 60*60*24 // seconds
  });

  return token;
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);