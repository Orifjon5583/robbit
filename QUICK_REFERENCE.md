# Quick Reference Guide

## Installation & Startup

### Option 1: Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# Initialize database
docker-compose exec backend npm run init-db

# Seed demo data
docker-compose exec backend npm run seed

# Access
# Frontend: http://localhost:3001
# Backend: http://localhost:3000/api
# DB: localhost:5432
```

### Option 2: Manual Setup
```bash
# Backend
cd backend
npm install
npm run init-db
npm run seed
npm start                         # Runs on :3000

# Frontend (new terminal)
cd frontend
npm install
npm run dev                       # Runs on :3001
```

---

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Super Admin | admin | admin123 |
| Teacher 1 | teacher1 | teacher123 |
| Teacher 2 | teacher2 | teacher123 |
| Student 1-5 | student1-5 | student123 |

---

## Core Features Checklist

- ✅ User Management (create, read, list)
- ✅ Group Management (create, add students, assign teachers)
- ✅ Task Creation (Quiz & Block Test)
- ✅ Assignment Management
- ✅ Analytics & Statistics
- ✅ Password Reset
- ✅ JWT Authentication
- ✅ RBAC Middleware
- ✅ Database Schema
- ✅ Seed Script

---

## Important Directories

| Path | Purpose |
|------|---------|
| `/backend/src/controllers` | Request handlers |
| `/backend/src/services` | Business logic |
| `/backend/src/routes` | API endpoints |
| `/backend/src/middlewares` | Auth & RBAC |
| `/backend/scripts` | DB init & seeding |
| `/frontend/pages` | React pages/routes |
| `/frontend/components` | React components |
| `/frontend/utils` | Helper functions |
| `/frontend/styles` | CSS stylesheets |

---

## API Quick Reference

### Authentication
```bash
# Register
POST /api/auth/register
{ "username": "user", "password": "pass", "role": "student" }

# Login
POST /api/auth/login
{ "username": "user", "password": "pass" }
```

### Groups
```bash
# Create (Super Admin)
POST /api/groups
{ "name": "Class Name" }

# List
GET /api/groups

# Add student (Super Admin)
POST /api/groups/add-student
{ "studentId": 5, "groupId": 1 }

# Get students in group
GET /api/groups/:groupId/students
```

### Tasks
```bash
# Create (Teacher)
POST /api/tasks
{ "title": "Task Name", "type": "quiz", "content": {...} }

# List
GET /api/tasks

# Get one
GET /api/tasks/:id

# Update (Teacher)
PUT /api/tasks/:id
{ "title": "New Title" }
```

### Assignments
```bash
# Create (Teacher)
POST /api/assignments
{ "taskId": 1, "studentId": 5 }

# Get student's assignments
GET /api/assignments/student/:studentId

# Update status
PUT /api/assignments/:id
{ "status": "completed", "score": 85 }

# Get task stats
GET /api/assignments/task/:taskId/stats
```

### Analytics
```bash
# Task progress
GET /api/analytics/task/:taskId/progress

# Student stats
GET /api/analytics/student/:studentId

# Group stats (Teacher/Admin)
GET /api/analytics/group/:groupId

# Global stats (Admin only)
GET /api/analytics/global
```

---

## Frontend Pages

| Route | Purpose | Requires |
|-------|---------|----------|
| `/` | Home page | No auth |
| `/login` | Login page | No auth |
| `/dashboard` | Main dashboard | Auth |

---

## Permission Matrix

| Action | Super Admin | Teacher | Student |
|--------|:-----------:|:-------:|:-------:|
| Create users | ✅ | ❌ | ❌ |
| Create groups | ✅ | ❌ | ❌ |
| Add students to group | ✅ | ❌ | ❌ |
| Assign teachers | ✅ | ❌ | ❌ |
| Create tasks | ✅ | ✅ | ❌ |
| Assign tasks | ✅ | ✅ | ❌ |
| View all analytics | ✅ | ❌ | ❌ |
| View group analytics | ✅ | ✅ | ❌ |
| View own progress | ✅ | ✅ | ✅ |
| Reset student password | ✅ | ✅* | ❌ |
| View assigned tasks | ✅ | ✅ | ✅ |
| Submit tasks | ✅ | ❌ | ✅ |

*Teacher can reset passwords for students in their groups only

---

## Database Commands

```bash
# Connect to database
psql -U postgres -d educational_platform

