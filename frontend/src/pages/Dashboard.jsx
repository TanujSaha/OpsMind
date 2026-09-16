import { useState, useEffect } from 'react';
import { api } from '../services/api';

// Notice the 'export default' right here!
export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, open: 0, highPriority: 0, resolved: 0 });

  useEffect(() => {
    api.getIssues().then(res => {
      const issues = res.data;
      setStats({
        total: issues.length,
        open: issues.filter(i => i.status !== 'Resolved').length,
        highPriority: issues.filter(i => ['HIGH', 'CRITICAL'].includes(i.aiAnalysis?.priority)).length,
        resolved: issues.filter(i => i.status === 'Resolved').length
      });
    });
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Operations Overview</h1>
      <div className="grid-4">
        <div className="card stat-box"><h3>Total Issues</h3><p>{stats.total}</p></div>
        <div className="card stat-box"><h3>Open Issues</h3><p>{stats.open}</p></div>
        <div className="card stat-box"><h3>High Priority</h3><p style={{ color: '#dc2626' }}>{stats.highPriority}</p></div>
        <div className="card stat-box"><h3>Resolved</h3><p style={{ color: '#16a34a' }}>{stats.resolved}</p></div>
      </div>
    </div>
  );
}