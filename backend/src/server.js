require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- THE FIX: Pointing exactly to the issueRoutes file inside the src/routes folder ---
const issueRoutes = require('./routes/issueRoutes'); 

const app = express();

// --- Open CORS for Vercel ---
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