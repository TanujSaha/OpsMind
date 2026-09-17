const express = require('express');
const router = express.Router();
const { createIssue, getIssues, updateIssueStatus } = require('../controllers/issueController');

router.post('/', createIssue);
router.get('/', getIssues);
router.patch('/:id', updateIssueStatus); // NEW: Endpoint to update status

module.exports = router;