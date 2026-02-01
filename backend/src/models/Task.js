const pool = require('../utils/database');

class Task {
    static async create({ title, description, type, content, topicTag, skillTag, createdBy }) {
        const query = `
      INSERT INTO tasks (title, description, type, content, topic_tag, skill_tag, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const values = [title, description, type, content, topicTag, skillTag, createdBy];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findAll() {
        const query = `
      SELECT t.*, u.full_name as author_name
      FROM tasks t
      JOIN users u ON t.created_by = u.id
      ORDER BY t.created_at DESC
    `;
        const { rows } = await pool.query(query);
        return rows;
    }

    static async findByCreator(userId) {
        const query = 'SELECT * FROM tasks WHERE created_by = $1 ORDER BY created_at DESC';
        const { rows } = await pool.query(query, [userId]);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM tasks WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}

module.exports = Task;
