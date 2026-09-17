const path = require('path');
const Issue = require(path.join(__dirname, '../../models/Issue'));
const axios = require('axios');

const createIssue = async (req, res) => {
  try {
    const { building, room, asset, description } = req.body;

    // Default fallback values in case AI service is sleeping or offline
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
      }, { timeout: 3000 });

      if (aiResponse.data) {
        aiData = {
          department: aiResponse.data.department || aiData.department,
          category: aiResponse.data.category || aiData.category,
          priority: aiResponse.data.priority || aiData.priority,
          eta: aiResponse.data.eta || aiData.eta,
          status: aiResponse.data.status || 'Assigned'
        };
      }
    } catch (aiError) {
      console.warn('⚠️ AI Service offline, using default operational routing:', aiError.message);
    }

    // Always create and save the issue to MongoDB
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

    const savedIssue = await newIssue.save();
    console.log('Successfully saved issue to DB:', savedIssue._id);
    
    res.status(201).json({ success: true, data: savedIssue });

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
    console.error('Error fetching issues:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { createIssue, getIssues };