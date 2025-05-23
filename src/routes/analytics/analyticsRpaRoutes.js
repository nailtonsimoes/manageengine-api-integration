const express = require('express');
const { executeRPA } = require('../../controllers/analytics/analyticsRpaController');
const router = express.Router();

router.post('/analytics/run-rpa', executeRPA);

module.exports = router;
