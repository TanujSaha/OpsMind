require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Configure the email transport using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail', // Can be switched to sendgrid, mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD 
  }
});

// The dedicated email endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: message,
      // html: `<p>${message}</p>` // Optional: Use this instead of 'text' for rich formatting
    });
    
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));