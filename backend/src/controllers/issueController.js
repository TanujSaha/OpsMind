const path = require('path');
const Issue = require(path.join(__dirname, '../../models/Issue'));
const axios = require('axios');

// --- Bulletproof REST API Email Setup (via Resend) ---
const sendResolutionEmail = async (userEmail, issueDetails) => {
  if (!process.env.RESEND_API_KEY || !userEmail) {
    console.warn('⚠️ Skipping email: RESEND_API_KEY missing or no email provided.');
    return;
  }

  try {
    const response = await axios.post('https://api.resend.com/emails', {
      from: 'OpsMind Command <onboarding@resend.dev>', // Resend's default free testing address
      to: userEmail, // IMPORTANT: See testing note below
      subject: `✅ Resolved: ${issueDetails.asset} in Room ${issueDetails.room}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #059669;">Maintenance Request Resolved</h2>
          <p>Good news! The facility issue you reported has been fixed.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Asset:</strong> ${issueDetails.asset}</p>
            <p><strong>Location:</strong> Building ${issueDetails.building}, Room ${issueDetails.room}</p>
            <p><strong>Description:</strong> "${issueDetails.description}"</p>
          </div>
          <p>Thank you for using OpsMind Facility Command.</p>
        </div>
      `
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Resolution email sent successfully via Resend API!');
  } catch (error) {
    // If the API fails, it logs the error but KEEPS THE SERVER ALIVE
    console.error('❌ Resend API Error (Non-fatal):', error.response ? error.response.data : error.message);
  }
};
// -----------------------------------------------------

const createIssue = async (req, res) => {
  try {
    const { building, room, asset, description, userEmail } = req.body; 

    const existingIssue = await Issue.findOne({ building, room, asset: asset || 'General Facility', status: { $ne: 'Resolved' } });
    if (existingIssue) {
      return res.status(200).json({ success: true, clustered: true, data: existingIssue });
    }

    let aiData = { department: 'General Facilities', category: 'General Maintenance', priority: 'Medium', eta: '24 Hours', status: 'Submitted' };

    try {
      const aiResponse = await axios.post(process.env.PYTHON_AI_URL || 'http://localhost:8000/analyze', { description }, { timeout: 3000 });
      if (aiResponse.data) aiData = { ...aiData, ...aiResponse.data, status: aiResponse.data.status || 'Assigned' };
    } catch (aiError) {
      console.warn('⚠️ AI fallback active:', aiError.message);
    }

    const newIssue = new Issue({ building, room, asset: asset || 'General Facility', description, userEmail, ...aiData });
    const savedIssue = await newIssue.save();
    res.status(201).json({ success: true, clustered: false, data: savedIssue });
  } catch (error) {
    console.error('Server error in createIssue:', error);
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

const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedIssue = await Issue.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!updatedIssue) return res.status(404).json({ success: false, error: 'Issue not found' });

    if (status === 'Resolved' && updatedIssue.userEmail) {
        // Runs cleanly in the background
        sendResolutionEmail(updatedIssue.userEmail, updatedIssue);
    }

    res.status(200).json({ success: true, data: updatedIssue });
  } catch (error) {
    console.error('Server error in updateIssueStatus:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { createIssue, getIssues, updateIssueStatus };