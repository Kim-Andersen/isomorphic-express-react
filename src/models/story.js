var mongoose = require('mongoose');

// Define our user schema
var StorySchema = new mongoose.Schema({
  text: {type: String, required: true},
  date: { type: Date, default: Date.now, required: true},
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Export the Mongoose model
module.exports = mongoose.model('Story', StorySchema);