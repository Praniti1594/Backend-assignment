const authService = require('../services/authService');

/**
 * Get all users (admin)
 */
async function getAllUsersController(req, res) {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const result = await authService.getAllUsers(parseInt(limit), parseInt(offset));

    res.status(200).json({
      success: true,
      status: 200,
      data: result,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      status: 500,
      error: 'GET_USERS_ERROR',
      message: error.message
    });
  }
}

/**
 * Get user by ID (admin)
 */
async function getUserController(req, res) {
  try {
    const { id } = req.params;

    const user = await authService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: user,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      status: 500,
      error: 'GET_USER_ERROR',
      message: error.message
    });
  }
}

/**
 * Update user role (admin)
 */
async function updateUserRoleController(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        status: 400,
        error: 'INVALID_ROLE',
        message: 'Role must be "user" or "admin"'
      });
    }

    const user = await authService.updateUserRole(id, role);

    res.status(200).json({
      success: true,
      status: 200,
      data: user,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      status: 500,
      error: 'UPDATE_ROLE_ERROR',
      message: error.message
    });
  }
}

/**
 * Delete user (admin)
 */
async function deleteUserController(req, res) {
  try {
    const { id } = req.params;

    const user = await authService.deleteUser(id);

    res.status(200).json({
      success: true,
      status: 200,
      data: user,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      status: 500,
      error: 'DELETE_USER_ERROR',
      message: error.message
    });
  }
}

module.exports = {
  getAllUsersController,
  getUserController,
  updateUserRoleController,
  deleteUserController
};
