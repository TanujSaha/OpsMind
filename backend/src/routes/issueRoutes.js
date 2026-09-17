const express = require('express');
const router = express.Router();
const { createIssue } = require('../controllers/issueController');

// POST /api/issues
router.post('/', createIssue);

module.exports = router;