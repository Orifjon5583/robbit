const Group = require('../models/Group');

class GroupController {
  async createGroup(request, reply) {
    try {
      if (request.user.role !== 'super_admin') {
        return reply.status(403).send({ error: 'Only Super Admin can create groups' });
      }
      const { name, teacherId } = request.body;
      const group = await Group.create(name, teacherId, request.user.id);
      reply.status(201).send(group);
    } catch (err) {
      reply.status(400).send({ error: err.message });
    }
  }

  async getGroups(request, reply) {
    try {
      if (request.user.role === 'super_admin') {
        const groups = await Group.findAll();
        reply.send(groups);
      } else if (request.user.role === 'teacher') {
        const groups = await Group.findByTeacher(request.user.id);
        reply.send(groups);
      } else {
        reply.status(403).send({ error: 'Access denied' });
      }
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }

  async getGroupById(request, reply) {
    try {
      const { id } = request.params;
      const group = await Group.findById(id);
      if (!group) return reply.status(404).send({ error: 'Group not found' });

      if (request.user.role === 'teacher' && group.teacher_id !== request.user.id) {
        return reply.status(403).send({ error: 'Access denied' });
      }
      if (request.user.role === 'student') {
        // Allow student to see group if they are in it? 
        // For now deny to be safe as per "Teacher cannot add students" rule implies strict control.
        return reply.status(403).send({ error: 'Access denied' });
      }

      reply.send(group);
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }

  async addStudent(request, reply) {
    try {
      if (request.user.role !== 'super_admin') {
        return reply.status(403).send({ error: 'Only Super Admin can add students to groups' });
      }
      const { groupId, studentId } = request.body;
      const result = await Group.addStudent(groupId, studentId);
      reply.status(201).send(result);
    } catch (err) {
      reply.status(400).send({ error: err.message });
    }
  }

  async updateGroup(request, reply) {
    console.log('updateGroup handler called with Params:', request.params, 'Body:', request.body);
    try {
      if (request.user.role !== 'super_admin') {
        return reply.status(403).send({ error: 'Only Super Admin can update groups' });
      }
      const { id } = request.params;
      const { name, teacherId } = request.body;
      const result = await Group.update(id, { name, teacherId });
      reply.send(result);
    } catch (err) {
      reply.status(400).send({ error: err.message });
    }
  }

  async getGroupStudents(request, reply) {
    try {
      const { id } = request.params; // groupId
      if (request.user.role === 'teacher') {
        const group = await Group.findById(id);
        if (!group || group.teacher_id !== request.user.id) {
          return reply.status(403).send({ error: 'Access denied' });
        }
      } else if (request.user.role !== 'super_admin') {
        return reply.status(403).send({ error: 'Access denied' });
      }

      const students = await Group.getStudents(id);
      reply.send(students);
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }

  async deleteGroup(request, reply) {
    try {
      if (request.user.role !== 'super_admin') {
        return reply.status(403).send({ error: 'Only Super Admin can delete groups' });
      }
      const { id } = request.params;
      await Group.delete(id);
      reply.send({ message: 'Group deleted successfully' });
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }

  async removeStudent(request, reply) {
    try {
      if (request.user.role !== 'super_admin') {
        return reply.status(403).send({ error: 'Only Super Admin can remove students' });
      }
      const { groupId, studentId } = request.body;
      await Group.removeStudent(groupId, studentId);
      reply.send({ message: 'Student removed from group' });
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }
}

module.exports = new GroupController();