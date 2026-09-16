const Issue = require('../models/Issue');
const aiService = require('../services/aiService');

exports.createIssue = async (req, res, next) => {
  try {
    const { building, room, description } = req.body;
    
    // 1. Save issue in MongoDB initially (Pending AI)
    let issue = new Issue({
      building,
      room,
      description,
      aiAnalysis: { 
        category: 'Pending', 
        priority: 'LOW', 
        severity: 0, 
        recommendedAction: 'Analyzing...' 
      }
    });
    await issue.save();

    // 2 & 3. Node sends issue description to Python & Python returns AI result
    const aiResult = await aiService.analyzeIssueText(description);
    
    // 4. Node updates MongoDB
    // 4. Node updates MongoDB
    if (aiResult) {
      issue.aiAnalysis = {
        category: aiResult.category,
        priority: aiResult.priority,
        severity: aiResult.severity,
        // Grabbing the exact key from your ai_engine.py
        recommendedAction: aiResult.recommendedAction 
      };
    } else {
      // Graceful fallback if AI is offline/timed out
      issue.aiAnalysis.category = 'Unassigned';
      issue.aiAnalysis.recommendedAction = 'AI Service unavailable. Manual triage required.';
    }
    await issue.save();

    // 5. React receives complete issue
    res.status(201).json({ success: true, data: issue });
  } catch (error) { 
    next(error); 
  }
};

exports.getIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json({ success: true, count: issues.length, data: issues });
  } catch (error) { next(error); }
};

exports.getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: issue });
  } catch (error) { next(error); }
};

exports.updateIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: issue });
  } catch (error) { next(error); }
};

exports.deleteIssue = async (req, res, next) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Issue deleted' });
  } catch (error) { next(error); }
};