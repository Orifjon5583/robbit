const pool = require('../utils/database');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/auth');

class UserService {
  async createUser(username, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, role]
    );
    return result.rows[0];
  }

  async getUserById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  async getAllUsers() {
    const result = await pool.query('SELECT id, username, role, created_at FROM users');
    return result.rows;
  }

  async loginUser(username, password) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) throw new Error('User not found');
    
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error('Invalid password');
    
    const token = generateToken(user);
    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }

  async resetPassword(studentId, newPassword, teacherId) {
    // Verify teacher has access to this student's group
    const result = await pool.query(
      'SELECT * FROM students_groups WHERE student_id = $1',
      [studentId]
    );
    
    if (result.rows.length === 0) throw new Error('Student not found in any group');
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, studentId]);
    
    return { message: 'Password reset successfully' };
  }
}

module.exports = new UserService();