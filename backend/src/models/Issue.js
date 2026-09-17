const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  building: { type: String, required: true },
  room: { type: String, required: true },
  asset: { type: String, default: 'General Facility' },
  description: { type: String, required: true },
  department: { type: String, default: 'General Facilities' },
  category: { type: String, default: 'General Maintenance' },
  priority: { type: String, default: 'Medium' },
  eta: { type: String, default: '24 Hours' },
  status: { type: String, default: 'Submitted' }, // Submitted, Assigned, In Progress, Resolved
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Issue', IssueSchema);