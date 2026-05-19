import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StatCounter, BouncingTitle } from '../components/AnimatedComponents';
import { API_BASE_URL } from '../config';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Fetch user's personal history
      fetch(`${API_BASE_URL}/api/history.php?username=${parsedUser.username}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setHistory(data.history);
          }
        });
    }

    fetch(`${API_BASE_URL}/api/stats.php`)
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setActivity(data.recentActivity);
      })
      .catch(err => console.error("Failed to fetch stats", err));
  }, []);

  if (!user) return <div className="container" style={{ padding: '80px 0' }}>Please sign in to view your dashboard.</div>;

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <BouncingTitle text="My Dashboard" style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Welcome back, <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{user.username}</span></p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', alignItems: 'center' }}>
        <button onClick={() => setActiveTab('overview')} className="btn" style={{ background: activeTab === 'overview' ? 'var(--primary)' : 'var(--accents-1)', color: activeTab === 'overview' ? 'var(--bg-color)' : 'var(--text-main)', padding: '10px 24px', fontWeight: 600 }}>My Overview</button>
        <button onClick={() => setActiveTab('history')} className="btn" style={{ background: activeTab === 'history' ? 'var(--primary)' : 'var(--accents-1)', color: activeTab === 'history' ? 'var(--bg-color)' : 'var(--text-main)', padding: '10px 24px', fontWeight: 600 }}>My Learning History</button>
        <Link to="/categories" className="btn btn-primary" style={{ marginLeft: 'auto', padding: '10px 24px', fontWeight: 600, background: 'var(--success)', borderColor: 'var(--success)', color: '#fff' }}>Take Quiz</Link>
      </div>

      {activeTab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '60px' }}>
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card"
                style={{ padding: '24px' }}
              >
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>{stat.label}</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>
                  <StatCounter end={parseInt(stat.value) || 0} suffix={stat.value.toString().includes('pts') ? ' pts' : ''} />
                </h3>
              </motion.div>
            ))}
          </div>

          <div className="card" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '32px' }}>My Recent Activity</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ paddingBottom: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Quiz Category</th>
                    <th style={{ paddingBottom: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Score</th>
                    <th style={{ paddingBottom: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Date Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 5).map((act, i) => (
                    <tr key={i} style={{ borderBottom: i === history.slice(0, 5).length - 1 ? 'none' : '1px solid var(--border)' }}>
                      <td style={{ padding: '20px 0', fontWeight: 600 }}>{act.quiz}</td>
                      <td style={{ padding: '20px 0', color: 'var(--success)', fontWeight: 700 }}>{act.score}</td>
                      <td style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{act.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <div className="card" style={{ padding: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '32px' }}>My Quiz History</h3>
          {history.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>You haven't taken any quizzes yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ paddingBottom: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Quiz Category</th>
                    <th style={{ paddingBottom: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Score</th>
                    <th style={{ paddingBottom: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Date Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} style={{ borderBottom: i === history.length - 1 ? 'none' : '1px solid var(--border)' }}>
                      <td style={{ padding: '20px 0', fontWeight: 600 }}>{h.quiz}</td>
                      <td style={{ padding: '20px 0', color: 'var(--success)', fontWeight: 700 }}>{h.score}</td>
                      <td style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{h.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
