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
		livereload = require('livereload');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + config.publicDir));                 // set the static files location. /public/img will be /img for users
app.set('views', path.join(__dirname, config.viewsDir));
app.use('/static', express.static(__dirname + config.publicDir));

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var ReactApp = React.createFactory(require('./src/app/App'));

app.get('/', function(req, res){
	var reactHtml = ReactDOMServer.renderToString(ReactApp({}));
  res.render('index.ejs', {reactOutput: reactHtml});
});

var listener = app.listen(config.port || 3000, function() {
  console.log('Listening on port '+listener.address().port)
});

if(config.livereload){
	livereloadServer = livereload.createServer({port: 35730, exts: ['.css']});
	livereloadServer.watch(__dirname + config.publicDir);	
}
