const Task = require('../models/Task');

class TaskController {
  async createTask(request, reply) {
    try {
      if (request.user.role !== 'teacher') {
        return reply.status(403).send({ error: 'Only Teachers can create tasks' });
      }

      const { title, description, type, content, topicTag, skillTag } = request.body;

      // Basic validation
      if (type === 'quiz') {
        if (!Array.isArray(content)) {
          return reply.status(400).send({ error: 'Quiz content must be an array of questions' });
        }
      } else if (type === 'block_test') {
        if (!content || typeof content !== 'object') {
          return reply.status(400).send({ error: 'Block test content must be valid JSON' });
        }
      } else {
        return reply.status(400).send({ error: 'Invalid task type' });
      }

      const task = await Task.create({
        title, description, type, content, topicTag, skillTag,
        createdBy: request.user.id
      });
      reply.status(201).send(task);
    } catch (err) {
      reply.status(400).send({ error: err.message });
    }
  }
}

  async getTasks(request, reply) {
    try {
      if (request.user.role === 'teacher') {
        const tasks = await Task.findByCreator(request.user.id);
        reply.send(tasks);
        return;
      }
      if (request.user.role === 'super_admin') {
        const tasks = await Task.findAll();
        reply.send(tasks);
        return;
      }
      reply.status(403).send({ error: 'Access denied' });
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }

  async getTaskById(request, reply) {
    try {
      const { id } = request.params;
      const task = await Task.findById(id);
      if (!task) return reply.status(404).send({ error: 'Task not found' });
      reply.send(task);
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }
}

module.exports = new TaskController();