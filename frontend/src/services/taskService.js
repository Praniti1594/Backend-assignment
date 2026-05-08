import api from './api';

/**
 * Register user
 */
export const register = (email, username, password) => {
  return api.post('/auth/register', { email, username, password });
};

/**
 * Login user
 */
export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return api.get('/auth/me');
};

/**
 * Get all tasks
 */
export const getTasks = (status = null, limit = 10, offset = 0) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  params.append('limit', limit);
  params.append('offset', offset);
  return api.get(`/tasks?${params.toString()}`);
};

/**
 * Get single task
 */
export const getTask = (id) => {
  return api.get(`/tasks/${id}`);
};

/**
 * Create task
 */
export const createTask = (title, description, priority, status, dueDate) => {
  return api.post('/tasks', {
    title,
    description,
    priority,
    status,
    dueDate
  });
};

/**
 * Update task
 */
export const updateTask = (id, updateData) => {
  return api.put(`/tasks/${id}`, updateData);
};

/**
 * Delete task
 */
export const deleteTask = (id) => {
  return api.delete(`/tasks/${id}`);
};

export default {
  register,
  login,
  getCurrentUser,
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
