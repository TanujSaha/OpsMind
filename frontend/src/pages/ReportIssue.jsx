import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportIssue = () => {
  const [formData, setFormData] = useState({ building: '', room: '', asset: '', description: '', userEmail: '' });
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [isClustered, setIsClustered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleClear = () => {
    setFormData({ building: '', room: '', asset: '', description: '', userEmail: '' });
    setAiResult(null);
    setIsClustered(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResult(null);
    setIsClustered(false);

    try {
      const response = await fetch('https://opsmind-backend-f4pc.onrender.com/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Server error');

      setAiResult(data.data);
      setIsClustered(data.clustered);
    } catch (error) {
      alert('Error submitting issue: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Report Facility Issue</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600' }}>Your Email (To receive resolution updates)</label>
          <input type="email" name="userEmail" value={formData.userEmail} onChange={handleChange} placeholder="e.g., student@university.edu" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600' }}>Building</label>
          <input type="text" name="building" value={formData.building} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600' }}>Room / Location</label>
          <input type="text" name="room" value={formData.room} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600' }}>Asset ID / Name</label>
          <input type="text" name="asset" value={formData.asset} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600' }}>Issue Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button type="submit" disabled={loading} style={{ flex: 2, padding: '1rem', borderRadius: '8px', backgroundColor: loading ? '#64748b' : '#2563eb', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
            {loading ? 'Analyzing via AI...' : 'Submit & Categorize'}
          </button>
          <button type="button" onClick={handleClear} style={{ flex: 1, padding: '1rem', borderRadius: '8px', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
            Clear Form
          </button>
        </div>
      </form>

      {aiResult && (
        <div style={{ marginTop: '2rem', background: isClustered ? '#fffbeb' : '#ecfdf5', border: `1px solid ${isClustered ? '#f59e0b' : '#10b981'}`, padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ color: isClustered ? '#b45309' : '#047857', margin: '0 0 0.75rem 0' }}>
            {isClustered ? '⚠️ Duplicate Detected: Clustered with Active Ticket' : '✨ AI Categorization Complete & Saved!'}
          </h3>
          <p style={{ margin: '0.25rem 0' }}><strong>Department:</strong> {aiResult.department}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Priority Assigned:</strong> {aiResult.priority}</p>
          {!isClustered && <p style={{ margin: '0.5rem 0', color: '#059669', fontSize: '0.95rem', fontWeight: 'bold' }}>📧 You will be emailed when this is marked resolved.</p>}

          <button onClick={() => navigate('/issue-tracker')} style={{ marginTop: '1rem', padding: '0.75rem 1.25rem', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            View Live Incident Tracker ➔
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportIssue;