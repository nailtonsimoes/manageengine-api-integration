const express = require('express');
const { generateToken } = require('../controllers/sdpAuthController');

const router = express.Router();

router.post('/token', generateToken);

module.exports = router;
