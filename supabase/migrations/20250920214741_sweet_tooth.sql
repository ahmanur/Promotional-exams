/*
  # Initial Schema for CBN Promotion Exam Hub

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `role` (enum: Admin, Staff)
      - `department` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `departments`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `directorate` (text)
      - `created_at` (timestamp)
    
    - `documents`
      - `id` (uuid, primary key)
      - `title` (text)
      - `department_id` (uuid, foreign key)
      - `type` (enum: PDF, DOCX, PPTX, PNG, JPG)
      - `year` (integer)
      - `uploaded_at` (timestamp)
      - `uploaded_by` (uuid, foreign key)
    
    - `questions`
      - `id` (uuid, primary key)
      - `department_id` (uuid, foreign key)
      - `topic` (text)
      - `question_text` (text)
      - `options` (text array)
      - `correct_answer` (text)
      - `explanation` (text, nullable)
      - `created_at` (timestamp)
      - `created_by` (uuid, foreign key)
    
    - `exam_attempts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `department_id` (uuid, foreign key)
      - `score` (integer)
      - `total_questions` (integer)
      - `answers` (jsonb)
      - `completed_at` (timestamp)
    
    - `discussion_groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `group_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `content` (text)
      - `attachment` (jsonb, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add admin policies for user management
*/

-- Create enums
CREATE TYPE user_role AS ENUM ('Admin', 'Staff');
CREATE TYPE document_type AS ENUM ('PDF', 'DOCX', 'PPTX', 'PNG', 'JPG');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'Staff',
  department text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  directorate text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  year integer NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  topic text NOT NULL DEFAULT '',
  question_text text NOT NULL,
  options text[] NOT NULL,
  correct_answer text NOT NULL,
  explanation text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL
);

-- Create exam_attempts table
CREATE TABLE IF NOT EXISTS exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 0,
  answers jsonb NOT NULL DEFAULT '{}',
  completed_at timestamptz DEFAULT now()
);

-- Create discussion_groups table
CREATE TABLE IF NOT EXISTS discussion_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES discussion_groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  attachment jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE TO authenticated USING (auth.uid()::text = id::text);
CREATE POLICY "Admins can manage all users" ON users FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'Admin')
);

-- Departments policies
CREATE POLICY "Anyone can read departments" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage departments" ON departments FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'Admin')
);

-- Documents policies
CREATE POLICY "Anyone can read documents" ON documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage documents" ON documents FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'Admin')
);

-- Questions policies
CREATE POLICY "Anyone can read questions" ON questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage questions" ON questions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'Admin')
);

-- Exam attempts policies
CREATE POLICY "Users can read their own exam attempts" ON exam_attempts FOR SELECT TO authenticated USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create their own exam attempts" ON exam_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Admins can read all exam attempts" ON exam_attempts FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'Admin')
);

-- Discussion groups policies
CREATE POLICY "Anyone can read discussion groups" ON discussion_groups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage discussion groups" ON discussion_groups FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'Admin')
);

-- Messages policies
CREATE POLICY "Anyone can read messages" ON messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create messages" ON messages FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own messages" ON messages FOR UPDATE TO authenticated USING (auth.uid()::text = user_id::text);
CREATE POLICY "Admins can manage all messages" ON messages FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'Admin')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_documents_department ON documents(department_id);
CREATE INDEX IF NOT EXISTS idx_questions_department ON questions(department_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user ON exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_department ON exam_attempts(department_id);
CREATE INDEX IF NOT EXISTS idx_messages_group ON messages(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();