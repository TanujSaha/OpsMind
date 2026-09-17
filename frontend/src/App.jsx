
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import Issues from './pages/Issues';
import AssetsCatalog from './pages/AssetsCatalog';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
        
        {/* Persistent Sidebar */}
        <nav style={{ width: '260px', backgroundColor: '#0f172a', color: 'white', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#ffffff' }}>OpsMind</h2>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>AI Facility Operations</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500', padding: '0.5rem 0' }}>Dashboard</Link>
            <Link to="/report-issue" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500', padding: '0.5rem 0' }}>Report Issue</Link>
            <Link to="/issue-tracker" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500', padding: '0.5rem 0' }}>Issue Tracker</Link>
            <Link to="/assets-catalog" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500', padding: '0.5rem 0' }}>Assets Catalog</Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="/issue-tracker" element={<Issues />} />
            <Route path="/assets-catalog" element={<AssetsCatalog />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;