const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  building: { type: String, required: true },
  room: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  aiAnalysis: {
    category: { type: String, default: 'Unassigned' },
    priority: { type: String, default: 'LOW' },
    severity: { type: Number, default: 0 },
    recommendedAction: { type: String, default: 'Pending analysis' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);