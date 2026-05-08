const express = require('express');
const taskController = require('../../controllers/taskController');
const { authenticateToken } = require('../../middleware/auth');
const {
  validateTaskTitle,
  validateTaskDescription,
  validateTaskStatus,
  validateTaskPriority,
  handleValidationErrors
} = require('../../utils/validators');

const router = express.Router();

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 */
const { authorize } = require('../../middleware/authorize');

// User+Admin: Create task
router.post(
  '/',
  authenticateToken,
  authorize(['user', 'admin']),
  validateTaskTitle(),
  validateTaskDescription(),
  validateTaskPriority(),
  handleValidationErrors,
  taskController.createTaskController
);

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks for current user
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 */
router.get('/', authenticateToken, taskController.getTasksController);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get single task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', authenticateToken, taskController.getTaskController);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 */
router.put(
  '/:id',
  authenticateToken,
  validateTaskTitle(),
  validateTaskDescription(),
  validateTaskStatus(),
  validateTaskPriority(),
  handleValidationErrors,
  taskController.updateTaskController
);
// User+Admin: Update task
router.put(
  '/:id',
  authenticateToken,
  authorize(['user', 'admin']),
  validateTaskTitle(),
  validateTaskDescription(),
  validateTaskPriority(),
  handleValidationErrors,
  taskController.updateTaskController
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', authenticateToken, taskController.deleteTaskController);
// User+Admin: Delete task
router.delete(
  '/:id',
  authenticateToken,
  authorize(['user', 'admin']),
  taskController.deleteTaskController
);

module.exports = router;
