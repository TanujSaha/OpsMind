import { useState } from 'react';

const AdminChat = () => {
  const [messages, setMessages] = useState([
    { sender: 'admin', text: 'Hello! You are connected to the OpsMind Facility Command Desk. How can our maintenance team assist you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const query = input;
    setInput('');

    // Simulate automated real-time facility admin response
    setTimeout(() => {
      let reply = 'Thank you for reaching out. A duty officer has been notified of your query.';
      const low = query.toLowerCase();
      if (low.includes('wifi') || low.includes('net')) {
        reply = 'Network operations team has been dispatched to check the router logs in your area.';
      } else if (low.includes('ac') || low.includes('power') || low.includes('light')) {
        reply = 'Electrical maintenance unit is reviewing your facility ticket priority.';
      } else if (low.includes('urgent') || low.includes('emergency')) {
        reply = '⚠️ Priority alert logged! Senior facility supervisor has been paged directly.';
      }
      setMessages(prev => [...prev, { sender: 'admin', text: reply }]);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '75vh' }}>
      <div style={{ background: '#0f172a', color: 'white', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>💬 Facility Admin Direct Support</h3>
          <span style={{ fontSize: '0.8rem', color: '#34d399' }}>● Live Response Active</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '70%', background: m.sender === 'user' ? '#2563eb' : 'white', color: m.sender === 'user' ? 'white' : '#1e293b', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: m.sender === 'admin' ? '1px solid #e2e8f0' : 'none' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.4' }}>{m.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ padding: '1rem', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message to the facility administrator..." style={{ flex: 1, padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
        <button type="submit" style={{ padding: '0.85rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Send</button>
      </form>
    </div>
  );
};

export default AdminChat;