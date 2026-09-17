import { useEffect, useState } from 'react';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://opsmind-backend-f4pc.onrender.com/api/issues')
      .then(res => res.json())
      .then(data => {
        if (data.success) setIssues(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>Live Incident Command Center</h2>
          <p style={{ margin: '0.25rem 0 0 0', color: '#64748b' }}>Real-time departmental tracking and automated triage</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Syncing with live incident stream...</p>
      ) : issues.length === 0 ? (
        <div style={{ background: 'white', padding: '3rem', textAlign: 'center', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No active incidents reported in the system.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {issues.map((item, index) => (
            <div key={index} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', borderLeft: `6px solid ${item.priority === 'High' ? '#dc2626' : '#2563eb'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ background: '#f1f5f9', color: '#334155', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', marginRight: '0.5rem' }}>
                    🏢 {item.department}
                  </span>
                  <span style={{ background: item.priority === 'High' ? '#fee2e2' : '#fef3c7', color: item.priority === 'High' ? '#991b1b' : '#92400e', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                    ⚡ {item.priority} Priority
                  </span>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: '600', background: '#ecfdf5', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                  ⏳ ETA: {item.eta}
                </span>
              </div>

              <h4 style={{ margin: '0.5rem 0', color: '#1e293b', fontSize: '1.1rem' }}>{item.asset} — Room {item.room} (Building {item.building})</h4>
              <p style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '0.95rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>"{item.description}"</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
                <span>Category: <strong>{item.category}</strong></span>
                <span>Status: <strong style={{ color: '#2563eb' }}>{item.status}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Issues;