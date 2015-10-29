var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	res.json([{'username': 'Kim'},{'username': 'John'}]);
});

module.exports = router;