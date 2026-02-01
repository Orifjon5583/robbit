const analyticsController = require('../controllers/analyticsController');
const { authMiddleware } = require('../middlewares/auth');

module.exports = async (fastify) => {
  fastify.get('/api/analytics/teacher', { preHandler: authMiddleware }, (request, reply) =>
    analyticsController.getTeacherStats(request, reply)
  );

  fastify.get('/api/analytics/admin', { preHandler: authMiddleware }, (request, reply) =>
    analyticsController.getAdminStats(request, reply)
  );
};
