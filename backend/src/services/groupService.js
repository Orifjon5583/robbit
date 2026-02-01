const pool = require('../utils/database');

class GroupService {
  async createGroup(name, createdBy) {
    const result = await pool.query(
      'INSERT INTO groups (name, created_by) VALUES ($1, $2) RETURNING id, name, created_by, created_at',
      [name, createdBy]
    );
    return result.rows[0];
  }

  async getGroupById(id) {
    const result = await pool.query('SELECT * FROM groups WHERE id = $1', [id]);
    return result.rows[0];
  }

  async getAllGroups() {
    const result = await pool.query('SELECT * FROM groups');
    return result.rows;
  }

  async addStudentToGroup(studentId, groupId) {
    const result = await pool.query(
      'INSERT INTO students_groups (student_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [studentId, groupId]
    );
    return result.rows[0];
  }

  async getStudentsInGroup(groupId) {
    const result = await pool.query(
      'SELECT u.id, u.username, u.role FROM students_groups sg JOIN users u ON sg.student_id = u.id WHERE sg.group_id = $1',
      [groupId]
    );
    return result.rows;
  }

  async removeStudentFromGroup(studentId, groupId) {
    await pool.query(
      'DELETE FROM students_groups WHERE student_id = $1 AND group_id = $2',
      [studentId, groupId]
    );
  }

  async assignTeacherToGroup(teacherId, groupId) {
    // Create a teachers_groups table if needed
    const result = await pool.query(
      'INSERT INTO teachers_groups (teacher_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [teacherId, groupId]
    );
    return result.rows[0];
  }
}

module.exports = new GroupService();