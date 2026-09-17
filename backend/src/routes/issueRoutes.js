const express = require('express');
const router = express.Router();
const { createIssue, getIssues } = require('../controllers/issueController');

// Route to create a new issue (POST)
router.post('/', createIssue);

// Route to fetch all issues for the tracker (GET) - THIS WAS MISSING OR BROKEN
router.get('/', getIssues);

module.exports = router;