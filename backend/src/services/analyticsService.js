const pool = require('../utils/database');

class AnalyticsService {
  async getTaskProgressStats(taskId) {
    const result = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count,
        ROUND(AVG(CAST(score AS FLOAT)), 2) as avg_score
      FROM assignments
      WHERE task_id = $1
      GROUP BY status
    `, [taskId]);
    return result.rows;
  }

  async getStudentStats(studentId) {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_assignments,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        ROUND(AVG(CAST(score AS FLOAT)), 2) as avg_score
      FROM assignments
      WHERE student_id = $1
    `, [studentId]);
    return result.rows[0];
  }

  async getGroupStats(groupId) {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        COUNT(a.id) as total_assignments,
        SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) as completed,
        ROUND(AVG(CAST(a.score AS FLOAT)), 2) as avg_score
      FROM users u
      LEFT JOIN students_groups sg ON u.id = sg.student_id
      LEFT JOIN assignments a ON u.id = a.student_id
      WHERE sg.group_id = $1
      GROUP BY u.id, u.username
      ORDER BY avg_score DESC
    `, [groupId]);
    return result.rows;
  }

  async getGlobalAnalytics() {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT g.id) as total_groups,
        COUNT(DISTINCT t.id) as total_tasks,
        COUNT(DISTINCT a.id) as total_assignments,
        SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) as completed_assignments,
        ROUND(AVG(CAST(a.score AS FLOAT)), 2) as avg_score
      FROM users u
      CROSS JOIN groups g
      CROSS JOIN tasks t
      CROSS JOIN assignments a
    `);
    return result.rows[0];
  }
}

module.exports = new AnalyticsService();
