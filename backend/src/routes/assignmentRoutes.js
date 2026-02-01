const assignmentController = require('../controllers/assignmentController');
const { authMiddleware } = require('../middlewares/auth');

module.exports = async (fastify) => {
  fastify.post('/api/assignments', { preHandler: authMiddleware }, (request, reply) =>
    assignmentController.createAssignment(request, reply)
  );

  fastify.get('/api/assignments', { preHandler: authMiddleware }, (request, reply) =>
    assignmentController.getAssignments(request, reply)
  );

  fastify.put('/api/assignments/:id', { preHandler: authMiddleware }, (request, reply) =>
    assignmentController.updateProgress(request, reply)
  );
};