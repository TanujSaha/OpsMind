const path = require('path');
const Issue = require(path.join(__dirname, '../../models/Issue'));
const axios = require('axios');
const nodemailer = require('nodemailer');

// --- Nodemailer Setup ---
// Make sure to add EMAIL_USER and EMAIL_PASS to your Render Environment Variables!
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendResolutionEmail = (userEmail, issueDetails) => {
  if (!userEmail) return;

  const mailOptions = {
    from: `"OpsMind AI Command" <${process.env.EMAIL_USER}>`,
    to: userEmail,
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
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error('Error sending email:', error);
    else console.log('Resolution email sent:', info.response);
  });
};
// ------------------------

const createIssue = async (req, res) => {
  try {
    const { building, room, asset, description, userEmail } = req.body; 

    // Check for duplicates
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

    // NEW: Fire the email if marked as resolved
    if (status === 'Resolved' && updatedIssue.userEmail) {
        sendResolutionEmail(updatedIssue.userEmail, updatedIssue);
    }

    res.status(200).json({ success: true, data: updatedIssue });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { createIssue, getIssues, updateIssueStatus };