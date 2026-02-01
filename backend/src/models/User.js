const pool = require('../utils/database');

class User {
  static async create(username, password, role, fullName) {
    const query = `
      INSERT INTO users (username, password, role, full_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, role, full_name, created_at
    `;
    const values = [username, password, role, fullName];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await pool.query(query, [username]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, username, role, full_name, created_at FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async listByRole(role) {
    const query = 'SELECT id, username, full_name, role, created_at FROM users WHERE role = $1 ORDER BY id DESC';
    const { rows } = await pool.query(query, [role]);
    return rows;
  }
}

module.exports = User;
