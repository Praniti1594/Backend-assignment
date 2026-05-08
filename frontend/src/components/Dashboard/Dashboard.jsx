import { useState } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import './Dashboard.css';

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateClick = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingTask(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleCreateClick} className="btn-create-task">
          + New Task
        </button>
      </div>

      <TaskList onEditTask={handleEditTask} refreshTrigger={refreshTrigger} />

      {showForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
