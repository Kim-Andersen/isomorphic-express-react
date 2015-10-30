var React = require('react');

var Stories = React.createClass({
  getInitialState: function(){
    return {
      stories: []
    };
  },

	componentDidMount: function () {
    app.api.getMyStories(function(err, stories){
      if(!err){
        this.setState({
          stories: stories
        });
      }
    }.bind(this));
  },
  
	render: function(){
    var storyNodes = this.state.stories.map(function (story) {
      return (
        <li key={story._id}>
          {story.text}
        </li>
      );
    });

    return (
      <ul>
        {storyNodes}
      </ul>
		)
	}
});

var InlineStoryComposer = React.createClass({
  
  handleSubmit: function(event){
    event.preventDefault();
    var text = this.refs.text.value.trim();
    if(!text){
      return
    };

    app.api.postStory(text, function(err, story){
      if(!err){
        this.refs.text.value = '';
      }
    }.bind(this));
  },

  render: function(){
    return (
      <div className="inline-post-composer">
        <form className="commentForm" onSubmit={this.handleSubmit}>
          <textarea ref="text" placeholder="I've been working on..." className="form-control"></textarea>
          <button type="submit">Publish</button>
        </form>
      </div>
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
        <InlineStoryComposer />
      	<Stories />        
      </div>
    )
  }
});

/* Module.exports instead of normal dom mounting */
module.exports = ReactApp;