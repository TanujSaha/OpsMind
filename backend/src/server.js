require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const issueRoutes = require('./routes/issueRoutes');

const app = express();

// 🔴 CRITICAL: This allows your Vercel frontend to talk to your Render backend
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/issues', issueRoutes);

// Database connection & Server initialization
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected successfully!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });