const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('../src/utils/database');
const fs = require('fs');

// Xatolik sababi: shu yerda yana "const path = ..." bor edi, uni olib tashladik.

const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');

    // Schema faylini topish
    const schemaPath = path.join(__dirname, '../migrations/schema.sql');
    
    // Agar fayl o'chib ketgan bo'lsa, xabar berish uchun tekshiramiz
    if (!fs.existsSync(schemaPath)) {
        throw new Error(`XATOLIK: ${schemaPath} fayli topilmadi. GitHubga yuklashda o'chib ketgan bo'lishi mumkin.`);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Eski jadvallarni tozalash (tartib bilan)
    await pool.query('DROP TABLE IF EXISTS quiz_submissions CASCADE');
    await pool.query('DROP TABLE IF EXISTS block_test_submissions CASCADE');
    await pool.query('DROP TABLE IF EXISTS assignments CASCADE');
    await pool.query('DROP TABLE IF EXISTS tasks CASCADE');
    await pool.query('DROP TABLE IF EXISTS students_groups CASCADE');
    await pool.query('DROP TABLE IF EXISTS teachers_groups CASCADE');
    await pool.query('DROP TABLE IF EXISTS groups CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');

    // Yangi jadvallarni yaratish
    await pool.query(schema);

    console.log('✓ Database initialized successfully');
    await pool.end();
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
};

initializeDatabase();