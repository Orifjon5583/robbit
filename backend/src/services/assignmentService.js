const pool = require('../utils/database');

class AssignmentService {
  async createAssignment(taskId, studentId) {
    const result = await pool.query(
      'INSERT INTO assignments (task_id, student_id, status) VALUES ($1, $2, $3) RETURNING *',
      [taskId, studentId, 'assigned']
    );
    return result.rows[0];
  }

  async getAssignmentById(id) {
    const result = await pool.query('SELECT * FROM assignments WHERE id = $1', [id]);
    return result.rows[0];
  }

  async getAssignmentsByStudent(studentId) {
    const result = await pool.query('SELECT * FROM assignments WHERE student_id = $1', [studentId]);
    return result.rows;
  }

  async getAssignmentsByTask(taskId) {
    const result = await pool.query('SELECT * FROM assignments WHERE task_id = $1', [taskId]);
    return result.rows;
  }

  async updateAssignmentStatus(id, status, score = null) {
    const result = await pool.query(
      'UPDATE assignments SET status = $1, score = $2 WHERE id = $3 RETURNING *',
      [status, score, id]
    );
    return result.rows[0];
  }

  async getAssignmentStats(taskId) {
    const result = await pool.query(
      'SELECT status, COUNT(*) as count, AVG(score) as avg_score FROM assignments WHERE task_id = $1 GROUP BY status',
      [taskId]
    );
    return result.rows;
  }
}

module.exports = new AssignmentService();