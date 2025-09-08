import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
// FIX: Changed react-router-dom import to a namespace import to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { mockDepartments, mockUsers, mockDocuments, mockQuestions } from '../services/mockData';
import { ChartBarIcon, DocumentTextIcon, UsersIcon, QuestionMarkCircleIcon } from '../components/icons/Icons';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center justify-between border-l-4 ${color}`}>
        <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">{title}</div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</div>
        </div>
        <div className="text-gray-400 dark:text-gray-500">
            {icon}
        </div>
    </div>
);


const AdminDashboard: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={mockUsers.length} icon={<UsersIcon className="h-8 w-8" />} color="border-blue-500" />
                <StatCard title="Total Documents" value={mockDocuments.length} icon={<DocumentTextIcon className="h-8 w-8" />} color="border-green-500" />
                <StatCard title="Total Questions" value={mockQuestions.length} icon={<QuestionMarkCircleIcon className="h-8 w-8" />} color="border-yellow-500" />
                <StatCard title="Departments" value={mockDepartments.length} icon={<ChartBarIcon className="h-8 w-8" />} color="border-purple-500" />
            </div>
            <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                    <ReactRouterDOM.Link to="/admin/users" className="bg-cbn-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">Manage Users</ReactRouterDOM.Link>
                    <ReactRouterDOM.Link to="/admin/questions" className="bg-cbn-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">Manage Questions</ReactRouterDOM.Link>
                    <ReactRouterDOM.Link to="/documents" className="bg-cbn-gold text-cbn-green font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">View CBN Departments</ReactRouterDOM.Link>
                </div>
            </div>
        </div>
    );
};

const StaffDashboard: React.FC = () => {
    const { user } = useAuth();
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Welcome, {user?.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Your central hub for promotion exam preparation. Good luck!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-cbn-green dark:text-cbn-gold mb-4">Start a Practice Exam</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Select a department to begin a practice test and gauge your knowledge.</p>
                    <div className="flex flex-col space-y-2">
                        {mockDepartments.slice(0, 3).map(dept => (
                            <ReactRouterDOM.Link key={dept.id} to={`/exam/${dept.id}`} className="block text-center bg-cbn-green text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition">
                                {dept.name} Exam
                            </ReactRouterDOM.Link>
                        ))}
                         <ReactRouterDOM.Link to="/documents" className="block text-center bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                            More Departments...
                        </ReactRouterDOM.Link>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-cbn-green dark:text-cbn-gold mb-4">Explore Study Materials</h3>
                     <p className="text-gray-600 dark:text-gray-400 mb-4">Access official documents and materials uploaded for each department.</p>
                    <ReactRouterDOM.Link to="/documents" className="block w-full text-center bg-cbn-gold text-cbn-green font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition">
                        Browse CBN Departments
                    </ReactRouterDOM.Link>

                    <h3 className="text-xl font-bold text-cbn-green dark:text-cbn-gold mt-8 mb-4">Track Your Progress</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Review your past exam performance and identify areas for improvement.</p>
                     <ReactRouterDOM.Link to="/profile" className="block w-full text-center bg-cbn-gold text-cbn-green font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition">
                        View My Progress
                    </ReactRouterDOM.Link>
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return user.role === Role.ADMIN ? <AdminDashboard /> : <StaffDashboard />;
};

export default Dashboard;