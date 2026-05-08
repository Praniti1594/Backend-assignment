import { useState, useEffect } from 'react';
import * as taskService from '../../services/taskService';
import '../Dashboard/Dashboard.css';

export default function TaskList({ onEditTask, refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await taskService.getTasks(filter || null);
      setTasks(response.data.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filter, refreshTrigger]);

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'in_progress':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ff6b6b';
      case 'medium':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="task-list">
      <div className="list-header">
        <h2>My Tasks</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading tasks...</div>}

      {tasks.length === 0 && !loading && (
        <div className="empty-state">
          <p>No tasks found. Create one to get started!</p>
        </div>
      )}

      <div className="tasks-grid">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <h3>{task.title}</h3>
              <div className="task-badges">
                <span className="status-badge" style={{ backgroundColor: getStatusColor(task.status) }}>
                  {task.status.replace('_', ' ')}
                </span>
                <span className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                  {task.priority}
                </span>
              </div>
            </div>
            {task.description && <p className="task-description">{task.description}</p>}
            {task.due_date && (
              <p className="task-due-date">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </p>
            )}
            <div className="task-actions">
              <button onClick={() => onEditTask(task)} className="btn-edit">
                Edit
              </button>
              <button onClick={() => handleDelete(task.id)} className="btn-delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
