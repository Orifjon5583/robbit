const pool = require('../utils/database');

class Assignment {
    static async assignToStudent(taskId, studentId) {
        const query = `
      INSERT INTO assignments (task_id, student_id, status)
      VALUES ($1, $2, 'assigned')
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
        const { rows } = await pool.query(query, [taskId, studentId]);
        return rows[0];
    }

    static async findByStudent(studentId) {
        const query = `
      SELECT a.*, t.title, t.type, t.topic_tag, t.skill_tag
      FROM assignments a
      JOIN tasks t ON a.task_id = t.id
      WHERE a.student_id = $1
      ORDER BY a.assigned_at DESC
    `;
        const { rows } = await pool.query(query, [studentId]);
        return rows;
    }

    static async findByGroupAndTask(groupId, taskId) {
        const query = `
        SELECT a.*, u.full_name as student_name
        FROM assignments a
        JOIN users u ON a.student_id = u.id
        JOIN students_groups sg ON u.id = sg.student_id
        WHERE sg.group_id = $1 AND a.task_id = $2
      `;
        const { rows } = await pool.query(query, [groupId, taskId]);
        return rows;
    }

    static async updateProgress(id, { status, score, submissionData }) {
        const query = `
      UPDATE assignments 
      SET status = $1, score = $2, submission_data = $3, completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE NULL END
      WHERE id = $4
      RETURNING *
    `;
        const { rows } = await pool.query(query, [status, score, submissionData, id]);
        return rows[0];
    }

    static async getAnalyticsForTeacher(teacherId) {
        // Complex query to aggregate stats for groups owned by teacher
        // For simplicity, we might just fetch data and aggregate in JS, or use a complex join
        // This needs further refinement based on specific analytics view requirements.
        // For now, let's provide basic raw data access.
        return [];
    }
}

module.exports = Assignment;
