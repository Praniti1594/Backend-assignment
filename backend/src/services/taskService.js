const pool = require('../config/database');

/**
 * Create a new task
 */
async function createTask(userId, title, description, priority, status, dueDate) {
  // Log SQL params
  console.log('[CREATE_TASK] SQL params:', { userId, title, description, priority, dueDate, status });
  const result = await pool.query(
    `INSERT INTO tasks (user_id, title, description, priority, due_date, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, title, description, priority, dueDate, status || 'pending']
  );

  return result.rows[0];
}

/**
 * Get all tasks for a user with pagination
 */
async function getUserTasks(userId, status = null, limit = 10, offset = 0) {
  let query = 'SELECT * FROM tasks WHERE user_id = $1';
  let params = [userId];

  if (status) {
    query += ' AND status = $2';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  const result = await pool.query(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) FROM tasks WHERE user_id = $1';
  if (status) {
    countQuery += ' AND status = $2';
  }
  const countResult = await pool.query(countQuery, status ? [userId, status] : [userId]);
  const total = parseInt(countResult.rows[0].count, 10);

  return {
    tasks: result.rows,
    total,
    limit,
    offset
  };
}

/**
 * Get task by ID
 */
async function getTaskById(taskId) {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE id = $1',
    [taskId]
  );

  return result.rows[0];
}

/**
 * Update task
 */
async function updateTask(taskId, updateData) {
  const { title, description, status, priority, dueDate } = updateData;

  const result = await pool.query(
    `UPDATE tasks
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         status = COALESCE($3, status),
         priority = COALESCE($4, priority),
         due_date = COALESCE($5, due_date),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING *`,
    [title, description, status, priority, dueDate, taskId]
  );

  if (result.rows.length === 0) {
    throw new Error('Task not found');
  }

  return result.rows[0];
}

/**
 * Delete task
 */
async function deleteTask(taskId) {
  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 RETURNING id, title',
    [taskId]
  );

  if (result.rows.length === 0) {
    throw new Error('Task not found');
  }

  return result.rows[0];
}

/**
 * Get all tasks (admin)
 */
async function getAllTasks(limit = 10, offset = 0) {
  const result = await pool.query(
    `SELECT t.*, u.username, u.email 
     FROM tasks t
     JOIN users u ON t.user_id = u.id
     ORDER BY t.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const countResult = await pool.query('SELECT COUNT(*) FROM tasks');
  const total = parseInt(countResult.rows[0].count, 10);

  return {
    tasks: result.rows,
    total,
    limit,
    offset
  };
}

module.exports = {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getAllTasks
};
