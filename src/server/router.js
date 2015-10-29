var pages = require('./routes/pages');
var users = require('./routes/users');
var signup = require('./routes/signup');

module.exports = function(app){
	app.use('/', pages);
	
	app.use('/signup', signup);

	app.use('/api/v1/users', users);
};