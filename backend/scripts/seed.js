const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('../src/utils/database');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('Starting database seed...');

    // Create Super Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminResult = await pool.query(
      'INSERT INTO users (username, password, role, full_name) VALUES ($1, $2, $3, $4) RETURNING id',
      ['admin', adminPassword, 'super_admin', 'Super Administrator']
    );
    const adminId = adminResult.rows[0].id;
    console.log('✓ Created Super Admin');

    // Create Teachers
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const teacher1Result = await pool.query(
      'INSERT INTO users (username, password, role, full_name) VALUES ($1, $2, $3, $4) RETURNING id',
      ['teacher1', teacherPassword, 'teacher', 'Mr. Smith']
    );
    const teacher1Id = teacher1Result.rows[0].id;
    console.log('✓ Created Teacher 1');

    const teacher2Result = await pool.query(
      'INSERT INTO users (username, password, role, full_name) VALUES ($1, $2, $3, $4) RETURNING id',
      ['teacher2', teacherPassword, 'teacher', 'Ms. Johnson']
    );
    const teacher2Id = teacher2Result.rows[0].id;
    console.log('✓ Created Teacher 2');

    // Create Students
    const studentPassword = await bcrypt.hash('student123', 10);
    const studentIds = [];
    for (let i = 1; i <= 5; i++) {
      const studentResult = await pool.query(
        'INSERT INTO users (username, password, role, full_name) VALUES ($1, $2, $3, $4) RETURNING id',
        [`student${i}`, studentPassword, 'student', `Student ${i}`]
      );
      studentIds.push(studentResult.rows[0].id);
    }
    console.log('✓ Created 5 Students');

    // Create Groups (Admin creates and assigns teacher)
    const group1Result = await pool.query(
      'INSERT INTO groups (name, teacher_id, created_by) VALUES ($1, $2, $3) RETURNING id',
      ['Grade 10 - Mathematics', teacher1Id, adminId]
    );
    const group1Id = group1Result.rows[0].id;
    console.log('✓ Created Group 1 -> Assigned to Teacher 1');

    const group2Result = await pool.query(
      'INSERT INTO groups (name, teacher_id, created_by) VALUES ($1, $2, $3) RETURNING id',
      ['Grade 11 - Computer Science', teacher2Id, adminId]
    );
    const group2Id = group2Result.rows[0].id;
    console.log('✓ Created Group 2 -> Assigned to Teacher 2');

    // Add students to groups
    for (let i = 0; i < 3; i++) {
      await pool.query(
        'INSERT INTO students_groups (student_id, group_id) VALUES ($1, $2)',
        [studentIds[i], group1Id]
      );
    }
    for (let i = 3; i < 5; i++) {
      await pool.query(
        'INSERT INTO students_groups (student_id, group_id) VALUES ($1, $2)',
        [studentIds[i], group2Id]
      );
    }
    console.log('✓ Added students to groups');

    // Create sample Quiz task
    const quizContent = [
      {
        id: 1,
        text: 'What is 2 + 2?',
        options: ['A) 3', 'B) 4', 'C) 5'],
        correct: 'B'
      },
      {
        id: 2,
        text: 'What is the capital of France?',
        options: ['A) London', 'B) Paris', 'C) Berlin'],
        correct: 'B'
      }
    ];

    const quiz = await pool.query(
      `INSERT INTO tasks (title, description, type, content, topic_tag, skill_tag, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      ['Basic Math Quiz', 'Simple addition and geography', 'quiz', JSON.stringify(quizContent), 'General', 'Logic', teacher1Id]
    );
    console.log('✓ Created sample Quiz task');

    // Create assignments for quiz
    const quizTaskId = quiz.rows[0].id;
    for (let i = 0; i < 3; i++) {
      await pool.query(
        'INSERT INTO assignments (task_id, student_id, status) VALUES ($1, $2, $3)',
        [quizTaskId, studentIds[i], 'assigned']
      );
    }
    console.log('✓ Created sample assignments');

    console.log('\n✓ Database seeding completed successfully!\n');
    await pool.end();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
