require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import your routes
const issueRoutes = require('./routes/issues'); 

const app = express();

// --- THE FIX: Open CORS to allow Vercel to communicate with Render ---
app.use(cors({ origin: '*' }));
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch((err) => console.error('Database connection failed:', err));

// --- Routes ---
app.use('/api/issues', issueRoutes);

// --- Health Check ---
app.get('/', (req, res) => {
  res.send('OpsMind Backend is live and ready!');
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));