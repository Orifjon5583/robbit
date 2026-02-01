const groupController = require('../controllers/groupController');
const { authMiddleware } = require('../middlewares/auth');

module.exports = async (fastify) => {
  fastify.post('/api/groups', { preHandler: authMiddleware }, (request, reply) =>
    groupController.createGroup(request, reply)
  );

  fastify.get('/api/groups', { preHandler: authMiddleware }, (request, reply) =>
    groupController.getGroups(request, reply)
  );

  fastify.get('/api/groups/:id', { preHandler: authMiddleware }, (request, reply) =>
    groupController.getGroupById(request, reply)
  );

  fastify.post('/api/groups/add-student', { preHandler: authMiddleware }, (request, reply) =>
    groupController.addStudent(request, reply)
  );

  fastify.get('/api/groups/:id/students', { preHandler: authMiddleware }, (request, reply) =>
    groupController.getGroupStudents(request, reply)
  );

  fastify.post('/api/groups/assign-teacher', { preHandler: authMiddleware }, (request, reply) =>
    groupController.assignTeacher(request, reply)
  );
};