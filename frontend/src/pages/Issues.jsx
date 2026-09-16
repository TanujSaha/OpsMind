import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Load issues is defined before the useEffect to prevent the syntax error
  const loadIssues = () => api.getIssues().then(res => setIssues(res.data));

  useEffect(() => {
    loadIssues();
  }, []);

  const updateStatus = async (id, newStatus) => {
    await api.updateIssueStatus(id, newStatus);
    loadIssues();
  };

  const filteredIssues = issues.filter(issue => {
    const pMatch = filterPriority === 'ALL' || issue.aiAnalysis?.priority === filterPriority;
    const sMatch = filterStatus === 'ALL' || issue.status === filterStatus;
    return pMatch && sMatch;
  });

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Issue Tracker</h1>
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <select className="form-group" style={{ margin: 0, padding: '0.5rem' }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select className="form-group" style={{ margin: 0, padding: '0.5rem' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="empty-state">
            <h3>No issues found</h3>
            <p>Adjust your filters or report a new facility issue.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Location</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map(issue => (
                <tr key={issue._id}>
                  <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{issue.description}</td>
                  <td>{issue.building}, {issue.room}</td>
                  <td>{issue.aiAnalysis?.category}</td>
                  <td><span className={`badge ${(issue.aiAnalysis?.priority || 'low').toLowerCase()}`}>{issue.aiAnalysis?.priority}</span></td>
                  <td><strong>{issue.status}</strong></td>
                  <td>
                    <select value={issue.status} onChange={(e) => updateStatus(issue._id, e.target.value)} style={{ padding: '0.25rem' }}>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}