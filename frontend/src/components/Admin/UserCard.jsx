import React from 'react';
import './admin.css';

export default function UserCard({ user, onClick }) {
  return (
    <div className="user-card" onClick={onClick} tabIndex={0} role="button">
      <div className="user-card-header">{user.username}</div>
      <div className="user-card-email">{user.email}</div>
      <div className="user-card-tasks">
        <span className="task-count">{user.total_tasks} Tasks</span>
        <span className="badge badge-pending">{user.pending_tasks} Pending</span>
        <span className="badge badge-inprogress">{user.in_progress_tasks} In Progress</span>
        <span className="badge badge-completed">{user.completed_tasks} Completed</span>
      </div>
    </div>
  );
}
