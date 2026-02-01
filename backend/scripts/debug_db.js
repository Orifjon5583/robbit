const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

(async () => {
    try {
        console.log('Testing connection to:', process.env.DB_HOST, process.env.DB_PORT, process.env.DB_NAME);
        console.log('User:', process.env.DB_USER);
        const client = await pool.connect();
        console.log('Successfully connected!');
        client.release();
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }
})();
