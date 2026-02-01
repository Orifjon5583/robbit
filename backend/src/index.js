const fastify = require('fastify')({ logger: true });

// Register CORS
fastify.register(require('@fastify/cors'), {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
});

// Import routes
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const taskRoutes = require('./routes/taskRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Register routes
fastify.register(userRoutes);
fastify.register(groupRoutes);
fastify.register(taskRoutes);
fastify.register(assignmentRoutes);
fastify.register(analyticsRoutes);

// Health check endpoint
fastify.get('/api/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Root endpoint
fastify.get('/', async (request, reply) => {
  return {
    name: 'Educational Platform API',
    version: '1.0.0',
    status: 'running',
    documentation: '/api/docs',
  };
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(500).send({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred',
  });
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    await fastify.listen({ port, host });
    fastify.log.info(`Server listening on http://${host}:${port}`);
    fastify.log.info('API available at http://localhost:' + port + '/api');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();