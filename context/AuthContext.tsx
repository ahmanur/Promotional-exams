
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { mockUsers } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'cbnExamHubUser';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Error reading user from localStorage", error);
    }
    return null;
  });

  const login = (email: string, password: string): boolean => {
    // In a real app, this would involve an API call with password hashing.
    // Here, we find a user by email and check against a default password.
    const userToLogin = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userToLogin && password === 'Password@123') {
      setUser(userToLogin);
      try {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToLogin));
      } catch (error) {
          console.error("Error saving user to localStorage", error);
      }
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    try {
        window.localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
        console.error("Error removing user from localStorage", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
