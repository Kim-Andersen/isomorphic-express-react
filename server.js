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
		oauthConfig = require('./oauth'),
		authentication = require('./src/server/authentication')(oauthConfig);

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
