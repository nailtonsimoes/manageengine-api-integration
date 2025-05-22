const express = require('express');
const { generateAuthToken } = require('../controllers/analyticsAuthController');

const router = express.Router();

router.post('/token', generateAuthToken);

module.exports = router;
