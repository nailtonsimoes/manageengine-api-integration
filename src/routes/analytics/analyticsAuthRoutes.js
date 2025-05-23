const express = require('express');
const { generateAuthToken } = require('../../controllers/analytics/analyticsAuthController');

const router = express.Router();

router.post('/token', generateAuthToken);

module.exports = router;