# View tables
\dt

# View schema
\d users
\d groups
\d assignments

# Useful queries
SELECT * FROM users;
SELECT * FROM groups;
SELECT * FROM assignments;
SELECT * FROM students_groups;

# Check student count
SELECT COUNT(*) FROM users WHERE role = 'student';

# Check assignments
SELECT a.id, t.title, u.username, a.status
FROM assignments a
JOIN tasks t ON a.task_id = t.id
JOIN users u ON a.student_id = u.id;
```

---

## Troubleshooting

### "Connection refused" on port 3000
```bash
# Check if backend is running
curl http://localhost:3000/api/health

# If not, restart backend
cd backend && npm start
```

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Database connection error
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check database exists
psql -U postgres -l | grep educational_platform

# Recreate if needed
dropdb -U postgres educational_platform
createdb -U postgres educational_platform
npm run init-db
```

### CORS errors
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Should match backend URL (default: `http://localhost:3000/api`)
- Clear browser cache and restart

### "Module not found" error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Environment Variables

### Backend (.env)
```
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=educational_platform
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
PORT=3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Common Tasks

### Create a new user
```bash
# Via API
POST /api/auth/register
{
  "username": "newuser",
  "password": "securepass",
  "role": "student"
}
```

### Create a quiz task
```bash
POST /api/tasks
{
  "title": "Math Quiz",
  "type": "quiz",
  "content": {
    "questions": [
      {
        "id": 1,
        "text": "What is 2+2?",
        "options": ["A) 3", "B) 4", "C) 5"],
        "correct": "B",
        "topic": "arithmetic"
      }
    ]
  }
}
```

### Assign task to students
```bash
# Create assignment for each student
POST /api/assignments
{ "taskId": 1, "studentId": 1 }

POST /api/assignments
{ "taskId": 1, "studentId": 2 }
```

### Reset student password (Teacher)
```bash
POST /api/users/reset-password
{
  "studentId": 5,
  "newPassword": "temppass123"
}
```

---

## File Sizes & Statistics

| Component | Count | Files |
|-----------|-------|-------|
| Backend Controllers | 5 | userController, groupController, etc |
| Backend Services | 5 | userService, groupService, etc |
| Backend Routes | 5 | userRoutes, groupRoutes, etc |
| Frontend Pages | 4 | index, login, dashboard, _app |
| Frontend Components | 5 | LoginForm, GroupList, etc |
| API Endpoints | 27 | See API_DOCUMENTATION.md |
| Database Tables | 8 | users, groups, tasks, assignments, etc |

---

## Performance Tips

1. **Database**
   - Add indexes for frequently queried columns
   - Use connection pooling (already implemented)

2. **Frontend**
   - Enable image optimization
   - Use lazy loading
   - Minimize bundle size

3. **Backend**
   - Cache frequent requests
   - Implement pagination
   - Add rate limiting

---

## Production Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV to production
- [ ] Enable HTTPS
- [ ] Configure CORS for your domain
- [ ] Set up database backups
- [ ] Enable error logging
- [ ] Add monitoring
- [ ] Configure CDN
- [ ] Set up SSL certificate
- [ ] Test all features
- [ ] Review security
- [ ] Load test the system

---

## Useful Links

- Next.js Docs: https://nextjs.org/docs
- Fastify Docs: https://www.fastify.io
- PostgreSQL Docs: https://www.postgresql.org/docs
- JWT Info: https://jwt.io
- Blockly Docs: https://developers.google.com/blockly

---

## Version Info

- Node.js: 14+
- PostgreSQL: 12+
- Next.js: 13+
- Fastify: 4+
- React: 18+

---

## Support

📚 **Documentation**: Read SETUP.md, README.md, API_DOCUMENTATION.md  
💻 **Troubleshooting**: See SETUP.md Troubleshooting section  
📧 **Questions**: Review API_DOCUMENTATION.md for endpoint details  

---

Last Updated: February 1, 2026
