const path = require('path');
const Issue = require(path.join(__dirname, '../../models/Issue'));
const axios = require('axios');
const nodemailer = require('nodemailer');

// --- Nodemailer Setup ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendResolutionEmail = (userEmail, issueDetails) => {
  if (!userEmail) return; // Don't try to send if no email was provided

  const mailOptions = {
    from: `"OpsMind Facility Command" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Issue Resolved: ${issueDetails.asset} in Room ${issueDetails.room}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #059669;">✅ Maintenance Request Resolved</h2>
        <p>Good news! The facility issue you reported has been marked as resolved by our maintenance team.</p>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #1e293b;">Ticket Details:</h4>
          <p style="margin: 5px 0;"><strong>Asset:</strong> ${issueDetails.asset}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> Building ${issueDetails.building}, Room ${issueDetails.room}</p>
          <p style="margin: 5px 0;"><strong>Description:</strong> "${issueDetails.description}"</p>
        </div>
        
        <p>Thank you for helping keep our campus running smoothly!</p>
        <p style="color: #64748b; font-size: 0.8rem; margin-top: 30px;">This is an automated message from the OpsMind AI Facility Operations system.</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending resolution email:', error);
    } else {
      console.log('Resolution email sent: ' + info.response);
    }
  });
};
// ------------------------

const createIssue = async (req, res) => {
  try {
    const { building, room, asset, description, userEmail } = req.body; // Added userEmail

    const existingIssue = await Issue.findOne({
      building,
      room,
      asset: asset || 'General Facility',
      status: { $ne: 'Resolved' }
    });

    if (existingIssue) {
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

    const newIssue = new Issue({ 
      building, 
      room, 
      asset: asset || 'General Facility', 
      description,
      userEmail, // Save the email
      ...aiData 
    });
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

    // TRIGGER EMAIL IF RESOLVED
    if (status === 'Resolved' && updatedIssue.userEmail) {
        sendResolutionEmail(updatedIssue.userEmail, updatedIssue);
    }

    res.status(200).json({ success: true, data: updatedIssue });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { createIssue, getIssues, updateIssueStatus };