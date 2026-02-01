const pool = require('../utils/database');

class Group {
    static async create(name, teacherId, createdBy) {
        const query = `
      INSERT INTO groups (name, teacher_id, created_by)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
        const { rows } = await pool.query(query, [name, teacherId, createdBy]);
        return rows[0];
    }

    static async findAll() {
        const query = `
      SELECT g.*, 
             t.full_name as teacher_name, 
             u.full_name as creator_name
      FROM groups g
      LEFT JOIN users t ON g.teacher_id = t.id
      LEFT JOIN users u ON g.created_by = u.id
      ORDER BY g.created_at DESC
    `;
        const { rows } = await pool.query(query);
        return rows;
    }

    static async findById(id) {
        const query = `
      SELECT g.*, t.full_name as teacher_name 
      FROM groups g
      LEFT JOIN users t ON g.teacher_id = t.id
      WHERE g.id = $1
    `;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    static async findByTeacher(teacherId) {
        const query = 'SELECT * FROM groups WHERE teacher_id = $1 ORDER BY created_at DESC';
        const { rows } = await pool.query(query, [teacherId]);
        return rows;
    }

    static async addStudent(groupId, studentId) {
        const query = `
      INSERT INTO students_groups (student_id, group_id)
      VALUES ($1, $2)
      RETURNING *
    `;
        const { rows } = await pool.query(query, [studentId, groupId]);
        return rows[0];
    }

    static async getStudents(groupId) {
        const query = `
      SELECT u.id, u.username, u.full_name
      FROM users u
      JOIN students_groups sg ON u.id = sg.student_id
      WHERE sg.group_id = $1
    `;
        const { rows } = await pool.query(query, [groupId]);
        return rows;
    }

    static async updateTeacher(groupId, teacherId) {
        const query = 'UPDATE groups SET teacher_id = $1 WHERE id = $2 RETURNING *';
        const { rows } = await pool.query(query, [teacherId, groupId]);
        return rows[0];
    }

    static async checkStudentBelongsToTeacher(studentId, teacherId) {
        const query = `
      SELECT 1 
      FROM students_groups sg 
      JOIN groups g ON sg.group_id = g.id 
      WHERE sg.student_id = $1 AND g.teacher_id = $2
    `;
        const { rows } = await pool.query(query, [studentId, teacherId]);
        return rows.length > 0;
    }
}

module.exports = Group;
