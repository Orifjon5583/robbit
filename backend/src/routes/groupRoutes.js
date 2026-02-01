const groupController = require('../controllers/groupController');
const { authMiddleware } = require('../middlewares/auth');

/**
 * Barcha guruhlar bilan bog'liq route'lar shu yerda jamlanadi.
 * Har bir route'ga "authMiddleware" qo'shilgan, ya'ni faqat tizimga kirgan
 * foydalanuvchilar (tokeni borlar) bu yo'llarga kira oladi.
 */
module.exports = async (fastify) => {
  // Yangi guruh yaratish (faqat super_admin uchun)
  fastify.post('/api/groups', { preHandler: authMiddleware }, groupController.createGroup);

  // Barcha guruhlar ro'yxatini olish
  fastify.get('/api/groups', { preHandler: authMiddleware }, groupController.getGroups);

  // ID bo'yicha bitta guruhni olish
  fastify.get('/api/groups/:id', { preHandler: authMiddleware }, groupController.getGroupById);

  // Guruhga o'quvchi qo'shish (faqat super_admin uchun)
  fastify.post('/api/groups/add-student', { preHandler: authMiddleware }, groupController.addStudent);

  // Guruhga o'qituvchi tayinlash (faqat super_admin uchun)
  fastify.post('/api/groups/assign-teacher', { preHandler: authMiddleware }, groupController.assignTeacher);

  // Guruhdagi o'quvchilar ro'yxatini olish
  fastify.get('/api/groups/:id/students', { preHandler: authMiddleware }, groupController.getGroupStudents);
};