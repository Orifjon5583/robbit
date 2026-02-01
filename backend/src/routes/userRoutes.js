const { authMiddleware } = require('../middlewares/auth');

module.exports = async (fastify) => {
  // Ro'yxatdan o'tish (Faqat Admin yarata oladi, shuning uchun auth kerak)
  fastify.post('/api/auth/register', { preHandler: authMiddleware }, (request, reply) => userController.register(request, reply));

  fastify.post('/api/auth/login', (request, reply) => userController.login(request, reply));

  fastify.get('/api/users', { preHandler: authMiddleware }, (request, reply) =>
    userController.getAllUsers(request, reply)
  );

  fastify.get('/api/users/:id', { preHandler: authMiddleware }, (request, reply) =>
    userController.getUserById(request, reply)
  );

  fastify.post('/api/users/reset-password', { preHandler: authMiddleware }, (request, reply) =>
    userController.resetPassword(request, reply)
  );

  fastify.put('/api/users/:id', { preHandler: authMiddleware }, (request, reply) =>
    userController.updateUser(request, reply)
  );
  fastify.delete('/api/users/:id', { preHandler: authMiddleware }, (request, reply) =>
    userController.deleteUser(request, reply)
  );
};