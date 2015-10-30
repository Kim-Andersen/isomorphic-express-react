var express = require('express');
var Story = require('../../../../models/story');

var router = express.Router({mergeParams: true});

// Middleware to validate to userId uri param.
router.use(function(req, res, next){
	if(req.params.userId == req.user._id){
		next();
	} else {
		return res.json({ success: false, message: 'Invalid userId in request uri. Not you.' });
	}
});

router.post('/stories', function(req, res){
	var story = new Story();
	story.text = req.body.text;
	story.userId = req.user._id;

	story.save(function(err){
		if(err){
			return res.json({ success: false, message: err });
		} else {
			return res.json({ success: true, data: story });
		}
	});
});

module.exports = router;