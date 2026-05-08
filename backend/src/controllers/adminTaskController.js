const adminService = require('../services/adminService');

async function getAllUsersWithStats(req, res) {
  try {
    const users = await adminService.getAllUsersWithStats();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getUserTasks(req, res) {
  try {
    const { id } = req.params;
    const tasks = await adminService.getUserTasks(id);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function assignTask(req, res) {
  try {
    const { userId, title, description, status, priority, dueDate } = req.body;
    const adminId = req.user.id;
    const task = await adminService.assignTask({ userId, title, description, status, priority, dueDate, adminId });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getAdminStats(req, res) {
  try {
    const stats = await adminService.getAdminStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getAllUsersWithStats,
  getUserTasks,
  assignTask,
  getAdminStats
};
