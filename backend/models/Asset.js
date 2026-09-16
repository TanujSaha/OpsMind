const mongoose = require('mongoose');
const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['HVAC', 'Electrical', 'Plumbing', 'Elevator', 'Fire Safety', 'Structural'] },
  location: { building: { type: String, required: true }, room: { type: String, required: true } },
  status: { type: String, default: 'Operational', enum: ['Operational', 'Degraded', 'Under Maintenance', 'Offline'] }
}, { timestamps: true });
module.exports = mongoose.model('Asset', assetSchema);