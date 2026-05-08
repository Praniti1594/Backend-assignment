const pool = require('../config/database');

async function getAllUsersWithStats() {
  const result = await pool.query(`
    SELECT 
      u.id,
      u.username,
      u.email,
      u.role,
      COUNT(t.id) AS total_tasks
    FROM users u
    LEFT JOIN tasks t ON u.id = t.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `);

  return result.rows;
}

async function getTasksByUserId(userId) {
  const result = await pool.query(
    `SELECT * FROM tasks
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}

module.exports = {
  getAllUsersWithStats,
  getTasksByUserId
};