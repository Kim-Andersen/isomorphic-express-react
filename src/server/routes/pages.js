var express = require('express');
var router = express.Router();
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var ReactApp = React.createFactory(require('../../app/App'));

router.get('/', function(req, res){
	var reactHtml = ReactDOMServer.renderToString(ReactApp({}));
  res.render('index.ejs', {reactOutput: reactHtml});
});

module.exports = router;