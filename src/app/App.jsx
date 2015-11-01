var React = require('react');
var ReactRouter = require('react-router');

var Link = ReactRouter.Link;
var IndexLink = ReactRouter.IndexLink;

var App = React.createClass({

  render: function () {
    return (
      <div className="row">
        <div className="col-xs-12 col-sm-8">
          <h1>App</h1>
          <IndexLink to="/">Home</IndexLink><br/>
          <Link to="/home">Compose story</Link>
          {this.props.children}
        </div>
        <div className="col-xs-12 col-sm-4">
          right
        </div>
      </div>
    )
  }
});

App.Home = require('./components/Home');

module.exports = App;