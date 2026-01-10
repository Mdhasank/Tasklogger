import React from 'react';

const Header = ({
  view,
  stats,
  searchQuery,
  setSearchQuery,
  setShowModal,
  setIsMobileMenuOpen
}) => {
  const getTitle = () => {
    if (view === 'all') return 'Active Inbox';
    if (view === 'completed') return 'Completed Tasks';
    if (view.includes('category')) return view.split('-')[1].toUpperCase();
    return 'Tasks';
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mobile-top-bar">
        <div className="brand">
          <div className="brand-logo">
            <img src="/logo.svg" alt="TaskLogger Logo" width="20" height="20" />
          </div>
          <span>TaskLogger</span>
        </div>
        <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
      </div>

      <header className="main-header">
        <div className="header-left">
          <div className="header-title-row">
            <h2>{getTitle()}</h2>
          </div>
          <p className="subtitle">You have {stats.pending} tasks remaining</p>
        </div>
        <div className="header-right">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="add-task-btn" onClick={() => setShowModal(true)}>
            <span className="plus">+</span> <span className="btn-text">New Task</span>
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
