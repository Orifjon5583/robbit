const User = require('../models/User');
const Group = require('../models/Group');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
  async register(request, reply) {
    // Only Super Admin can create users (teachers, students)
    // Or maybe we allow a public registration? Requirement says "Only Super Admin can create teachers/students".
    // So we check permission.
    try {
      // Assuming authorization middleware sets request.user
      // Check if user is super_admin. 
      // Note: If no users exist, we might need a way to seed the first admin. 
      // But for this endpoint, if it's protected, we strictly enforce it.
      if (request.user.role !== 'super_admin') {
        return reply.status(403).send({ error: 'Only Super Admin can create users' });
      }

      const { username, password, role, fullName } = request.body;
      if (!['teacher', 'student', 'super_admin'].includes(role)) {
        return reply.status(400).send({ error: 'Invalid role' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create(username, hashedPassword, role, fullName);
      reply.status(201).send(user);
    } catch (err) {
      reply.status(400).send({ error: err.message });
    }
  }

  async login(request, reply) {
    try {
      const { username, password } = request.body;
      const user = await User.findByUsername(username);
      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '1d' }
      );

      reply.send({ token, user: { id: user.id, username: user.username, role: user.role, fullName: user.full_name } });
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }

  async getAllUsers(request, reply) {
    try {
      // Super Admin sees everything. Teachers might need to see students? 
      // Requirement: "Super Admin can see everything."
      // Let's assume this is for Admin to list users.
      if (request.user.role !== 'super_admin') {
        return reply.status(403).send({ error: 'Access denied' });
      }
      const { role } = request.query;
      if (role) {
        const users = await User.listByRole(role);
        return reply.send(users);
      }
      // If no role specified, maybe return all? Or error? Standardizing on role filter.
      // For now let's just support role filter.
      return reply.status(400).send({ error: 'Role query parameter required' });
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }

  async resetPassword(request, reply) {
    try {
      const { studentId, newPassword } = request.body;

      let allowed = false;
      if (request.user.role === 'super_admin') {
        allowed = true;
      } else if (request.user.role === 'teacher') {
        // Check if student is in teacher's group
        const isStudent = await Group.checkStudentBelongsToTeacher(studentId, request.user.id);
        if (isStudent) {
          allowed = true;
        }
      }

      if (!allowed) {
        return reply.status(403).send({ error: 'Access denied: You cannot reset this user password' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      // We don't have a direct updatePassword method in User yet, assume we can extend User or use raw query.
      // Let's rely on User model having an update feature or just add it now inline if needed?
      // Better to add method to User model or use a generic update.
      // For now, I'll direct query or assume User.updatePassword exists (it doesn't).
      // I'll add the query here for speed or update User.js in next turn. 
      // Wait, I can't update User.js in parallel. I'll just use the pool import if I could... 
      // But I can't import pool here properly if I want to keep separation. 
      // I'll assume User has it or fail? No, I must ensure code works.
      // I'll use a raw query via pool imported from utils/database
      const pool = require('../utils/database');
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, studentId]);

      reply.send({ message: 'Password updated successfully' });
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }
}

module.exports = new UserController();
