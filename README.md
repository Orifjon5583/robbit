# Educational Platform (Robbit)

A comprehensive educational platform with Role-Based Access Control (RBAC) for Super Admins, Teachers, and Students. Features include Group Management, Task Creation (Quiz & Blockly), Assignments, and Analytics.

## Features

-   **Super Admin**: Manage Teachers, Groups, and Students. Global Analytics.
-   **Teacher**: Group Journal, Task Creator (Quiz/Block Test), Assignment Manager, Class Analytics.
-   **Student**: Dashboard, Assignment View, Task Execution (Quiz/Blockly), Progress Tracking.

## Prerequisites

-   Node.js (v14+)
-   PostgreSQL (v12+)

## Installation & Setup

### 1. Database Setup

Ensure PostgreSQL is running. Create a database named `robbit` (or update `.env` in backend).

```bash
cd backend
# Create .env file with your DB credentials (see .env.example if available, otherwise defaults usually work for local dev)
# Example .env content:
# DB_USER=postgres
# DB_PASSWORD=password
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=robbit
# JWT_SECRET=your_jwt_secret

# Initialize Database Tables
npm run init-db

# Seed Database with Demo Data
npm run seed
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server will run on `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Client will run on `http://localhost:3001` (or 3000 if backend is on a different port, Next.js usually auto-detects).

## Login Credentials (Demo)

The seeding script creates the following default users:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin` | `admin123` |
| **Teacher** | `teacher1` | `teacher123` |
| **Student** | `student1` | `student123` |
| **Student** | `student2` | `student123` |

## Project Structure

-   `backend/`: Fastify server, API routes, PostgreSQL models.
-   `frontend/`: Next.js React application.
