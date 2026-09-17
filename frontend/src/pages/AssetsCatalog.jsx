import { useEffect, useState } from 'react';

const AssetsCatalog = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://opsmind-backend-f4pc.onrender.com/api/issues')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          // FEATURE 2: PREDICTIVE ASSET HEALTH ANALYTICS
          // Group issues by Asset to determine failure frequency
          const assetMap = {};
          
          data.data.forEach(issue => {
            const key = `${issue.asset}-${issue.building}-${issue.room}`;
            if (!assetMap[key]) {
              assetMap[key] = {
                name: issue.asset || 'General Facility',
                location: `Room ${issue.room}, Bldg ${issue.building}`,
                department: issue.department,
                failureCount: 0,
                lastIssue: issue.createdAt,
              };
            }
            assetMap[key].failureCount += 1;
          });

          setAssets(Object.values(assetMap));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching catalog:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>Predictive Asset Inventory</h2>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>AI-driven hardware health monitoring and replacement flagging</p>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Running asset diagnostics...</p>
      ) : assets.length === 0 ? (
        <div style={{ background: 'white', padding: '3rem', textAlign: 'center', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No assets have been logged into the system yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {assets.map((asset, index) => (
            <div key={index} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', borderTop: `6px solid ${asset.failureCount >= 3 ? '#dc2626' : '#10b981'}` }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>{asset.name}</h3>
                {asset.failureCount >= 3 && (
                  <span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    ⚠️ REPLACE
                  </span>
                )}
              </div>
              
              <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.9rem' }}>📍 {asset.location}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>FAILURE COUNT</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: asset.failureCount >= 3 ? '#dc2626' : '#0f172a' }}>
                    {asset.failureCount}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>SYSTEM HEALTH</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: asset.failureCount >= 3 ? '#dc2626' : '#10b981' }}>
                    {asset.failureCount >= 3 ? 'Critical' : 'Good'}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                Maintained by: {asset.department}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetsCatalog;