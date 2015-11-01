var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var history = require('history');

module.exports = function(App){
	return (
		<Router history={history.createHashHistory({queryKey: false})}>
			<Route path="/" component={App}>
				<IndexRoute component={App.Home} />
		  	<Route path="home" component={App.Home} />
		  </Route>
	  </Router>
	);
};