# Complete Educational Platform Setup Guide

## Quick Start with Docker

If you have Docker installed:

```bash
# Build and start all services
docker-compose up -d

# Wait for all services to start
sleep 10

# Initialize database
docker-compose exec backend npm run init-db

# Seed database with demo data
docker-compose exec backend npm run seed
```

Access:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- PostgreSQL: localhost:5432

---

## Manual Setup (Without Docker)

### Step 1: Prerequisites
- Node.js 14+ (https://nodejs.org)
- PostgreSQL 12+ (https://www.postgresql.org)
- npm or yarn

### Step 2: Database Setup

```bash
# Create database
createdb educational_platform

# Or if you need to specify user:
createdb -U postgres educational_platform
```

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env with your database credentials:
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=educational_platform
# JWT_SECRET=your-secret-key

# Initialize database schema
npm run init-db

# Seed database with demo data
npm run seed

# Start backend server
npm start
```

Backend will run on: http://localhost:3000

### Step 4: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local from example
copy .env.example .env.local

# Ensure it has:
# NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Start development server
npm run dev
```

Frontend will run on: http://localhost:3001

---

## Demo Credentials

After running seed script, use these credentials to log in:

### Super Admin
- **Username**: admin
- **Password**: admin123
- **Role**: Can create users, groups, assign permissions

### Teachers
- **Username**: teacher1 or teacher2
- **Password**: teacher123
- **Role**: Can create tasks, assign to students, view analytics

### Students
- **Username**: student1, student2, student3, student4, student5
- **Password**: student123
- **Role**: Can view assigned tasks, submit responses

---

## Project Structure

```
robbit/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # Data models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── middlewares/        # Auth & RBAC middleware
│   │   ├── utils/              # Helper functions
│   │   └── index.js            # Server entry point
│   ├── migrations/             # Database schema
│   ├── scripts/                # Init & seed scripts
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── pages/                  # Next.js pages
│   ├── components/             # React components
│   ├── styles/                 # CSS files
│   ├── utils/                  # Helper functions
│   ├── package.json
│   ├── next.config.js
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml          # Docker orchestration
├── README.md                   # Main documentation
├── SETUP.md                    # This file
└── API_DOCUMENTATION.md        # API reference
```

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/reset-password` - Reset student password

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - Get all groups
- `POST /api/groups/add-student` - Add student to group
- `GET /api/groups/:groupId/students` - Get students in group

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task

### Assignments
- `POST /api/assignments` - Create assignment
- `GET /api/assignments/student/:studentId` - Get student assignments
- `PUT /api/assignments/:id` - Update assignment status

### Analytics
- `GET /api/analytics/task/:taskId/progress` - Task statistics
- `GET /api/analytics/student/:studentId` - Student statistics
- `GET /api/analytics/group/:groupId` - Group statistics
- `GET /api/analytics/global` - Global statistics (Super Admin only)

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

---

## Features Implemented

### Role-Based Access Control (RBAC)
- ✅ Super Admin: Full control
- ✅ Teacher: Create tasks, assign to students, view analytics
- ✅ Student: View assigned tasks

### Group Management
- ✅ Create groups (Super Admin)
- ✅ Add/remove students (Super Admin)
- ✅ Assign teachers (Super Admin)
- ✅ View group journal (students list)

### Task Management
- ✅ Create quizzes with multiple questions
- ✅ Create block tests (Blockly-ready)
- ✅ Assign to entire group or specific students
- ✅ Track completion status

### Analytics & Statistics
- ✅ Per-task: completion rate, avg score
- ✅ Per-student: completion rate, avg score
- ✅ Per-group: student ranking, statistics
- ✅ Global: system-wide analytics (Super Admin)

### Password Management
- ✅ Teachers can reset student passwords
- ✅ Super Admin can reset any password

---

## Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check if database exists
psql -U postgres -l | grep educational_platform

# Create database if missing
createdb -U postgres educational_platform
```

### Port Already in Use (Windows)
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### Port Already in Use (Mac/Linux)
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Module Not Found Error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or if using yarn
yarn install --fresh
```

### CORS Issues
- Ensure `NEXT_PUBLIC_API_URL` is set correctly in frontend `.env.local`
- Check backend is running: `curl http://localhost:3000/api/health`
- Verify both services are accessible

### Database Migration Issues
```bash
# Drop and recreate database (⚠️ Deletes all data)
dropdb -U postgres educational_platform
createdb -U postgres educational_platform
npm run init-db
npm run seed
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

## Production Deployment

### Using Docker Compose
```bash
# Build all images
docker-compose build

# Start services in production mode
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f
```

### Manual Deployment
1. Install Node.js and PostgreSQL on server
2. Set up environment variables
3. Run database migrations
4. Start backend: `npm start`
5. Build and start frontend: `npm run build && npm start`
6. Use reverse proxy (nginx) to route requests

---

## Performance Optimization Tips

1. **Database Indexing**
   ```sql
   CREATE INDEX idx_users_role ON users(role);
   CREATE INDEX idx_assignments_student ON assignments(student_id);
   CREATE INDEX idx_assignments_task ON assignments(task_id);
   ```

2. **Caching**
   - Implement Redis for session management
   - Cache frequently accessed data

3. **API Optimization**
   - Implement pagination
   - Add rate limiting
   - Use compression middleware

4. **Frontend Optimization**
   - Enable Next.js Image optimization
   - Code splitting with dynamic imports
   - Lazy load components

---

## Security Recommendations

1. **JWT Secret**: Use strong random string in production
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Restrict to your domain
4. **Input Validation**: Validate all inputs
5. **SQL Injection**: Use parameterized queries (already implemented)
6. **Password Hashing**: Always hash passwords (bcryptjs used)
7. **Rate Limiting**: Implement to prevent abuse
8. **CSRF Protection**: Implement CSRF tokens

---

## Support & Documentation

- API Docs: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Main README: [README.md](./README.md)
- Database Schema: See [backend/migrations/schema.sql](./backend/migrations/schema.sql)

---

## Next Steps

1. ✅ Set up and run the platform
2. Test with demo credentials
3. Create custom users and groups
4. Create sample tasks
5. Assign tasks to students
6. Review analytics

Good luck! 🚀
