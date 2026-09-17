import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, open: 0, highPriority: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://opsmind-backend-f4pc.onrender.com/api/issues')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const issues = data.data;
          setStats({
            total: issues.length,
            open: issues.filter(i => i.status !== 'Resolved').length,
            highPriority: issues.filter(i => i.priority === 'High').length,
            resolved: issues.filter(i => i.status === 'Resolved').length
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard stats:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>Operations Command Dashboard</h2>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>Real-time telemetry and incident metrics across campus facilities</p>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Loading live operational metrics...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={cardStyle('#2563eb')}>
            <span style={labelStyle}>TOTAL INCIDENTS</span>
            <h3 style={numberStyle}>{stats.total}</h3>
          </div>
          <div style={cardStyle('#d97706')}>
            <span style={labelStyle}>ACTIVE / OPEN</span>
            <h3 style={numberStyle}>{stats.open}</h3>
          </div>
          <div style={cardStyle('#dc2626')}>
            <span style={labelStyle}>HIGH PRIORITY</span>
            <h3 style={numberStyle}>{stats.highPriority}</h3>
          </div>
          <div style={cardStyle('#059669')}>
            <span style={labelStyle}>RESOLVED</span>
            <h3 style={numberStyle}>{stats.resolved}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

const cardStyle = (borderColor) => ({
  background: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
  borderLeft: `5px solid ${borderColor}`
});

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: '700',
  color: '#64748b',
  letterSpacing: '0.5px'
};

const numberStyle = {
  fontSize: '2.2rem',
  margin: '0.5rem 0 0 0',
  color: '#0f172a'
};

export default Dashboard;