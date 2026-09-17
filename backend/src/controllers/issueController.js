const path = require('path');
const Issue = require(path.join(__dirname, '../../models/Issue'));
const axios = require('axios');

const createIssue = async (req, res) => {
  try {
    const { building, room, asset, description } = req.body;

    let aiData = {
      department: 'General Facilities',
      category: 'General Maintenance',
      priority: 'Medium',
      eta: '24 Hours',
      status: 'Submitted'
    };

    try {
      const aiResponse = await axios.post(process.env.PYTHON_AI_URL || 'http://localhost:8000/analyze', {
        description
      }, { timeout: 4000 });

      if (aiResponse.data) {
        aiData = { ...aiData, ...aiResponse.data };
      }
    } catch (aiError) {
      console.warn('⚠️ AI Service fallback active:', aiError.message);
    }

    const newIssue = new Issue({
      building,
      room,
      asset: asset || 'General Facility',
      description,
      department: aiData.department,
      category: aiData.category,
      priority: aiData.priority,
      eta: aiData.eta,
      status: aiData.status
    });

    await newIssue.save();
    res.status(201).json({ success: true, data: newIssue });

  } catch (error) {
    console.error('Server error creating issue:', error);
    res.status(500).json({ success: false, error: 'Server error' });
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

module.exports = { createIssue, getIssues };