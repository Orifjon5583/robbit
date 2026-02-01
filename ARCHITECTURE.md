# System Architecture Documentation

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Teacher    │    │   Student    │    │ Super Admin  │      │
│  │   Interface  │    │  Interface   │    │ Interface    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                    │                    │              │
│         └────────────────────┴────────────────────┘              │
│                          │                                       │
│              ┌───────────▼──────────────┐                       │
│              │   Next.js Frontend       │                       │
│              │   (React Components)     │                       │
│              │                          │                       │
│              │  Pages:                  │                       │
│              │  - Login                 │                       │
│              │  - Dashboard             │                       │
│              │  - Task Management       │                       │
│              │  - Analytics             │                       │
│              └───────────┬──────────────┘                       │
│                          │                                       │
│                     HTTP/HTTPS                                  │
│                          │                                       │
└──────────────────────────┼──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    API GATEWAY LAYER                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│              ┌─────────────────────────────┐                    │
│              │   Fastify Server (Port 3000)│                    │
│              │                             │                    │
│              │  - CORS Middleware          │                    │
│              │  - Auth Middleware (JWT)    │                    │
│              │  - Error Handling           │                    │
│              │  - Request Validation       │                    │
│              └──────────────┬──────────────┘                    │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    APPLICATION LAYER                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   User       │  │  Group       │  │  Task        │          │
│  │  Routes      │  │  Routes      │  │  Routes      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                    │
│         └─────────────────┴─────────────────┘                    │
│                           │                                      │
│                   ┌───────▼────────┐                            │
│                   │  Controllers   │                            │
│                   │  (Handlers)    │                            │
│                   └───────┬────────┘                            │
│                           │                                      │
│                   ┌───────▼────────┐                            │
│                   │  Services      │                            │
│                   │  (Business     │                            │
│                   │   Logic)       │                            │
│                   └───────┬────────┘                            │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                    DATA LAYER                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │         PostgreSQL Database (Port 5432)                │     │
│  │                                                         │     │
│  │  Tables:                                               │     │
│  │  ├─ users (id, username, password, role)              │     │
│  │  ├─ groups (id, name, created_by)                     │     │
│  │  ├─ students_groups (student_id, group_id)            │     │
│  │  ├─ teachers_groups (teacher_id, group_id)            │     │
│  │  ├─ tasks (id, title, type, content)                  │     │
│  │  ├─ assignments (id, task_id, student_id, status)     │     │
│  │  ├─ quiz_submissions (id, assignment_id, answers)     │     │
│  │  └─ block_test_submissions (id, assignment_id, blocks)│     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Authentication Flow
```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    {username, password}
       │
       ▼
┌─────────────────────────┐
│   Login Endpoint        │
│   (userController)      │
└────────────┬────────────┘
             │
             │ 2. Hash password & compare
             │
             ▼
        ┌────────────┐
        │ PostgreSQL │
        │ users      │
        │  table     │
        └────┬───────┘
             │
             │ 3. If valid
             │
             ▼
    ┌─────────────────┐
    │ Generate JWT    │
    │ (auth.js)       │
    └────────┬────────┘
             │
             │ 4. Return token & user info
             │
             ▼
    ┌─────────────────┐
    │ Store token in  │
    │ localStorage    │
    └─────────────────┘
```

### 2. Task Assignment Flow
```
┌─────────────┐
│   Teacher   │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. Select task & students
       │    POST /api/assignments
       │
       ▼
┌────────────────────────┐
│ authMiddleware         │
│ (Verify JWT)           │
└────────┬───────────────┘
         │
         │ 2. Verify user is teacher
         │
         ▼
┌────────────────────────┐
│ assignmentController   │
│ (createAssignment)     │
└────────┬───────────────┘
         │
         │ 3. Call assignmentService
         │
         ▼
┌────────────────────────┐
│ assignmentService      │
│ (Business logic)       │
└────────┬───────────────┘
         │
         │ 4. Insert into DB
         │    (per student record)
         │
         ▼
    ┌─────────────┐
    │ PostgreSQL  │
    │ assignments │
    │  table      │
    └────┬────────┘
         │
         │ 5. Return assignment record
         │
         ▼
    ┌──────────────┐
    │ Response to  │
    │ frontend     │
    └──────────────┘
```

### 3. Analytics Flow
```
┌─────────────────┐
│   Teacher/Admin │
│   (Frontend)    │
└────────┬────────┘
         │
         │ 1. Request analytics
         │    GET /api/analytics/group/:id
         │
         ▼
┌──────────────────────────┐
│ authMiddleware           │
│ roleMiddleware           │
│ (Verify permissions)     │
└────────┬─────────────────┘
         │
         │ 2. Verify is teacher/admin
         │
         ▼
┌──────────────────────────┐
│ analyticsController      │
│ (getGroupStats)          │
└────────┬─────────────────┘
         │
         │ 3. Call analyticsService
         │
         ▼
┌──────────────────────────┐
│ analyticsService         │
│ (Complex SQL query)      │
└────────┬─────────────────┘
         │
         │ 4. Join multiple tables
         │    GROUP BY, aggregations
         │
         ▼
    ┌──────────────┐
    │ PostgreSQL   │
    │ (Multiple    │
    │  tables)     │
    └────┬─────────┘
         │
         │ 5. Return aggregated data
         │
         ▼
    ┌─────────────────────┐
    │ Format & return     │
    │ JSON response       │
    └─────────────────────┘
```

