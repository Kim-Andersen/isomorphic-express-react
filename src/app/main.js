var React = require('react');
var DOM = require('react-dom');
var App = require('./App.jsx');

var bootstrapData = window.bootstrap;

var app = window.app = {};

// Initialize the api client.
app.api = require('./HolaApiClient')({
	userId: bootstrapData.user._id, 
  apiToken: bootstrapData.apiToken
});

// Initialize the React app providing the bootstrap date injected into the app.ejs by the server.
DOM.render(<App bootstrapData={bootstrapData}/>, document.getElementById('react-main-mount'));