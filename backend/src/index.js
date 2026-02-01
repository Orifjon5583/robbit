// Entry point for Fastify server (Debug Mode 3)
const fastify = require('fastify')({ logger: true });
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// CORS sozlamalari (Frontend ulanishi uchun)
fastify.register(require('@fastify/cors'), {
  origin: true, // Barcha domenlarga ruxsat berish (development uchun)
  credentials: true,
});

// Route'larni chaqirib olish
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const taskRoutes = require('./routes/taskRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Route'larni ro'yxatdan o'tkazish
fastify.register(userRoutes);
fastify.register(groupRoutes);
fastify.register(taskRoutes);
fastify.register(assignmentRoutes);
fastify.register(analyticsRoutes);

// Tekshirish uchun oddiy endpoint
fastify.get('/api/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Asosiy sahifa
fastify.get('/', async (request, reply) => {
  return { message: 'Educational Platform API is running!' };
});

// Serverni ishga tushirish
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    const host = '0.0.0.0'; // Barcha tarmoqlar uchun ochiq
    await fastify.listen({ port, host });
    console.log(`Server ishga tushdi: http://localhost:${port}`);
    console.log(fastify.printRoutes()); // LOG ALL ROUTES
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();