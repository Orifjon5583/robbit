const pool = require('../utils/database');

class User {
  static async create(username, password, role, fullName, age) {
    const query = `
      INSERT INTO users (username, password, role, full_name, age)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, role, full_name, age, created_at
    `;
    const values = [username, password, role, fullName, age];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id, { username, role, fullName, age, password }) {
    // Dynamic query builder could be better, but for now simple
    let query = 'UPDATE users SET ';
    const values = [];
    let idx = 1;

    if (username) { query += `username = $${idx++}, `; values.push(username); }
    if (role) { query += `role = $${idx++}, `; values.push(role); }
    if (fullName) { query += `full_name = $${idx++}, `; values.push(fullName); }
    if (age) { query += `age = $${idx++}, `; values.push(age); }
    if (password) { query += `password = $${idx++}, `; values.push(password); }

    // Remove last comma
    query = query.slice(0, -2);
    query += ` WHERE id = $${idx} RETURNING id, username, role, full_name, age`;
    values.push(id);

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
