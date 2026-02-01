const fastify = require('fastify');
const { verifyToken } = require('../utils/auth');

const authMiddleware = async (request, reply) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return reply.status(401).send({ error: 'No token provided' });
    }
    const decoded = verifyToken(token);
    request.user = decoded;
  } catch (err) {
    return reply.status(401).send({ error: 'Invalid token' });
  }
};

const roleMiddleware = (requiredRoles) => {
  return async (request, reply) => {
    if (!requiredRoles.includes(request.user.role)) {
      return reply.status(403).send({ error: 'Access denied' });
    }
  };
};

module.exports = { authMiddleware, roleMiddleware };