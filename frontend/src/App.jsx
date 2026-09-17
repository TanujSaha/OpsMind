
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import Issues from './pages/Issues';
// If you haven't built the Assets page yet, you can leave this import out or create a dummy page!
 
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* --- NAVBAR --- */}
        <nav className="navbar">
          <h1>OpsMind</h1>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/report-issue">Report Issue</Link>
            <Link to="/issue-tracker">Issue Tracker</Link>
            <Link to="/assets-catalog">Assets Catalog</Link>
          </div>
        </nav>

        {/* --- PAGE CONTENT --- */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="/issue-tracker" element={<Issues />} />
           
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;