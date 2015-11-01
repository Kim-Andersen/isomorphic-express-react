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
          <div className="form-group">
            <textarea ref="text" placeholder="I've been working on..." className="form-control"></textarea>
          </div>
          <button type="submit" className="btn btn-default">Publish</button>
        </form>
      </div>
    )
  }
});

var Home = React.createClass({

  render: function(){
    return (
      <div>
        <h1>Home</h1>
        <InlineStoryComposer />
        <Stories />
        {this.props.children}
      </div>
    )
  }
});

module.exports = Home;