-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'teacher', 'student')),
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups (Classes)
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    teacher_id INT REFERENCES users(id), -- Assigned teacher
    created_by INT REFERENCES users(id), -- Super Admin who created it
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students in Groups
CREATE TABLE students_groups (
    student_id INT REFERENCES users(id),
    group_id INT REFERENCES groups(id),
    PRIMARY KEY (student_id, group_id)
);

-- Tasks (Challenges/Quizzes)
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('quiz', 'block_test')),
    
    -- Content stores the actual questions or block configuration
    -- Quiz: [{ question: "...", options: ["A", "B"], correct: "A" }]
    -- Block: { toolbox: [...], startBlocks: ... }
    content JSONB NOT NULL DEFAULT '{}', 
    
    -- Analytics tags
    topic_tag VARCHAR(50), -- e.g. "Math", "History" (for Quizzes)
    skill_tag VARCHAR(50), -- e.g. "loop", "condition" (for Block tests)
    
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assignments (Task assigned to a student)
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    task_id INT REFERENCES tasks(id),
    student_id INT REFERENCES users(id),
    
    status VARCHAR(20) NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'completed', 'not_completed')),
    score INT DEFAULT 0, -- 0-100 or points
    
    -- Stores the student's answer or code
    submission_data JSONB,
    
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
