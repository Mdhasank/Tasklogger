import React from 'react';

const StatsGrid = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-label">Total</span>
        <span className="stat-value">{stats.total}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Pending</span>
        <span className="stat-value">{stats.pending}</span>
      </div>
      <div className="stat-card completed">
        <span className="stat-label">Done</span>
        <span className="stat-value">{stats.completed}</span>
      </div>
      <div className="stat-card urgent">
        <span className="stat-label">Urgent</span>
        <span className="stat-value">{stats.urgent}</span>
      </div>
    </div>
  );
};

export default StatsGrid;
