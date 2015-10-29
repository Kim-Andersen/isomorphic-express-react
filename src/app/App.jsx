var React = require('react');

var Users = React.createClass({
	componentDidMount: function () {
    
  },
	render: function(){
		return (
      <ul>
        <li><a href="/signup">Signup</a></li>
        <li><a href="/login">Log in</a></li>
      </ul>			
		)
	}
});

var ReactApp = React.createClass({

  componentDidMount: function () {
    console.log('componentDidMount');
  },
  render: function () {
    return (
    	<div>
      	<h1>Helle, World!</h1>
      	<Users />
      </div>
    )
  }
});

/* Module.exports instead of normal dom mounting */
module.exports = ReactApp;