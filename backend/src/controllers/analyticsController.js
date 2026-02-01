const pool = require('../utils/database');

class AnalyticsController {
  async getTeacherStats(request, reply) {
    if (request.user.role !== 'teacher') return reply.status(403).send({ error: 'Access denied' });

    try {
      const teacherId = request.user.id;
      // Example stats: Count of students, tasks created
      const stats = {
        totalStudents: 0,
        totalTasks: 0,
        avgCompletionRate: 0
      };

      // Simple count queries
      // This is a placeholder for complex analytics logic
      const studentsQuery = `
            SELECT COUNT(DISTINCT sg.student_id) as count
            FROM groups g
            JOIN students_groups sg ON g.id = sg.group_id
            WHERE g.teacher_id = $1
          `;
      const tasksQuery = `SELECT COUNT(*) as count FROM tasks WHERE created_by = $1`;

      const sRes = await pool.query(studentsQuery, [teacherId]);
      const tRes = await pool.query(tasksQuery, [teacherId]);

      stats.totalStudents = parseInt(sRes.rows[0].count);
      stats.totalTasks = parseInt(tRes.rows[0].count);

      reply.send(stats);
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }

  async getAdminStats(request, reply) {
    if (request.user.role !== 'super_admin') return reply.status(403).send({ error: 'Access denied' });

    try {
      const stats = {
        totalUsers: 0,
        totalGroups: 0
      };

      const uRes = await pool.query('SELECT COUNT(*) as count FROM users');
      const gRes = await pool.query('SELECT COUNT(*) as count FROM groups');

      stats.totalUsers = parseInt(uRes.rows[0].count);
      stats.totalGroups = parseInt(gRes.rows[0].count);

      reply.send(stats);
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }
}

module.exports = new AnalyticsController();
