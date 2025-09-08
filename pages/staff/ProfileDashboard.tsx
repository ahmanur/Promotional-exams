import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockExamHistory, mockDepartments } from '../../services/mockData';
// FIX: Changed recharts import to a namespace import to fix module resolution issues.
import * as Recharts from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const ProfileDashboard: React.FC = () => {
    const { user } = useAuth();
    const { theme } = useTheme();

    if (!user) return null;

    const userHistory = mockExamHistory.filter(h => h.userId === user.id);
    const departmentScores: { [key: string]: { totalScore: number, attempts: number, totalPossible: number } } = {};

    userHistory.forEach(attempt => {
        if (!departmentScores[attempt.departmentId]) {
            departmentScores[attempt.departmentId] = { totalScore: 0, attempts: 0, totalPossible: 0 };
        }
        departmentScores[attempt.departmentId].totalScore += attempt.score;
        departmentScores[attempt.departmentId].totalPossible += attempt.totalQuestions;
        departmentScores[attempt.departmentId].attempts++;
    });

    const chartData = Object.keys(departmentScores).map(deptId => {
        const dept = mockDepartments.find(d => d.id === deptId);
        const { totalScore, totalPossible } = departmentScores[deptId];
        const average = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;
        return {
            name: dept?.name || 'Unknown',
            'Average Score (%)': parseFloat(average.toFixed(2)),
        };
    });
    
    // Suggest weak areas - departments with avg score < 50%
    const weakAreas = chartData.filter(d => d['Average Score (%)'] < 50).map(d => d.name);
    const chartTextColor = theme === 'dark' ? '#a0a0a0' : '#666';

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">My Progress Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Average Performance by Department</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <Recharts.ResponsiveContainer>
                            <Recharts.BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <Recharts.CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4a5568' : '#e2e8f0'} />
                                <Recharts.XAxis dataKey="name" tick={{ fill: chartTextColor }} />
                                <Recharts.YAxis unit="%" tick={{ fill: chartTextColor }} />
                                <Recharts.Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff', 
                                        border: `1px solid ${theme === 'dark' ? '#4a5568' : '#e2e8f0'}`
                                    }} 
                                    labelStyle={{ color: theme === 'dark' ? '#f7fafc' : '#1a202c' }}
                                />
                                <Recharts.Legend wrapperStyle={{ color: chartTextColor }}/>
                                <Recharts.Bar dataKey="Average Score (%)" fill={theme === 'dark' ? '#D4AF37' : '#005432'} />
                            </Recharts.BarChart>
                        </Recharts.ResponsiveContainer>
                    </div>
                </div>

                {/* Stats & Suggestions */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Summary</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Total Exams Taken</span>
                            <span className="font-bold text-cbn-green dark:text-cbn-gold text-2xl">{userHistory.length}</span>
                        </div>
                         {weakAreas.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-2">Areas for Improvement</h3>
                                <ul className="list-disc list-inside text-red-600 dark:text-red-400">
                                    {weakAreas.map(area => <li key={area}>{area}</li>)}
                                </ul>
                            </div>
                        )}
                        {weakAreas.length === 0 && userHistory.length > 0 && (
                             <p className="text-green-600 dark:text-green-400 font-semibold mt-4">Great job! You are performing well in all attempted subjects.</p>
                        )}
                    </div>
                </div>
            </div>

             {/* Recent Attempts */}
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Recent Exam History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Department</th>
                                <th className="p-4 font-semibold">Score</th>
                                <th className="p-4 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userHistory.slice().reverse().slice(0, 5).map(attempt => (
                                <tr key={attempt.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-4 font-medium dark:text-gray-300">{mockDepartments.find(d => d.id === attempt.departmentId)?.name}</td>
                                    <td className="p-4 font-semibold text-cbn-green dark:text-cbn-gold">{attempt.score} / {attempt.totalQuestions}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{attempt.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProfileDashboard;