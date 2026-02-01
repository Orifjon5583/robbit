const taskController = require('../controllers/taskController');
const { authMiddleware } = require('../middlewares/auth');

module.exports = async (fastify) => {
  fastify.post('/api/tasks', { preHandler: authMiddleware }, (request, reply) =>
    taskController.createTask(request, reply)
  );

  fastify.get('/api/tasks', { preHandler: authMiddleware }, (request, reply) =>
    taskController.getTasks(request, reply)
  );

  fastify.get('/api/tasks/:id', { preHandler: authMiddleware }, (request, reply) =>
    taskController.getTaskById(request, reply)
  );
};