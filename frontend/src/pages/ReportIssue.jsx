import { useState } from 'react';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    building: '',
    room: '',
    asset: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // --- THE NUCLEAR FIX: HARDCODED RENDER URL ---
      // 🚨 REPLACE THIS URL WITH YOUR ACTUAL LIVE RENDER LINK 🚨
      // Example: fetch('https://opsmind-backend-xxxx.onrender.com/api/issues', ...)
      
      const response = await fetch('https://opsmind-ai-xurx.onrender.com/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error submitting issue');
      }

      alert('Issue reported successfully! AI Categorization complete.');
      
      // Clear the form
      setFormData({ building: '', room: '', asset: '', description: '' }); 
      
    } catch (error) {
      console.error(error);
      alert('Error submitting issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="page-title" style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Report an Issue</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600', color: '#1e293b' }}>Building</label>
          <input 
            type="text" 
            name="building" 
            value={formData.building} 
            onChange={handleChange} 
            placeholder="e.g., Building 5" 
            required 
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600', color: '#1e293b' }}>Room / Location</label>
          <input 
            type="text" 
            name="room" 
            value={formData.room} 
            onChange={handleChange} 
            placeholder="e.g., 204" 
            required 
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600', color: '#1e293b' }}>Asset</label>
          <input 
            type="text" 
            name="asset" 
            value={formData.asset} 
            onChange={handleChange} 
            placeholder="e.g., AC Unit" 
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600', color: '#1e293b' }}>Issue Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Describe the problem (e.g., Fan not working)" 
            required 
            rows="4"
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            marginTop: '1rem',
            padding: '1rem', 
            borderRadius: '8px', 
            backgroundColor: loading ? '#64748b' : '#3b82f6', 
            color: 'white', 
            border: 'none', 
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Analyzing via AI...' : 'Submit Issue'}
        </button>

      </form>
    </div>
  );
};

export default ReportIssue;