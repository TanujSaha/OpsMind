const path = require('path');
const Issue = require(path.join(__dirname, '../../models/Issue'));
const axios = require('axios');

const createIssue = async (req, res) => {
  try {
    const { building, room, asset, description } = req.body;

    // FEATURE 1: SMART TICKET CLUSTERING (SPAM PREVENTION)
    // Check if an unresolved issue already exists for this exact location and asset
    const existingIssue = await Issue.findOne({
      building,
      room,
      asset: asset || 'General Facility',
      status: { $ne: 'Resolved' }
    });

    if (existingIssue) {
      console.log('Duplicate detected, clustering with existing ticket:', existingIssue._id);
      return res.status(200).json({ 
        success: true, 
        clustered: true,
        message: 'Issue clustered with existing active ticket.',
        data: existingIssue 
      });
    }

    let aiData = { department: 'General Facilities', category: 'General Maintenance', priority: 'Medium', eta: '24 Hours', status: 'Submitted' };

    try {
      const aiResponse = await axios.post(process.env.PYTHON_AI_URL || 'http://localhost:8000/analyze', { description }, { timeout: 3000 });
      if (aiResponse.data) {
        aiData = { ...aiData, ...aiResponse.data, status: aiResponse.data.status || 'Assigned' };
      }
    } catch (aiError) {
      console.warn('⚠️ AI Service offline, using default operational routing:', aiError.message);
    }

    const newIssue = new Issue({ building, room, asset: asset || 'General Facility', description, ...aiData });
    const savedIssue = await newIssue.save();
    res.status(201).json({ success: true, clustered: false, data: savedIssue });
  } catch (error) {
    console.error('Critical server error creating issue:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedIssue = await Issue.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!updatedIssue) return res.status(404).json({ success: false, error: 'Issue not found' });
    res.status(200).json({ success: true, data: updatedIssue });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { createIssue, getIssues, updateIssueStatus };