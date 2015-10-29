var pages = require('./routes/pages');
var users = require('./routes/users');

module.exports = function(app){
	app.use('/', pages);
	app.use('/api/v1/users', users);
};