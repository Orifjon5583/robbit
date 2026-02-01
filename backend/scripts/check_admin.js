const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('../src/utils/database');

const checkAdmin = async () => {
    try {
        const res = await pool.query("SELECT * FROM users WHERE username = 'admin'");
        if (res.rows.length === 0) {
            console.log('Admin user NOT found!');
        } else {
            console.log('Admin user FOUND:', res.rows[0]);
        }
        await pool.end();
    } catch (err) {
        console.error(err);
    }
};

checkAdmin();
