var React = require('react');
var DOM = require('react-dom');
var App = require('./App.jsx');

// Add jQuery to window before requiring bootstrap.
// Else the browser will throw "Uncaught ReferenceError: jQuery is not defined".
window.jQuery = require('jquery');

var	bootstrap = require('bootstrap');

// Read the bootstrap data object which was injected into the app.ejs view by the server.
var bootstrapData = window.bootstrap;

var app = window.app = {};

// Initialize the api client.
app.api = require('./HolaApiClient')({
	userId: bootstrapData.user._id, 
  apiToken: bootstrapData.apiToken
});

//var Router = ReactRouter.Router;
//var Route = ReactRouter.Route;
//var IndexRoute = ReactRouter.IndexRoute;
var router = require('./routes')(App);

DOM.render(router, document.getElementById('react-main-mount'));

// Initialize the React app providing the bootstrap date injected into the app.ejs by the server.
//DOM.render(<App bootstrapData={bootstrapData}/>, document.getElementById('react-main-mount'));