const Issue = require('../models/Issue');

exports.getStats = async (req, res, next) => {
  try {
    const total = await Issue.countDocuments();
    const open = await Issue.countDocuments({ status: 'Open' });
    const resolved = await Issue.countDocuments({ status: 'Resolved' });
    res.json({ success: true, data: { total, open, resolved } });
  } catch (error) { next(error); }
};