var _ = require('lodash');
var jQuery = require('jquery');

var HolaApiClient = function(options){
  if(!options) throw Error('Missing options parameter of type Object.');
  if(!options.userId) throw Error('Missing parameter options.userId.');
  if(!options.apiToken) throw Error('Missing parameter options.apiToken.');

  var opt = _.extend({}, options);
  var self;

  return new function(){
    self = this;

    jQuery.ajaxSetup({
      headers: {
        'x-access-token': opt.apiToken
      },
      dataType: 'json',
      timeout: 1000*10,
      error: function(xhr, textStatus, errorThrown){
        console.log('Api request failed.', {
          status: xhr.status + ' ' + errorThrown,
          state: xhr.state(),
          error: xhr.responseJSON
        });
      }
    });

    this.postStory = function(text, cb){
      return jQuery.ajax({
        url: '/api/v1/'+opt.userId+'/stories',
        type: 'post',
        data: {
          text: text
        },
        success: function(resp){
          if(resp.success){
            cb && cb(null, resp.data);
          } else {
            //console.error('Failed to post story.', resp.message);
            cb && cb(resp.message);
          }
        }
      });
    }

    this.getMyStories = function(cb){
      return jQuery.get('/api/v1/'+opt.userId+'/stories', function(resp){
        if(resp) {
          cb && cb(null, resp.stories);
        } else {
          cb && cb(resp.message);
        }
      });
    };
  };

};

module.exports = HolaApiClient;