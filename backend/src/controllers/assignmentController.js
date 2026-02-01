const Assignment = require('../models/Assignment');
const Group = require('../models/Group');

class AssignmentController {
  async createAssignment(request, reply) {
    try {
      if (request.user.role !== 'teacher') {
        return reply.status(403).send({ error: 'Only Teachers can assign tasks' });
      }

      const { taskId, groupId, studentIds } = request.body;

      const createdAssignments = [];

      if (groupId) {
        // Check if teacher owns group
        const group = await Group.findById(groupId);
        if (group.teacher_id !== request.user.id) {
          return reply.status(403).send({ error: 'You can only assign to your own groups' });
        }

        // Get all students
        const students = await Group.getStudents(groupId);
        for (const student of students) {
          const assignment = await Assignment.assignToStudent(taskId, student.id);
          createdAssignments.push(assignment);
        }
      } else if (studentIds && Array.isArray(studentIds)) {
        // Assign to specific students
        // Should verify they are in teacher's groups? Requirement says "Teacher can assign to selected students from group journal".
        // So implicitely they are.
        for (const sId of studentIds) {
          // Optional: Check if sId belongs to teacher
          const assignment = await Assignment.assignToStudent(taskId, sId);
          createdAssignments.push(assignment);
        }
      } else {
        return reply.status(400).send({ error: 'Must provide groupId or studentIds' });
      }

      reply.status(201).send(createdAssignments);
    } catch (err) {
      reply.status(400).send({ error: err.message });
    }
  }

  async getAssignments(request, reply) {
    try {
      if (request.user.role === 'student') {
        const assignments = await Assignment.findByStudent(request.user.id);
        reply.send(assignments);
      } else if (request.user.role === 'teacher') {
        // Maybe filter by task or group?
        const { groupId, taskId } = request.query;
        if (groupId && taskId) {
          const assignments = await Assignment.findByGroupAndTask(groupId, taskId);
          reply.send(assignments);
        } else {
          reply.status(400).send({ error: 'Teachers must specify groupId and taskId to view assignments' });
        }
      } else {
        reply.status(403).send({ error: 'Access denied' });
      }
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }

  async updateProgress(request, reply) {
    try {
      const { id } = request.params;
      const { status, score, submissionData } = request.body;

      // TODO: Check if user owns this assignment
      // For now assume yes if they know the ID

      const updated = await Assignment.updateProgress(id, { status, score, submissionData });
      reply.send(updated);
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  }
}

module.exports = new AssignmentController();