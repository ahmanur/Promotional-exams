import React, { useState } from 'react';
// FIX: Reverted to named imports for react-router-dom to resolve hook resolution errors.
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const loggedIn = login(email, password);
    if (loggedIn) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cbn-green dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
        <div className="text-center">
            <img src="/cbn-exam-hub-logo.png" alt="CBN Exam Hub Logo" className="w-32 h-32 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-cbn-green dark:text-cbn-gold">Promotion Exam Hub</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Please sign in to continue</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
                <div>
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <input 
                        id="email-address" 
                        name="email" 
                        type="email" 
                        autoComplete="email" 
                        required 
                        className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-cbn-green focus:border-cbn-green focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                        placeholder="Email address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input 
                        id="password" 
                        name="password" 
                        type="password" 
                        autoComplete="current-password" 
                        required 
                        className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-cbn-green focus:border-cbn-green focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            
            {error && <p className="text-sm text-center text-red-600">{error}</p>}

            <div>
                 <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-md text-white bg-cbn-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cbn-green transition-transform transform hover:scale-105"
                >
                    Login
                </button>
            </div>
        </form>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Use your official email and the default password: <span className="font-mono bg-gray-200 dark:bg-gray-600 dark:text-gray-200 p-1 rounded">Password@123</span>
        </p>
      </div>
    </div>
  );
};

export default Login;