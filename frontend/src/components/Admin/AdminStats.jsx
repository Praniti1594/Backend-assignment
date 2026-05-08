import React from 'react';
import './admin.css';

export default function AdminStats({ stats }) {
  if (!stats) return null;
  return (
    <div className="admin-stats-row">
      <div className="stat-card">
        <div className="stat-label">Total Users</div>
        <div className="stat-value">{stats.total_users}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total Tasks</div>
        <div className="stat-value">{stats.total_tasks}</div>
      </div>
      <div className="stat-card stat-pending">
        <div className="stat-label">Pending</div>
        <div className="stat-value">{stats.pending_tasks}</div>
      </div>
      <div className="stat-card stat-inprogress">
        <div className="stat-label">In Progress</div>
        <div className="stat-value">{stats.in_progress_tasks}</div>
      </div>
      <div className="stat-card stat-completed">
        <div className="stat-label">Completed</div>
        <div className="stat-value">{stats.completed_tasks}</div>
      </div>
    </div>
  );
}
