const pool = require('../utils/database');

class TaskService {
  async createTask(title, type, createdBy, content) {
    const result = await pool.query(
      'INSERT INTO tasks (title, type, created_by, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, type, createdBy, JSON.stringify(content)]
    );
    return result.rows[0];
  }

  async getTaskById(id) {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (result.rows[0]) {
      result.rows[0].content = JSON.parse(result.rows[0].content || '{}');
    }
    return result.rows[0];
  }

  async getTasksByCreator(createdBy) {
    const result = await pool.query('SELECT * FROM tasks WHERE created_by = $1', [createdBy]);
    return result.rows.map(task => ({
      ...task,
      content: JSON.parse(task.content || '{}')
    }));
  }

  async getAllTasks() {
    const result = await pool.query('SELECT * FROM tasks');
    return result.rows.map(task => ({
      ...task,
      content: JSON.parse(task.content || '{}')
    }));
  }

  async updateTask(id, updates) {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(updates);
    const result = await pool.query(
      `UPDATE tasks SET ${fields} WHERE id = $${values.length + 1} RETURNING *`,
      [...values, id]
    );
    return result.rows[0];
  }
}

module.exports = new TaskService();