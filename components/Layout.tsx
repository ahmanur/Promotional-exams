import React from 'react';
// FIX: Changed react-router-dom import to a namespace import to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { HomeIcon, BookOpenIcon, UsersIcon, QuestionMarkCircleIcon, UserCircleIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, ClipboardDocumentCheckIcon, DocumentTextIcon } from './icons/Icons';
import TakeExamModal from './TakeExamModal';
import DocumentLibraryModal from './DocumentLibraryModal';
import ThemeToggle from './ThemeToggle';

interface NavItemProps {
    to?: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, onClick }) => {
    const commonClasses = "flex items-center p-3 my-1 rounded-lg transition-colors w-full text-left";
    
    if (to) {
        return (
            <ReactRouterDOM.NavLink
                to={to}
                onClick={onClick}
                className={({ isActive }) =>
                    `${commonClasses} ${
                    isActive
                        ? 'bg-cbn-gold text-cbn-green font-bold'
                        : 'text-white hover:bg-cbn-green/50'
                    }`
                }
            >
                {icon}
                <span className="ml-4">{label}</span>
            </ReactRouterDOM.NavLink>
        );
    }

    return (
         <button
            onClick={onClick}
            className={`${commonClasses} text-white hover:bg-cbn-green/50`}
        >
            {icon}
            <span className="ml-4">{label}</span>
        </button>
    );
};

const Sidebar: React.FC<{onLinkClick: () => void; openExamModal: () => void; openDocModal: () => void;}> = ({onLinkClick, openExamModal, openDocModal}) => {
    const { user } = useAuth();
    
    const handleTakeExamClick = () => {
        openExamModal();
        onLinkClick(); // Close sidebar on mobile after clicking
    };

    const handleDocModalClick = () => {
        openDocModal();
        onLinkClick(); // Close sidebar on mobile
    };

    return (
        <nav className="flex-1 px-4 py-6">
            <NavItem to="/dashboard" icon={<HomeIcon />} label="Dashboard" onClick={onLinkClick} />
            <NavItem to="/documents" icon={<BookOpenIcon />} label="CBN Departments" onClick={onLinkClick} />
            <NavItem icon={<DocumentTextIcon />} label="Document Library" onClick={handleDocModalClick} />
            <NavItem icon={<ClipboardDocumentCheckIcon />} label="Take Exam" onClick={handleTakeExamClick} />
            {user?.role === Role.STAFF && (
                <NavItem to="/profile" icon={<UserCircleIcon />} label="My Progress" onClick={onLinkClick} />
            )}
            {user?.role === Role.ADMIN && (
                <>
                    <div className="mt-6 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Tools</div>
                    <NavItem to="/admin/users" icon={<UsersIcon />} label="User Management" onClick={onLinkClick} />
                    <NavItem to="/admin/questions" icon={<QuestionMarkCircleIcon />} label="Question Bank" onClick={onLinkClick} />
                </>
            )}
        </nav>
    );
};

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const navigate = ReactRouterDOM.useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center z-20 border-b border-transparent dark:border-gray-700">
            <div className="flex items-center">
                 <button onClick={onMenuClick} className="lg:hidden mr-4 text-cbn-green dark:text-cbn-gold">
                    <Bars3Icon />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-cbn-green dark:text-white">CBN Promotion Exam Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
                <ThemeToggle />
                <span className="hidden sm:block text-gray-600 dark:text-gray-300">Welcome, {user?.name}</span>
                <button
                    onClick={handleLogout}
                    className="flex items-center text-red-600 hover:text-red-800 dark:hover:text-red-500 transition-colors"
                >
                    <ArrowLeftOnRectangleIcon />
                    <span className="ml-2 font-semibold">Logout</span>
                </button>
            </div>
        </header>
    );
};


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [isExamModalOpen, setIsExamModalOpen] = React.useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = React.useState(false);

    return (
        <>
            <div className="flex h-screen bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                {/* Overlay for mobile */}
                 <div 
                    className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
                    onClick={() => setSidebarOpen(false)}
                ></div>

                {/* Sidebar */}
                <aside className={`fixed lg:relative inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64 bg-cbn-green flex flex-col transition-transform duration-300 ease-in-out z-40`}>
                     <div className="p-5 border-b border-white/20 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-cbn-gold">Menu</h2>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
                            <XMarkIcon />
                        </button>
                    </div>
                    <Sidebar 
                        onLinkClick={() => setSidebarOpen(false)} 
                        openExamModal={() => setIsExamModalOpen(true)}
                        openDocModal={() => setIsDocModalOpen(true)}
                    />
                </aside>
                
                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
            <TakeExamModal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} />
            <DocumentLibraryModal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} />
        </>
    );
};

export default Layout;