
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import Issues from './pages/Issues';
import AssetsCatalog from './pages/AssetsCatalog';
import AdminChat from './pages/AdminChat';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
        
        {/* Modern Sidebar */}
        <nav style={{ width: '280px', backgroundColor: '#090d16', color: 'white', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '4px 0 10px rgba(0,0,0,0.05)' }}>
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', background: 'linear-gradient(90deg, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>OpsMind AI</h2>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Smart Facility Command</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/" style={navLinkStyle}>📊 Operations Dashboard</Link>
              <Link to="/report-issue" style={navLinkStyle}>⚡ Report & AI Triage</Link>
              <Link to="/issue-tracker" style={navLinkStyle}>📋 Live Incident Tracker</Link>
              <Link to="/assets-catalog" style={navLinkStyle}>🏢 Assets Inventory</Link>
              <Link to="/admin-chat" style={navLinkStyle}>💬 Admin Support Chat</Link>
              <Link to="/about" style={navLinkStyle}>📖 About & Guide</Link>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#475569', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
            OpsMind v2.4 • Real-Time Enterprise Ops
          </div>
        </nav>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '3rem', overflowY: 'auto', maxHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="/issue-tracker" element={<Issues />} />
            <Route path="/assets-catalog" element={<AssetsCatalog />} />
            <Route path="/admin-chat" element={<AdminChat />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

const navLinkStyle = {
  color: '#94a3b8',
  textDecoration: 'none',
  fontWeight: '500',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  display: 'block',
  fontSize: '0.95rem'
};

export default App;