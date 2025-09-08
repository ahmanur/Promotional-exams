
export enum Role {
  ADMIN = 'Admin',
  STAFF = 'Staff',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

export enum DocumentType {
    PDF = 'PDF',
    DOCX = 'DOCX',
    PPTX = 'PPTX',
    PNG = 'PNG',
    JPG = 'JPG',
}

export interface Document {
  id: string;
  title: string;
  departmentId: string;
  type: DocumentType;
  year: number;
  uploadedAt: string;
}

export interface Question {
  id: string;
  departmentId: string;
  topic: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface ExamAttempt {
    id: string;
    userId: string;
    departmentId: string;
    score: number;
    totalQuestions: number;
    date: string;
}

export interface ExamResult {
  score: number;
  totalQuestions: number;
  answers: { [questionId: string]: string };
  questions: Question[];
}
