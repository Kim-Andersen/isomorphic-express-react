var passport = require('passport'),
    //LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    User = require('../models/user'),
    _ = require('lodash');

module.exports = function(oauthConfig){

  // Facebook auth.
  passport.use(new FacebookStrategy({
    clientID: oauthConfig.facebook.clientID,
    clientSecret: oauthConfig.facebook.clientSecret,
    callbackURL: oauthConfig.facebook.callbackURL
  }, 
    function(accessToken, refreshToken, profile, done) {
      console.log('Facebook auth callback:', accessToken, refreshToken, profile);
      process.nextTick(function () {
        User.findOne({ facebookId: profile.id }, function (err, user) {
          if(err) {
            console.log('Error trying to lookup up user from facebookId', profile.id, err);
            return done(err, null);
          }
          else if(user){
            console.log('Returning user authenticated with Facebook. Move along, nothing to see here.');
            return done(null, user);
          } 
          else {
            console.log('New user authenticated with Facebook. Adding to database...');
            var user = new User({
              loginProvider: 'facebook',
              facebookId: profile.id,
              name: profile.displayName
            });
            
            user.save(function(err){
              if(err) return done(err, null);
              else {
                console.log('New Facebook user added to database.');
                return done(null, user);
              }
            });
          }
          
        });
      });
    }
  ));

  // Twitter auth middleware.
  passport.use(new TwitterStrategy({
    consumerKey: oauthConfig.twitter.consumerKey,
    consumerSecret: oauthConfig.twitter.consumerSecret,
    callbackURL: oauthConfig.twitter.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      console.log('Twitter auth callback:', accessToken, refreshToken, profile);
      User.findOne({ twitterId: profile.id }, function(err, user) {
        if(err) {
          console.log('Error trying to lookup up user from twitterId', profile.id, err);
          return done(err, null);
        }
        else if(user){
          console.log('Returning user authenticated with Twitter. Move along, nothing to see here.');
          return done(null, user);
        } 
        else {
          console.log('New user authenticated with Twitter. Adding to database...');
          var user = new User({
            loginProvider: 'twitter',
            twitterId: profile.id,
            name: profile.displayName
          });
          
          user.save(function(err){
            if(err) return done(err, null);
            else {
              console.log('New Twitter user added to database.');
              return done(null, user);
            }
          });
        };
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    if(_.isObject(id)) id = id._id;

    User.findById(id, function(err, user){
      if (err) {
        console.log('Failed to deserialize user.', id, err);
        done(err, null)
      }
      else if (!user) done(null, null);
      else done(null, user);    
   })
  });

  /*return {
    authenticate: passport.authenticate('local', {session: true, successRedirect: '/', failureRedirect: '/login'});
  };*/

  /*
  passport.use(new LocalStrategy(function verifyCallback(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }));
  */
};