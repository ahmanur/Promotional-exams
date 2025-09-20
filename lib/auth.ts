import { supabase } from './supabase'
import { User } from '../types'

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw error
  }
  
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Get user profile from our users table
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (error || !profile) {
    console.error('Error fetching user profile:', error)
    return null
  }
  
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    department: profile.department,
  }
}

export const createUserProfile = async (user: any, additionalData: { name: string; department: string; role?: 'Admin' | 'Staff' }) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: user.id,
      email: user.email,
      name: additionalData.name,
      department: additionalData.department,
      role: additionalData.role || 'Staff',
    })
    .select()
    .single()
  
  if (error) {
    throw error
  }
  
  return data
}