const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('../src/utils/database');
const fs = require('fs');
const path = require('path');

const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');

    const schemaPath = path.join(__dirname, '../migrations/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split commands by semicolon to execute individually if needed, 
    // but pool.query usually handles multiple statements if configured.
    // simpler to just run the whole block if valid SQL.
    // Note: pg might not support multiple statements in one query depending on config,
    // but usually string passing works.

    // Dropping tables if they exist to start fresh? 
    // schema.sql defines CREATE TABLE alone. It will error if exists?
    // The previous init.js used IF NOT EXISTS.
    // schema.sql doesn't have IF NOT EXISTS.
    // For a robust init, I should probably drop tables first in correct order.

    await pool.query('DROP TABLE IF EXISTS assignments CASCADE');
    await pool.query('DROP TABLE IF EXISTS tasks CASCADE');
    await pool.query('DROP TABLE IF EXISTS students_groups CASCADE');
    await pool.query('DROP TABLE IF EXISTS groups CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');

    await pool.query(schema);

    console.log('✓ Database initialized successfully');
    await pool.end();
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
};

initializeDatabase();

