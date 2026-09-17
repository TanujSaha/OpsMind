import { useEffect, useState } from 'react';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = () => {
    fetch('https://opsmind-backend-f4pc.onrender.com/api/issues')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setIssues(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching issues:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIssues();
    const interval = setInterval(fetchIssues, 3000);
    return () => clearInterval(interval);
  }, []);

  // NEW: Handler to mark issue as resolved
  const handleResolve = async (id) => {
    try {
      const response = await fetch(`https://opsmind-backend-f4pc.onrender.com/api/issues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved' })
      });
      if (response.ok) {
        fetchIssues(); // Instantly refresh the UI
      }
    } catch (error) {
      console.error('Error resolving issue:', error);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>Live Incident Tracker</h2>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>Real-time departmental routing and tracking of active facility tickets</p>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Syncing with incident database...</p>
      ) : issues.length === 0 ? (
        <div style={{ background: 'white', padding: '3rem', textAlign: 'center', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No incidents logged in the database yet. Report an issue to see it here live!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {issues.map((item, index) => (
            <div key={index} style={{ opacity: item.status === 'Resolved' ? 0.6 : 1, background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', borderLeft: `6px solid ${(item.priority || 'Medium') === 'High' ? '#dc2626' : (item.status === 'Resolved' ? '#059669' : '#2563eb')}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ background: '#f1f5f9', color: '#334155', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', marginRight: '0.5rem' }}>
                    🏢 {item.department || 'General Facilities'}
                  </span>
                  <span style={{ background: (item.priority || 'Medium') === 'High' ? '#fee2e2' : '#fef3c7', color: (item.priority || 'Medium') === 'High' ? '#991b1b' : '#92400e', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                    ⚡ {item.priority || 'Medium'} Priority
                  </span>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: '600', background: '#ecfdf5', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                  ⏳ ETA: {item.eta || '24 Hours'}
                </span>
              </div>

              <h4 style={{ margin: '0.5rem 0', color: '#1e293b', fontSize: '1.1rem', textDecoration: item.status === 'Resolved' ? 'line-through' : 'none' }}>
                {item.asset || 'Asset'} — Room {item.room} (Building {item.building})
              </h4>
              <p style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '0.95rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>"{item.description}"</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Category: <strong>{item.category || 'General'}</strong></span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#64748b' }}>Status: <strong style={{ color: item.status === 'Resolved' ? '#059669' : '#2563eb' }}>{item.status || 'Submitted'}</strong></span>
                  
                  {item.status !== 'Resolved' && (
                    <button onClick={() => handleResolve(item._id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem' }}>
                      ✓ Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Issues;