---

## Component Architecture

### Frontend Components
```
App (_app.js)
  │
  ├─ LoginForm.js
  │  └─ Login API call
  │
  ├─ Dashboard.js
  │  ├─ GroupList.js
  │  │  └─ Fetch groups API
  │  ├─ TaskList.js
  │  │  └─ Fetch tasks API
  │  ├─ CreateTaskForm.js
  │  │  └─ Create task API
  │  ├─ AssignmentForm.js
  │  │  └─ Create assignment API
  │  └─ Analytics.js
  │     └─ Fetch analytics API
  │
  └─ Utilities
     ├─ auth.js (token management)
     └─ api.js (axios instance)
```

### Backend Services
```
Fastify Server
  │
  ├─ Routes
  │  ├─ userRoutes.js
  │  ├─ groupRoutes.js
  │  ├─ taskRoutes.js
  │  ├─ assignmentRoutes.js
  │  └─ analyticsRoutes.js
  │
  ├─ Controllers
  │  ├─ userController.js
  │  ├─ groupController.js
  │  ├─ taskController.js
  │  ├─ assignmentController.js
  │  └─ analyticsController.js
  │
  ├─ Services (Business Logic)
  │  ├─ userService.js
  │  ├─ groupService.js
  │  ├─ taskService.js
  │  ├─ assignmentService.js
  │  └─ analyticsService.js
  │
  ├─ Middlewares
  │  └─ auth.js
  │
  └─ Utils
     ├─ database.js
     ├─ auth.js (JWT)
     └─ password.js (hashing)
```

---

## Request-Response Cycle

### Example: Create Task Request
```
┌─ Frontend ─────────────────────────────────────────────────────┐
│                                                                  │
│ 1. Teacher submits form                                         │
│    {title, type, content}                                       │
│                                                                  │
│ 2. api.js adds Authorization header                             │
│    Bearer <JWT_TOKEN>                                           │
│                                                                  │
│ 3. POST /api/tasks                                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTP POST
                       │ Content-Type: application/json
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                   Backend (Fastify)                              │
│                                                                  │
│ 4. CORS Check ✓                                                 │
│                                                                  │
│ 5. Route Match: POST /api/tasks                                 │
│    Calls taskRoutes.js                                          │
│                                                                  │
│ 6. authMiddleware:                                              │
│    ├─ Extract token from header                                 │
│    ├─ Verify token signature                                    │
│    ├─ Decode token → request.user = {id, role, username}       │
│    └─ Next if valid, 401 if invalid                            │
│                                                                  │
│ 7. taskController.createTask():                                 │
│    ├─ Check request.user.role (must be teacher/admin)          │
│    ├─ Extract {title, type, content} from request.body         │
│    └─ Call taskService.createTask()                            │
│                                                                  │
│ 8. taskService.createTask():                                    │
│    ├─ Validate input                                            │
│    ├─ Execute SQL INSERT                                        │
│    │  INSERT INTO tasks (title, type, created_by, content)     │
│    │  VALUES ($1, $2, $3, $4)                                  │
│    └─ Return created task                                       │
│                                                                  │
│ 9. Controller returns JSON response:                            │
│    Status: 201 (Created)                                        │
│    Body: {id, title, type, created_by, content, created_at}    │
│                                                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTP 201 JSON
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                   Frontend                                       │
│                                                                  │
│ 10. axios interceptor captures response                          │
│                                                                  │
│ 11. Update local state with new task                            │
│                                                                  │
│ 12. Show success message                                        │
│                                                                  │
│ 13. Update UI - display new task in list                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Database Relationships

```
┌──────────────────┐
│     USERS        │
├──────────────────┤
│ id (PK)          │
│ username         │
│ password         │
│ role             │
└────┬─────────────┘
     │
     ├─ 1:N ──────────────┬──────────┐
     │                    │          │
     │              ┌─────▼──┐  ┌────▼─────┐
     │              │GROUPS  │  │ TASKS    │
     │              │(creator)  │(created_by)
     │              └─────────┘  └──────────┘
     │                    │
     │                    │ M:N
     │                    │
     │              ┌─────▼──────────────┐
     │              │STUDENTS_GROUPS     │
     │              │student_id (FK)     │
     │              │group_id (FK)       │
     │              └────────────────────┘
     │
     │
     ├─ 1:N ──────────────┐
     │                    │
     │              ┌─────▼────────────┐
     │              │ ASSIGNMENTS      │
     │              │ student_id (FK)  │
     │              │ task_id (FK)     │
     │              │ status, score    │
     │              └──────────────────┘
     │
     │
     └─ M:N ──────────────┐
                          │
                   ┌──────▼──────────────┐
                   │TEACHERS_GROUPS      │
                   │teacher_id (FK)      │
                   │group_id (FK)        │
                   └─────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│            REQUEST PROCESSING PIPELINE              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. CORS Middleware                                │
