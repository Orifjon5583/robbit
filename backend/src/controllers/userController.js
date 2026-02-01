const User = require('../models/User');
const Group = require('../models/Group');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
  /**
   * Yangi foydalanuvchi yaratish.
   * Loyiha talabiga ko'ra, faqat tizimga kirgan "super_admin" yangi
   * foydalanuvchi (o'qituvchi yoki o'quvchi) yarata oladi.
   * Birinchi "super_admin"ni yaratish uchun "npm run seed" ishlatiladi.
   */
  async register(request, reply) {
    try {
      if (!request.user || request.user.role !== 'super_admin') {
        return reply.status(403).send({ error: 'Faqat Super Admin foydalanuvchi yarata oladi' });
      }

      const { username, password, role, fullName } = request.body;
      if (!['teacher', 'student', 'super_admin'].includes(role)) {
        return reply.status(400).send({ error: 'Noto‘g‘ri rol tanlandi' });
      }

      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return reply.status(409).send({ error: 'Bu nomdagi foydalanuvchi mavjud' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create(username, hashedPassword, role, fullName);
      reply.status(201).send(user);
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: 'Foydalanuvchi yaratishda xatolik' });
    }
  }

  /**
   * Tizimga kirish (Login).
   * Foydalanuvchi nom va parolni tekshirib, to'g'ri bo'lsa JWT token qaytaradi.
   */
  async login(request, reply) {
    try {
      const { username, password } = request.body;
      const user = await User.findByUsername(username);
      if (!user) {
        return reply.status(401).send({ error: 'Login yoki parol xato' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return reply.status(401).send({ error: 'Login yoki parol xato' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'my_default_secret_key',
        { expiresIn: '24h' }
      );

      // Parolni javobdan olib tashlaymiz
      const { password: _, ...userData } = user;
      reply.send({ token, user: userData });
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: 'Tizimga kirishda xatolik' });
    }
  }

  /**
   * Foydalanuvchilar ro'yxatini olish (faqat super_admin uchun).
   */
  async getAllUsers(request, reply) {
    try {
      if (request.user.role !== 'super_admin') {
        return reply.status(403).send({ error: 'Ruxsat yo‘q' });
      }
      const { role } = request.query; // ?role=student kabi filterlash uchun
      const users = await User.listByRole(role);
      reply.send(users);
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: 'Foydalanuvchilarni olishda xatolik' });
    }
  }

  /**
   * Parolni tiklash.
   * Admin - hamma uchun.
   * O'qituvchi - faqat o'z guruhidagi o'quvchilar uchun.
   */
  async resetPassword(request, reply) {
    try {
      const { studentId, newPassword } = request.body;
      const loggedInUser = request.user;
      
      let hasPermission = false;
      
      if (loggedInUser.role === 'super_admin') {
        hasPermission = true;
      } else if (loggedInUser.role === 'teacher') {
        const isStudentInGroup = await Group.checkStudentBelongsToTeacher(studentId, loggedInUser.id);
        if (isStudentInGroup) {
          hasPermission = true;
        }
      }

      if (!hasPermission) {
        return reply.status(403).send({ error: 'Bu foydalanuvchining parolini o‘zgartirishga ruxsat yo‘q' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const pool = require('../utils/database'); // To'g'ridan-to'g'ri query uchun
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, studentId]);

      reply.send({ message: 'Parol muvaffaqiyatli yangilandi' });
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: 'Parolni tiklashda xatolik' });
    }
  }
}

module.exports = new UserController();