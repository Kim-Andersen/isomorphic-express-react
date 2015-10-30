var express = require('express');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var ReactApp = React.createFactory(require('../app/App'));
var authController = require('./controllers/auth');
var signupController = require('./controllers/signup');

module.exports = function(app){

	var apiRouter = require('./routers/api-v1')(app);

	app.get('/', function(req, res){
		if (req.isAuthenticated()) {
			res.redirect('/app');
		} else {
			var reactHtml = ReactDOMServer.renderToString(ReactApp({}));
	  	res.render('index.ejs', {reactOutput: reactHtml});	
		}		
	});

	app.get('/login', function(req, res){
	  res.render('login.ejs');
	});
	app.post('/login', authController.authenticate);

	app.post('/signup', signupController.postSignup);
  app.get('/signup', function(req, res){
		  res.render('signup.ejs');
		});

  app.all(['/app','/app/*'], function ensureAuthenticated(req,res,next) {
  	console.log('ensureAuthenticated', req.isAuthenticated());
	  if (req.isAuthenticated()) {
	    next();
	  } else {
	    res.redirect('/login');
	  }
	});

	app.get('/app', function(req, res){
	  res.render('app.ejs', {user: req.user, apiToken: req.user.generateApiToken(app.get('apiTokenSecret'))});
	});

	/*
		API
	*/	
	app.use('/api/v1', apiRouter);

};