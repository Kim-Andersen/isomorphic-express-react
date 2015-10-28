var React = require('react');

var Users = React.createClass({
	componentDidMount: function () {
    
  },
	render: function(){
		return (
			<h4>Working</h4>
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