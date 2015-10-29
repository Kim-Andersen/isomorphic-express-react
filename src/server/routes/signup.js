var express = require('express');
var router = express.Router();
var signupController = require('../controllers/signup');

router.route('/')
  .post(signupController.signup);

module.exports = router;
