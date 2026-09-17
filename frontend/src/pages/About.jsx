

const About = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', lineHeight: '1.6', color: '#334155' }}>
      <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>About OpsMind AI</h2>
      <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem' }}>The next-generation autonomous incident command and departmental dispatch engine for modern campuses and enterprises.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={cardStyle}>
          <h4 style={{ color: '#2563eb', marginTop: 0 }}>1. Report & Triage</h4>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Users submit natural-language complaints. Our AI engine instantly categorizes urgency, maps the issue to the exact responsible department, and computes an ETA.</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ color: '#2563eb', marginTop: 0 }}>2. Live Command Pipeline</h4>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Issues sync directly to MongoDB and populate the live incident tracker, giving operators real-time visibility into open maintenance bottlenecks.</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ color: '#2563eb', marginTop: 0 }}>3. Direct Admin Support</h4>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Staff and students can instantly communicate with administrative duty officers via real-time support chat for escalations.</p>
        </div>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
        <h3 style={{ color: '#0f172a', marginTop: 0 }}>How to Use This Web App</h3>
        <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#475569' }}>
          <li><strong>Step 1:</strong> Go to <em>Report & AI Triage</em>, enter your building, room, asset, and describe the problem in plain English.</li>
          <li><strong>Step 2:</strong> Hit submit to let the AI assign departments, priorities, and repair ETAs automatically.</li>
          <li><strong>Step 3:</strong> Track all active issues in real-time under the <em>Live Incident Tracker</em> and check system stats on the <em>Dashboard</em>.</li>
          <li><strong>Step 4:</strong> Use <em>Admin Support Chat</em> if you need immediate human intervention for critical failures.</li>
        </ul>
      </div>
    </div>
  );
};

const cardStyle = {
  background: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

export default About;