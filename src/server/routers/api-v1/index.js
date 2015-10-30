var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../../../models/user');
var meRouter = require('./me');

module.exports = function(app){
	var router = express.Router();

	router.get('/', function(req, res) {
	  res.json({ message: 'Welcome to the coolest API on earth!\n Please authenticate at /api/authenticate' });
	});

	router.post('/authenticate', function(req, res) {
		// find the user
	  User.findOne({
	    username: req.body.username
	  }, function(err, user) {

	    if (err) throw err;

	    if (!user) {
	    	// User not found.
	      res.json({ success: false, message: 'Authentication failed. Invalid credentials.' });
	    } else if (user) {

	      // check if password matches
	      if (!user.verifyPassword(req.body.password, function(err, isMatch){
	      	if (err) {
	      		// Error occured verifying the password.
	      		res.json({ success: false, message: 'Authentication failed. Error occured.' });
	      	} else if(!isMatch){
	      		// Password didn't macth.
	      		res.json({ success: false, message: 'Authentication failed. Invalid credentials.' });
	      	} else {

	      		var token = user.generateApiToken(app.get('apiTokenSecret'));

		        // return the information including token as JSON
		        res.json({
		          success: true,
		          message: 'Enjoy your token',
		          token: token
		        });
	      	}

	      }));

	    }
	  });
	});

	// route middleware to verify a token
	router.use(function(req, res, next) {

	  // check header or url parameters or post parameters for token
	  var token = req.body.apiToken || req.query.apiToken || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, app.get('apiTokenSecret'), function(err, decoded) {      
	      if (err) {
	        return res.json({ success: false, message: 'Failed to authenticate API token.' });
	      } else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;    
	        next();
	      }
	    });

	  } else {

	    // if there is no token return an error.
	    return res.status(403).send({ 
	        success: false, 
	        message: 'No API token provided.'
	    });
	    
	  }
	});

	router.use('/:userId([0-9a-f]{24})', meRouter);

	return router;
};