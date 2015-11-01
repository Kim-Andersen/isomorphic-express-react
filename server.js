require('babel/register');

var config = require('./config'),
		express = require('express'),
		app = express(),
		React = require('react'),
		ReactDOMServer = require('react-dom/server'),
		bodyParser = require('body-parser'),
		methodOverride = require('method-override'),
		morgan = require('morgan'),
		path = require('path'),
		livereload = require('livereload'),
		mongoose = require('mongoose'),
		passport = require('passport'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		MongoStore = require('connect-mongo')(session),
		compression = require('compression'),
		TwitterStrategy = require('passport-twitter').Strategy,
		FacebookStrategy = require('passport-facebook').Strategy;
		oauthConfig = require('./oauth'),
		User = require('./src/models/user'),
		_ = require('lodash');

app.set('apiTokenSecret', 'lE239(e_$V18_b3.dy2ZJX\lg156h');

mongoose.connect(config.mongo.connectionString);

app.set('view engine', 'ejs');

app.use(compression());
app.use(express.static(__dirname + config.publicDir));                 // set the static files location. /public/img will be /img for users
app.set('views', path.join(__dirname, config.viewsDir));
app.use('/static', express.static(__dirname + config.publicDir));
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.use(cookieParser('92ZJX\lE23g156h')); // secret value can be anything.
app.use(session({
	resave: true,
	saveUninitialized: true,
  secret: '5r(e_$V18_b3.dy', // secret can be anything.
  //maxAge: new Date(Date.now() + 3600000),
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	})
}));
app.use(passport.initialize());
app.use(passport.session());

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
					var user = new User();
					user.loginProvider = 'facebook';
					user.name = profile.displayName;
					user.facebookId = profile.id;
					user.save(function(err){
						if(err) return done(err, null);
						else {
							console.log('New Facebook user was added to database.');
							return done(null, user);
						}
					});
				}
	      
	    });
		});
	}
));

app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res){

});

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
 res.redirect('/');
});

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

// Confingure routes.
require('./src/server/router')(app);

// Start the server.
var listener = app.listen(config.port || 3000, function() {
  console.log('Listening on port '+listener.address().port)
});

if(config.livereload){
	livereloadServer = livereload.createServer({port: 35730, exts: ['.css']});
	livereloadServer.watch(__dirname + config.publicDir);	
}
