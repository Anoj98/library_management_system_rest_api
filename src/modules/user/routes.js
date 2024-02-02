const express = require('express');
const userController = require('./controller');

const router = express.Router();

router.put('/signup', userController.signup);

module.exports = router;