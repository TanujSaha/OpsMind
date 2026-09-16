const mongoose = require('mongoose');
const maintenanceLogSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
  actionTaken: { type: String, required: true },
  performedBy: { type: String, default: 'Facility Ops Team' },
  cost: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);