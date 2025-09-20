import { supabase } from './supabase'
import { Question, Document, ExamAttempt, Message, Department } from '../types'

// Departments
export const getDepartments = async (): Promise<Department[]> => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name')
  
  if (error) throw error
  
  return data.map(dept => ({
    id: dept.id,
    name: dept.name,
    description: dept.description,
  }))
}

// Questions
export const getQuestions = async (departmentId?: string): Promise<Question[]> => {
  let query = supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (departmentId && departmentId !== 'general') {
    query = query.eq('department_id', departmentId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  return data.map(q => ({
    id: q.id,
    departmentId: q.department_id,
    topic: q.topic,
    questionText: q.question_text,
    options: q.options,
    correctAnswer: q.correct_answer,
    explanation: q.explanation,
  }))
}

export const createQuestion = async (question: Omit<Question, 'id'> & { createdBy: string }) => {
  const { data, error } = await supabase
    .from('questions')
    .insert({
      department_id: question.departmentId,
      topic: question.topic,
      question_text: question.questionText,
      options: question.options,
      correct_answer: question.correctAnswer,
      explanation: question.explanation,
      created_by: question.createdBy,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Documents
export const getDocuments = async (departmentId?: string): Promise<Document[]> => {
  let query = supabase
    .from('documents')
    .select('*')
    .order('uploaded_at', { ascending: false })
  
  if (departmentId) {
    query = query.eq('department_id', departmentId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  return data.map(doc => ({
    id: doc.id,
    title: doc.title,
    departmentId: doc.department_id,
    type: doc.type as any,
    year: doc.year,
    uploadedAt: new Date(doc.uploaded_at).toLocaleDateString(),
  }))
}

// Exam Attempts
export const saveExamAttempt = async (attempt: {
  userId: string
  departmentId: string
  score: number
  totalQuestions: number
  answers: Record<string, string>
}) => {
  const { data, error } = await supabase
    .from('exam_attempts')
    .insert({
      user_id: attempt.userId,
      department_id: attempt.departmentId,
      score: attempt.score,
      total_questions: attempt.totalQuestions,
      answers: attempt.answers,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getUserExamHistory = async (userId: string): Promise<ExamAttempt[]> => {
  const { data, error } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
  
  if (error) throw error
  
  return data.map(attempt => ({
    id: attempt.id,
    userId: attempt.user_id,
    departmentId: attempt.department_id,
    score: attempt.score,
    totalQuestions: attempt.total_questions,
    date: new Date(attempt.completed_at).toLocaleDateString(),
  }))
}

// Messages
export const getMessages = async (groupId?: string): Promise<Message[]> => {
  let query = supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (groupId) {
    query = query.eq('group_id', groupId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  return data.map(msg => ({
    id: msg.id,
    groupId: msg.group_id,
    userId: msg.user_id,
    content: msg.content,
    timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    attachment: msg.attachment as any,
  }))
}

export const sendMessage = async (message: {
  groupId: string
  userId: string
  content: string
  attachment?: any
}) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      group_id: message.groupId,
      user_id: message.userId,
      content: message.content,
      attachment: message.attachment,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Discussion Groups
export const getDiscussionGroups = async () => {
  const { data, error } = await supabase
    .from('discussion_groups')
    .select('*')
    .order('name')
  
  if (error) throw error
  
  return data.map(group => ({
    id: group.id,
    name: group.name,
  }))
}