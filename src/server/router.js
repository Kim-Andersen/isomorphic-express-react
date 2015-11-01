var express = require('express');
var passport = require('passport');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var App = React.createFactory(require('../app/App'));
//var authController = require('./controllers/auth');
var signupController = require('./controllers/signup');
var User = require('../models/user');

module.exports = function(app){

	var _authenticateAuthCallback = function(provider){
		return passport.authenticate(provider, { 
			successRedirect: '/',
			failureRedirect: '/login' 
		});
	};

	// Social auth routes.
	['facebook', 'twitter', 'linkedin'].forEach(function(provider){
		app.get('/auth/'+provider, passport.authenticate(provider));
		app.get('/auth/'+provider+'/callback', _authenticateAuthCallback(provider));	
	});

	// Login page.
	app.get('/login', function(req, res){
	  res.render('login.ejs');
	});
	//app.post('/login', authController.authenticate);

	// Signup page.
	app.post('/signup', signupController.postSignup);
  app.get('/signup', function(req, res){
	  res.render('signup.ejs');
	});

  app.all(['/'], function ensureAuthenticated(req,res,next) {
  	console.log('ensureAuthenticated', req.isAuthenticated());
	  if (req.isAuthenticated()) {
	    next();
	  } else {
	    res.redirect('/login');
	  }
	});

	// API
	app.use('/api/v1', require('./routers/api-v1')(app));

	// Public profile.	
	app.get('/:username', function(req, res){
		console.log('username', req.params.username);
		User.findOne({username: req.params.username}, function(err, user){
			if(err){
				res.render('error.ejs');
			} else if(!user) {
				res.render('404.ejs');
			} else {
				res.render('profile.ejs', {user: user});
			}
		});
	});

	app.get('*', function(req, res){
		if (req.isAuthenticated()) {
			var reactHtml = ReactDOMServer.renderToString(App({}));
		  res.render('app.ejs', {
		  	reactOutput: reactHtml,
		  	user: req.user, 
		  	apiToken: req.user.generateApiToken(app.get('apiTokenSecret'))
		  });
		} else {
	  	res.render('index.ejs');
		}		
	});
	
	/*
	var ReactRouter = require('react-router');
	var routes = require('../app/routes')(App);

	app.get('*', function(req, res){
		ReactRouter.match({routes: routes, location: req.url }, (error, redirectLocation, renderProps) => {
	    if (error) {
	      res.status(500).send(error.message)
	    } else if (redirectLocation) {
	      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
	    } else if (renderProps) {
	    	var reactHtml = ReactDOMServer.renderToString(<ReactRouter.RoutingContext {...renderProps} />);
			  res.render('app.ejs', {
			  	reactOutput: reactHtml,
			  	user: req.user, 
			  	apiToken: req.user.generateApiToken(app.get('apiTokenSecret'))
			  });
	      //res.status(200).send(renderToString(<RoutingContext {...renderProps} />))
	    } else {
	      res.status(404).send('Not found')
	    }
	  })
	});
	*/
};