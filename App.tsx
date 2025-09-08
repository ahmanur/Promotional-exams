import React from 'react';
// FIX: Changed react-router-dom import to a namespace import to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
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
    return <ReactRouterDOM.Navigate to="/login" replace />;
  }
  
  if (roles && !roles.includes(user.role)) {
     return <ReactRouterDOM.Navigate to="/" replace />;
  }

  return <>{children}</>;
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ReactRouterDOM.HashRouter>
          <AppRoutes />
        </ReactRouterDOM.HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return (
        <ReactRouterDOM.Routes>
            <ReactRouterDOM.Route path="/login" element={<Login />} />
            <ReactRouterDOM.Route path="/" element={ user ? <ReactRouterDOM.Navigate to="/dashboard" /> : <ReactRouterDOM.Navigate to="/login" />} />
            
            <ReactRouterDOM.Route path="/*" element={
                <ProtectedRoute>
                    <Layout>
                        <ReactRouterDOM.Routes>
                            <ReactRouterDOM.Route path="/dashboard" element={<Dashboard />} />
                            <ReactRouterDOM.Route path="/documents" element={<DocumentLibrary />} />
                            <ReactRouterDOM.Route path="/documents/:deptId" element={<DepartmentDocs />} />
                            <ReactRouterDOM.Route path="/exam/:deptId" element={<ExamPortal />} />
                            <ReactRouterDOM.Route path="/results" element={<ExamResults />} />
                            
                            {/* Staff Routes */}
                            <ReactRouterDOM.Route path="/profile" element={<ProtectedRoute roles={[Role.STAFF]}><ProfileDashboard /></ProtectedRoute>} />
                            
                            {/* Admin Routes */}
                            <ReactRouterDOM.Route path="/admin/users" element={<ProtectedRoute roles={[Role.ADMIN]}><UserManagement /></ProtectedRoute>} />
                            <ReactRouterDOM.Route path="/admin/questions" element={<ProtectedRoute roles={[Role.ADMIN]}><QuestionManagement /></ProtectedRoute>} />
                            
                            <ReactRouterDOM.Route path="*" element={<ReactRouterDOM.Navigate to="/dashboard" />} />
                        </ReactRouterDOM.Routes>
                    </Layout>
                </ProtectedRoute>
            } />
        </ReactRouterDOM.Routes>
    );
};


export default App;