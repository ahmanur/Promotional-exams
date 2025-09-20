export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'Admin' | 'Staff'
          department: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: 'Admin' | 'Staff'
          department: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'Admin' | 'Staff'
          department?: string
          created_at?: string
          updated_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          description: string
          directorate: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          directorate: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          directorate?: string
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          department_id: string
          type: 'PDF' | 'DOCX' | 'PPTX' | 'PNG' | 'JPG'
          year: number
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          id?: string
          title: string
          department_id: string
          type: 'PDF' | 'DOCX' | 'PPTX' | 'PNG' | 'JPG'
          year: number
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          id?: string
          title?: string
          department_id?: string
          type?: 'PDF' | 'DOCX' | 'PPTX' | 'PNG' | 'JPG'
          year?: number
          uploaded_at?: string
          uploaded_by?: string
        }
      }
      questions: {
        Row: {
          id: string
          department_id: string
          topic: string
          question_text: string
          options: string[]
          correct_answer: string
          explanation: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          department_id: string
          topic: string
          question_text: string
          options: string[]
          correct_answer: string
          explanation?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          department_id?: string
          topic?: string
          question_text?: string
          options?: string[]
          correct_answer?: string
          explanation?: string | null
          created_at?: string
          created_by?: string
        }
      }
      exam_attempts: {
        Row: {
          id: string
          user_id: string
          department_id: string
          score: number
          total_questions: number
          answers: Json
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          department_id: string
          score: number
          total_questions: number
          answers: Json
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          department_id?: string
          score?: number
          total_questions?: number
          answers?: Json
          completed_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          group_id: string
          user_id: string
          content: string
          attachment: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          content: string
          attachment?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          content?: string
          attachment?: Json | null
          created_at?: string
        }
      }
      discussion_groups: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'Admin' | 'Staff'
      document_type: 'PDF' | 'DOCX' | 'PPTX' | 'PNG' | 'JPG'
    }
  }
}