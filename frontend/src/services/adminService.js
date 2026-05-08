import api from './api';

export const getAllUsersWithStats = async () => {
  return await api.get('/admin/users');
};

export const getUserTasks = async (userId) => {
  return await api.get(`/admin/dashboard/users/${userId}/tasks`);
};

export const assignTask = async (data) => {
  return await api.post('/admin/assign-task', data);
};

export const getAdminStats = async () => {
  return await api.get('/admin/stats');
};