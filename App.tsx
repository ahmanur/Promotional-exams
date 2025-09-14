import React from 'react';
// FIX: Reverted to named imports for react-router-dom to resolve component and hook resolution errors.
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentLibrary from './pages/DocumentLibrary';
import DepartmentDocs from './pages/DepartmentDocs';
import ExamPortal from './pages/ExamPortal';
import ExamResults from './pages/ExamResults';
import UserManagement from './pages/admin/UserManagement';
import QuestionManagement from './pages/admin/QuestionManagement';
import ProfileDashboard from './pages/staff/ProfileDashboard';
import Layout from './components/Layout';
import { Role } from './types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (roles && !roles.includes(user.role)) {
     return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={ user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            
            <Route path="/*" element={
                <ProtectedRoute>
                    <Layout>
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/documents" element={<DocumentLibrary />} />
                            <Route path="/documents/:deptId" element={<DepartmentDocs />} />
                            <Route path="/exam/:deptId" element={<ExamPortal />} />
                            <Route path="/results" element={<ExamResults />} />
                            
                            {/* Staff Routes */}
                            <Route path="/profile" element={<ProtectedRoute roles={[Role.STAFF]}><ProfileDashboard /></ProtectedRoute>} />
                            
                            {/* Admin Routes */}
                            <Route path="/admin/users" element={<ProtectedRoute roles={[Role.ADMIN]}><UserManagement /></ProtectedRoute>} />
                            <Route path="/admin/questions" element={<ProtectedRoute roles={[Role.ADMIN]}><QuestionManagement /></ProtectedRoute>} />
                            
                            <Route path="*" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </Layout>
                </ProtectedRoute>
            } />
        </Routes>
    );
};


export default App;