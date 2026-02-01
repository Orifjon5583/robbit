const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/auth');

module.exports = async (fastify) => {
  fastify.post('/api/auth/register', (request, reply) => userController.register(request, reply));
  
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
};