// src/routes/sdpDataRoutes.js
const express = require('express');
const { getRequests } = require('../controllers/sdpDataController');

const router = express.Router();

router.get('/requests', getRequests);

module.exports = router;
