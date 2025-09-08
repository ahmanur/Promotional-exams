import React from 'react';
// FIX: Changed react-router-dom import to a namespace import to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { mockDirectorates } from '../services/mockData';
import { BookOpenIcon } from '../components/icons/Icons';

const DocumentLibrary: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">CBN Departments</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Select a department to view its study materials and documents.</p>
      
      <div className="space-y-10">
        {mockDirectorates.map(directorate => (
          <div key={directorate.name}>
            <h2 className="text-2xl font-bold text-cbn-green dark:text-cbn-gold mb-4 pb-2 border-b-2 border-cbn-gold">{directorate.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {directorate.departments.map(dept => (
                <ReactRouterDOM.Link 
                  key={dept.id} 
                  to={`/documents/${dept.id}`}
                  className="group block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start">
                      <div className="flex-shrink-0 p-3 bg-cbn-green text-white rounded-full">
                          <BookOpenIcon />
                      </div>
                      <div className="ml-4">
                          <h3 className="text-xl font-bold text-cbn-green dark:text-cbn-gold group-hover:text-cbn-gold dark:group-hover:text-cbn-gold transition-colors">{dept.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">{dept.description}</p>
                      </div>
                  </div>
                </ReactRouterDOM.Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentLibrary;