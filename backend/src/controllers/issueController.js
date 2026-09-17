const Issue = require('../models/Issue');
const axios = require('axios');

exports.createIssue = async (req, res) => {
  try {
    const { building, room, asset, description } = req.body;

    let aiCategory = 'General Maintenance';
    let aiPriority = 'Medium';

    // Try talking to Python AI service
    try {
      const aiResponse = await axios.post(process.env.PYTHON_AI_URL || 'http://localhost:8000/analyze', {
        description
      });
      if (aiResponse.data) {
        aiCategory = aiResponse.data.category || aiCategory;
        aiPriority = aiResponse.data.priority || aiPriority;
      }
    } catch (aiError) {
      console.warn('⚠️ AI Service offline, using default classification:', aiError.message);
    }

    // Save to MongoDB
    const newIssue = new Issue({
      building,
      room,
      asset,
      description,
      category: aiCategory,
      priority: aiPriority,
      status: 'Open'
    });

    await newIssue.save();
    res.status(201).json({ success: true, data: newIssue });

  } catch (error) {
    console.error('Server error creating issue:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};