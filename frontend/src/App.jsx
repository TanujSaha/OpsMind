// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import Issues from './pages/Issues';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <aside className="sidebar">
          <h2>OpsMind</h2>
          <Link to="/">Dashboard</Link>
          <Link to="/report">Report Issue</Link>
          <Link to="/issues">Issue Tracker</Link>
          <Link to="/assets">Assets Catalog</Link>
        </aside>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/issues" element={<Issues />} />
            {/* Stubbed Routes for completeness */}
            <Route path="/assets" element={<h1>Assets Catalog (Coming Soon)</h1>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;