│     - Check origin                                 │
│     - Allow/deny cross-origin requests             │
│                                                    │
│  2. Request Parsing                                │
│     - Parse JSON body                              │
│     - Extract headers                              │
│                                                    │
│  3. Authentication (authMiddleware)                │
│     - Extract JWT token from header                │
│     - Verify token signature                       │
│     - Check expiration                             │
│     - Decode payload → request.user                │
│     ├─ If valid → continue                         │
│     └─ If invalid → 401 Unauthorized               │
│                                                    │
│  4. Authorization (roleMiddleware)                 │
│     - Check request.user.role                      │
│     - Verify required permissions                  │
│     ├─ If authorized → continue                    │
│     └─ If not → 403 Forbidden                      │
│                                                    │
│  5. Input Validation                               │
│     - Validate request body format                 │
│     - Check required fields                        │
│     - Validate data types                          │
│     ├─ If valid → continue                         │
│     └─ If invalid → 400 Bad Request                │
│                                                    │
│  6. Business Logic Execution                       │
│     - Service layer processes request              │
│     - Database queries (parameterized)             │
│     - Return data                                  │
│                                                    │
│  7. Response & Error Handling                      │
│     - Serialize response data                      │
│     - Set appropriate status code                  │
│     - Include security headers                     │
│                                                    │
└─────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Docker Compose Deployment
```
┌────────────────────────────────────────────┐
│          Docker Compose Network            │
├────────────────────────────────────────────┤
│                                            │
│  ┌────────────────────────────────────┐  │
│  │  Frontend Service                  │  │
│  │  ├─ Image: node:18-alpine          │  │
│  │  ├─ Port: 3001:3000                │  │
│  │  ├─ Env: NEXT_PUBLIC_API_URL       │  │
│  │  └─ Depends: backend service       │  │
│  └────────────────────────────────────┘  │
│           ▲                                 │
│           │ HTTP                           │
│           ▼                                 │
│  ┌────────────────────────────────────┐  │
│  │  Backend Service                   │  │
│  │  ├─ Image: node:18-alpine          │  │
│  │  ├─ Port: 3000:3000                │  │
│  │  ├─ Env: DB_*, JWT_SECRET          │  │
│  │  └─ Depends: postgres service      │  │
│  └────────────────────────────────────┘  │
│           ▲                                 │
│           │ SQL                           │
│           ▼                                 │
│  ┌────────────────────────────────────┐  │
│  │  PostgreSQL Service                │  │
│  │  ├─ Image: postgres:15             │  │
│  │  ├─ Port: 5432:5432                │  │
│  │  ├─ Env: POSTGRES_*                │  │
│  │  └─ Volume: postgres_data          │  │
│  └────────────────────────────────────┘  │
│           ▼                                 │
│  ┌────────────────────────────────────┐  │
│  │  Persistent Volume                 │  │
│  │  (Database data)                   │  │
│  └────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

---

## Performance Considerations

```
Optimization Layer          Strategy
─────────────────────────────────────────────────
Frontend
  - Code splitting           Dynamic imports
  - Image optimization       Next.js Image
  - Bundle size              Tree shaking
  - Caching                  Service worker

Backend
  - Query optimization       Parameterized SQL
  - Connection pooling       pg connection pool
  - Caching                  In-memory cache
  - Pagination               Limit/offset

Database
  - Indexing                 B-tree indexes
  - Query analysis           EXPLAIN ANALYZE
  - Connection limits        Pool management
  - Backup strategy          Daily backups

Network
  - Compression              gzip
  - Caching headers          Cache-Control
  - CDN                      Static assets
  - Load balancing           Multiple instances
```

---

## Scalability Path

```
Current Architecture (Single Server)
  │
  └─ Horizontal Scaling
       │
       ├─ Multiple Backend Instances
       │  └─ Load Balancer (nginx)
       │
       ├─ Multiple Frontend Instances
       │  └─ CDN (CloudFlare, AWS)
       │
       ├─ Database Replication
       │  ├─ Read Replicas
       │  └─ Write Master
       │
       └─ Caching Layer
          └─ Redis Cache

Result: High Availability & Performance
```

---

**Document Version**: 1.0  
**Last Updated**: February 1, 2026  
**Architecture Type**: Monolithic → Microservices Ready
