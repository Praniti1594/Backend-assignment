import React, { useEffect, useState } from 'react';
import { getUserTasks } from '../../services/adminService';
import './admin.css';

export default function UserTaskModal({ user, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getUserTasks(user.id)
      .then(res => {
        setTasks(res.data.data);
        setError('');
      })
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Tasks for {user.username}</h3>
        {loading && <div className="admin-loading">Loading tasks...</div>}
        {error && <div className="admin-error">{error}</div>}
        {!loading && !error && tasks.length === 0 && <div className="empty-state">No tasks found.</div>}
        {!loading && !error && tasks.length > 0 && (
          <table className="task-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Admin Assigned</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className={task.created_by_admin ? 'admin-task-row' : ''}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td><span className={`badge badge-${task.status}`}>{task.status.replace('_', ' ')}</span></td>
                  <td><span className={`badge badge-priority badge-priority-${task.priority}`}>{task.priority}</span></td>
                  <td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}</td>
                  <td>{task.created_by_admin ? <span className="badge badge-admin">Assigned by Admin</span> : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
