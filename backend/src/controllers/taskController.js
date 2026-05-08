const taskService = require('../services/taskService');

/**
 * Create a new task
 */
async function createTaskController(req, res) {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    const userId = req.user.id;

    // Log incoming payload
    console.log('[CREATE_TASK] req.body:', req.body);

    const task = await taskService.createTask(userId, title, description, priority, status, dueDate);

    res.status(201).json({
      success: true,
      status: 201,
      data: task,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      status: 500,
      error: 'CREATE_TASK_ERROR',
      message: error.message
    });
  }
}

/**
 * Get all tasks for current user
 */
async function getTasksController(req, res) {
  try {
    const userId = req.user.id;
    const { status, limit = 10, offset = 0 } = req.query;

    const result = await taskService.getUserTasks(userId, status, parseInt(limit), parseInt(offset));

    res.status(200).json({
      success: true,
      status: 200,
      data: result,
      message: 'Tasks retrieved successfully'
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      status: 500,
      error: 'GET_TASKS_ERROR',
      message: error.message
    });
  }
}

/**
 * Get single task by ID
 */
async function getTaskController(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await taskService.getTaskById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: 'TASK_NOT_FOUND',
        message: 'Task not found'
      });
    }

    // Check ownership (unless admin)
    if (task.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        status: 403,
        error: 'UNAUTHORIZED',
        message: 'You do not have access to this task'
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: task,
      message: 'Task retrieved successfully'
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      status: 500,
      error: 'GET_TASK_ERROR',
      message: error.message
    });
  }
}

/**
 * Update task
 */
async function updateTaskController(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const task = await taskService.getTaskById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: 'TASK_NOT_FOUND',
        message: 'Task not found'
      });
    }

    // Check ownership
    if (task.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        status: 403,
        error: 'UNAUTHORIZED',
        message: 'You do not have access to this task'
      });
    }

    const updatedTask = await taskService.updateTask(id, updateData);

    res.status(200).json({
      success: true,
      status: 200,
      data: updatedTask,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      status: 500,
      error: 'UPDATE_TASK_ERROR',
      message: error.message
    });
  }
}

/**
 * Delete task
 */
async function deleteTaskController(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await taskService.getTaskById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: 'TASK_NOT_FOUND',
        message: 'Task not found'
      });
    }

    // Check ownership
    if (task.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        status: 403,
        error: 'UNAUTHORIZED',
        message: 'You do not have access to this task'
      });
    }

    const deletedTask = await taskService.deleteTask(id);

    res.status(200).json({
      success: true,
      status: 200,
      data: deletedTask,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      status: 500,
      error: 'DELETE_TASK_ERROR',
      message: error.message
    });
  }
}

module.exports = {
  createTaskController,
  getTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController
};
