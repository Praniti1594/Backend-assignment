import React, { useState } from 'react';
import { assignTask } from '../../services/adminService';
import './admin.css';

export default function AssignTaskModal({ users, onClose, onSuccess }) {
  const [userId, setUserId] = useState(users[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await assignTask({ userId, title, description, priority, status, dueDate: dueDate ? new Date(dueDate).toISOString() : null });
      setSuccess('Task assigned successfully!');
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('pending');
      setDueDate('');
      onSuccess && onSuccess();
    } catch (err) {
      setError('Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Assign Task to User</h3>
        <form onSubmit={handleSubmit} className="assign-task-form">
          <div className="form-group">
            <label>User</label>
            <select value={userId} onChange={e => setUserId(e.target.value)} required>
              {users.map(u => <option key={u.id} value={u.id}>{u.username} ({u.email})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} disabled={loading} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} disabled={loading}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} disabled={loading}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} disabled={loading} />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Assigning...' : 'Assign Task'}</button>
          </div>
          {error && <div className="admin-error">{error}</div>}
          {success && <div className="admin-success">{success}</div>}
        </form>
      </div>
    </div>
  );
}
