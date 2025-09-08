import React, { useState } from 'react';
import { mockUsers } from '../../services/mockData';
import { User } from '../../types';
import { PencilIcon, TrashIcon, UserPlusIcon, XMarkIcon } from '../../components/icons/Icons';

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scale-in 0.2s ease-out forwards' }}
      >
        <div className="flex justify-between items-center p-5 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XMarkIcon />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        </div>
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl flex justify-end items-center gap-4">
          <button
            onClick={onClose}
            className="py-2 px-5 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="py-2 px-5 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
       <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
      ` }} />
    </div>
  );
};


const UserManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      // In a real app, an API call would be made here.
      alert(`User "${userToDelete.name}" deleted successfully.`);
      // You would then refetch users or remove the user from local state.
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">User Management</h1>
          <button className="flex items-center bg-cbn-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">
              <UserPlusIcon />
              <span className="ml-2">Add User</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(user => (
                <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{user.name}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin' ? 'bg-cbn-gold text-cbn-green' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{user.department}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <button className="text-yellow-600 hover:text-yellow-800 p-1" title="Edit"><PencilIcon /></button>
                      <button onClick={() => handleDeleteClick(user)} className="text-red-600 hover:text-red-800 p-1" title="Delete"><TrashIcon /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete the user "${userToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  );
};

export default UserManagement;