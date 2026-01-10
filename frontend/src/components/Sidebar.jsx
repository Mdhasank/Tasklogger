import React from 'react';

const Sidebar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  view,
  setView,
  setCurrentPage,
  stats,
  user,
  handleLogout
}) => {
  return (
    <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-logo">
            <img src="/logo.svg" alt="TaskLogger Logo" width="22" height="22" />
          </div>
          <span>TaskLogger</span>
        </div>
        <button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)}>&times;</button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <label>Workspace</label>
          <button className={view === 'all' ? 'active' : ''} onClick={() => { setView('all'); setCurrentPage(1); setIsMobileMenuOpen(false); }}>
            <span className="icon">📂</span> Active Inbox
          </button>
          <button className={view === 'pending' ? 'active' : ''} onClick={() => { setView('pending'); setCurrentPage(1); setIsMobileMenuOpen(false); }}>
            <span className="icon">⏳</span> Pending
          </button>
          <button className={view === 'completed' ? 'active' : ''} onClick={() => { setView('completed'); setCurrentPage(1); setIsMobileMenuOpen(false); }}>
            <span className="icon">✅</span> Done List
          </button>
        </div>

        <div className="nav-section">
          <label>Categories</label>
          <button className={view === 'category-work' ? 'active' : ''} onClick={() => { setView('category-work'); setCurrentPage(1); setIsMobileMenuOpen(false); }}>
            <span className="dot work"></span> Work
          </button>
          <button className={view === 'category-personal' ? 'active' : ''} onClick={() => { setView('category-personal'); setCurrentPage(1); setIsMobileMenuOpen(false); }}>
            <span className="dot personal"></span> Personal
          </button>
          <button className={view === 'category-shopping' ? 'active' : ''} onClick={() => { setView('category-shopping'); setCurrentPage(1); setIsMobileMenuOpen(false); }}>
            <span className="dot shopping"></span> Shopping
          </button>
        </div>

        <div className="nav-section sidebar-stats-mobile">
          <label>Statistics</label>
          <div className="mini-stats">
            <div className="mini-stat-item">
              <span>Total</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="mini-stat-item">
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </div>
            <div className="mini-stat-item">
              <span>Done</span>
              <strong className="success">{stats.completed}</strong>
            </div>
            <div className="mini-stat-item">
              <span>Urgent</span>
              <strong className="danger">{stats.urgent}</strong>
            </div>
          </div>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">{user?.name?.[0].toUpperCase()}</div>
          <div className="info">
            <p className="name">{user?.name}</p>
            <p className="email">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-link">Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;
