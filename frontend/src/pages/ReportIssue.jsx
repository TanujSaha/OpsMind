import { useState } from 'react';

const ReportIssue = () => {
  const [formData, setFormData] = useState({ building: '', room: '', asset: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResult(null);

    try {
      const response = await fetch('https://opsmind-backend-f4pc.onrender.com/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error('Error submitting issue');

      setAiResult(data.data);
      setFormData({ building: '', room: '', asset: '', description: '' });
    } catch (error) {
      console.error(error);
      alert('Error submitting issue to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Report Facility Issue</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600' }}>Building</label>
          <input type="text" name="building" value={formData.building} onChange={handleChange} placeholder="e.g., Building 5" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600' }}>Room / Location</label>
          <input type="text" name="room" value={formData.room} onChange={handleChange} placeholder="e.g., 204" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600' }}>Asset</label>
          <input type="text" name="asset" value={formData.asset} onChange={handleChange} placeholder="e.g., AC Unit" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600' }}>Issue Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe problem (e.g., AC not working)" required rows="4" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '1rem', borderRadius: '8px', backgroundColor: loading ? '#64748b' : '#2563eb', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
          {loading ? 'Analyzing via AI Engine...' : 'Submit & Categorize via AI'}
        </button>
      </form>

      {aiResult && (
        <div style={{ marginTop: '2rem', background: '#ecfdf5', border: '1px solid #10b981', padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ color: '#047857', margin: '0 0 0.75rem 0' }}>✨ AI Categorization Complete</h3>
          <p style={{ margin: '0.25rem 0' }}><strong>Category:</strong> {aiResult.category || 'General Maintenance'}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Priority Assigned:</strong> <span style={{ color: (aiResult.priority || 'Medium') === 'High' ? '#dc2626' : '#d97706', fontWeight: 'bold' }}>{aiResult.priority || 'Medium'}</span></p>
          <p style={{ margin: '0.25rem 0' }}><strong>Status:</strong> {aiResult.status || 'Open'}</p>
        </div>
      )}
    </div>
  );
};

export default ReportIssue;