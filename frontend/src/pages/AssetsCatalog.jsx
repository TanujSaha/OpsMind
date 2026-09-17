import { useEffect, useState } from 'react';

const AssetsCatalog = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://opsmind-backend-f4pc.onrender.com/api/issues')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIssues(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching assets:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Assets Catalog & Inventory</h2>
      
      {loading ? (
        <p style={{ color: '#64748b' }}>Loading inventory items...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {issues.length === 0 ? (
            <p style={{ color: '#64748b' }}>No assets or tracked items logged in the system yet.</p>
          ) : (
            issues.map((item, index) => (
              <div key={index} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgb(0 0 0 / 0.05)', borderLeft: '4px solid #2563eb' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Asset: {item.asset || 'General Facility'}</h4>
                <p style={{ margin: '0.25rem 0', color: '#64748b', fontSize: '0.9rem' }}>Building: {item.building} | Room: {item.room}</p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', background: '#f1f5f9', padding: '0.4rem', borderRadius: '6px', display: 'inline-block' }}>Category: {item.category}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AssetsCatalog;