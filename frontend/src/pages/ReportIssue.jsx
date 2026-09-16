import { useState } from 'react';
import { api } from '../services/api';

export default function ReportIssue() {
  const [formData, setFormData] = useState({ building: '', room: '', assetName: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResult(null);
    try {
      const res = await api.createIssue(formData);
      setAiResult(res.data.aiAnalysis);
      setFormData({ building: '', room: '', assetName: '', description: '' });
    } catch (error) {
      console.error(error); // We are now using the variable!
      alert('Error submitting issue');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Report Facility Issue</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Building</label>
            <input required value={formData.building} onChange={e => setFormData({...formData, building: e.target.value})} placeholder="e.g. Main Tower" />
          </div>
          <div className="form-group">
            <label>Room / Location</label>
            <input required value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} placeholder="e.g. 402" />
          </div>
          <div className="form-group">
            <label>Asset (Optional)</label>
            <input value={formData.assetName} onChange={e => setFormData({...formData, assetName: e.target.value})} placeholder="e.g. HVAC Unit 3" />
          </div>
          <div className="form-group">
            <label>Issue Description</label>
            <textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the problem in detail..." />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Analyzing via AI...' : 'Submit Issue'}
          </button>
        </form>

        {aiResult && (
          <div className="ai-result">
            <h4>✓ Issue Logged & Analyzed</h4>
            <p><strong>Category:</strong> {aiResult.category}</p>
            <p><strong>Priority:</strong> <span className={`badge ${aiResult.priority.toLowerCase()}`}>{aiResult.priority}</span></p>
            <p><strong>Severity Score:</strong> {aiResult.severity}/10</p>
            <p style={{ marginTop: '0.5rem' }}><strong>Recommended Action:</strong> {aiResult.recommendedAction}</p>
          </div>
        )}
      </div>
    </div>
  );
}