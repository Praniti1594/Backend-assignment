const express = require('express');
const router = express.Router();
const pool = require('../../config/database');

// ─────────────────────────────────────────────
// GET ALL USERS
// ─────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
   const result = await pool.query(`
  SELECT 
    u.id,
    u.username,
    u.email,
    u.role,

    COUNT(t.id) AS task_count,

    COUNT(
      CASE
        WHEN t.status = 'completed'
        THEN 1
      END
    ) AS completed_tasks

  FROM users u

  LEFT JOIN tasks t
    ON u.id = t.user_id

  GROUP BY u.id

  ORDER BY u.created_at DESC
`);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// ─────────────────────────────────────────────
// GET TASKS OF SPECIFIC USER
// ─────────────────────────────────────────────
router.get('/users/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM tasks
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
});

// ─────────────────────────────────────────────
// ASSIGN TASK TO USER
// ─────────────────────────────────────────────
router.post('/assign-task', async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      due_date,
      user_id
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO tasks
      (
        title,
        description,
        priority,
        status,
        due_date,
        user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        title,
        description,
        priority,
        status,
        due_date,
        user_id
      ]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to assign task'
    });
  }
});

module.exports = router;