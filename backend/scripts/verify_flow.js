const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const API_URL = `http://localhost:${process.env.PORT || 5000}/api`;

const runVerification = async () => {
    try {
        console.log('Starting Verification...');

        // 1. Login as Super Admin
        console.log('1. Logging in as Super Admin...');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, { username: 'admin', password: 'admin123' });
        const adminToken = adminLogin.data.token;
        if (!adminToken) throw new Error('Admin login failed');
        console.log('   Admin logged in.');

        // 2. Create a Group (Admin)
        console.log('2. Creating a Group...');
        const groupRes = await axios.post(`${API_URL}/groups`, { name: 'Test Group' }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const groupId = groupRes.data.id;
        console.log(`   Group created (ID: ${groupId}).`);

        // 3. Login as Teacher
        console.log('3. Logging in as Teacher...');
        const teacherLogin = await axios.post(`${API_URL}/auth/login`, { username: 'teacher1', password: 'teacher123' });
        const teacherToken = teacherLogin.data.token;
        console.log('   Teacher logged in.');

        // 4. Create a Task (Teacher)
        console.log('4. Creating a Quiz Task...');
        const taskRes = await axios.post(`${API_URL}/tasks`, {
            title: 'Verify Quiz',
            type: 'quiz',
            content: { questions: [{ text: '1+1?', options: ['2', '3', '4'], correct: 'A' }] }
        }, {
            headers: { Authorization: `Bearer ${teacherToken}` }
        });
        const taskId = taskRes.data.id;
        console.log(`   Task created (ID: ${taskId}).`);

        // 5. Login as Student
        console.log('5. Logging in as Student...');
        const studentLogin = await axios.post(`${API_URL}/auth/login`, { username: 'student1', password: 'student123' });
        const studentToken = studentLogin.data.token;
        const studentId = studentLogin.data.user.id;
        console.log(`   Student logged in (ID: ${studentId}).`);

        // 6. Assign Task to Student (Teacher)
        console.log('6. Assigning Task to Student...');
        await axios.post(`${API_URL}/assignments`, {
            taskId: taskId,
            studentId: studentId
        }, {
            headers: { Authorization: `Bearer ${teacherToken}` }
        });
        console.log('   Task assigned.');

        // 7. Check Assignments (Student)
        console.log('7. Checking Student Assignments...');
        const assignmentsRes = await axios.get(`${API_URL}/assignments`, {
            headers: { Authorization: `Bearer ${studentToken}` }
        });
        const assignment = assignmentsRes.data.find(a => a.task_id === taskId);
        if (!assignment) throw new Error('Assignment not found for student');
        console.log(`   Assignment found (ID: ${assignment.id}).`);

        // 8. Submit Assignment (Student)
        console.log('8. Submitting Assignment...');
        await axios.put(`${API_URL}/assignments/${assignment.id}`, {
            status: 'completed',
            score: 100,
            submissionData: { answers: { 0: 'A' } }
        }, {
            headers: { Authorization: `Bearer ${studentToken}` }
        });
        console.log('   Assignment submitted.');

        // 9. Check Analytics (Teacher)
        console.log('9. Checking Teacher Analytics...');
        const analyticsRes = await axios.get(`${API_URL}/analytics/teacher`, {
            headers: { Authorization: `Bearer ${teacherToken}` }
        });
        // We just check if it returns data.
        if (analyticsRes.status !== 200) throw new Error('Analytics failed');
        console.log('   Analytics retrieved.');

        console.log('\nSUCCESS: All Verification Steps Passed!');
    } catch (err) {
        console.error('\nFAILURE:', err.response?.data || err.message);
        process.exit(1);
    }
};

runVerification();
