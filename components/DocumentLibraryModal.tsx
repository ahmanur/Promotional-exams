import React, { useState, useMemo } from 'react';
import { mockDocuments, mockDepartments } from '../services/mockData';
import { Document, DocumentType } from '../types';
import { XMarkIcon, MagnifyingGlassIcon, DocumentArrowDownIcon, DocumentDuplicateIcon } from './icons/Icons';

const departmentMap = new Map(mockDepartments.map(dept => [dept.id, dept.name]));

const getFileTypeIcon = (type: DocumentType) => {
    switch (type) {
        case DocumentType.PDF: return <span className="text-red-500 font-bold text-xs">PDF</span>;
        case DocumentType.DOCX: return <span className="text-blue-500 font-bold text-xs">DOCX</span>;
        case DocumentType.PPTX: return <span className="text-orange-500 font-bold text-xs">PPTX</span>;
        case DocumentType.PNG:
        case DocumentType.JPG: return <span className="text-purple-500 font-bold text-xs">IMG</span>;
        default: return <DocumentDuplicateIcon className="h-5 w-5" />;
    }
};


interface DocumentLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentLibraryModal: React.FC<DocumentLibraryModalProps> = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<DocumentType | 'All'>('All');

    const filteredDocuments = useMemo(() => {
        return mockDocuments
            .filter(doc =>
                searchTerm === '' ||
                doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                departmentMap.get(doc.departmentId)?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(doc => filterType === 'All' || doc.type === filterType);
    }, [searchTerm, filterType]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scale-in 0.2s ease-out forwards' }}
      >
        <header className="flex justify-between items-center p-5 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-xl z-10">
          <h2 className="text-2xl font-bold text-cbn-green dark:text-cbn-gold">Document Library</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XMarkIcon />
          </button>
        </header>

        <div className="p-5 border-b dark:border-gray-700">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="md:col-span-2 relative">
                     <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cbn-green dark:bg-gray-700 dark:border-gray-600"
                        aria-label="Search documents"
                    />
                </div>
                 <div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as DocumentType | 'All')}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cbn-green h-full dark:bg-gray-700 dark:border-gray-600"
                        aria-label="Filter by document type"
                    >
                        <option value="All">All Types</option>
                        {Object.values(DocumentType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        <main className="p-5 overflow-y-auto flex-1">
          {filteredDocuments.length > 0 ? (
            <ul className="space-y-3">
              {filteredDocuments.map(doc => (
                <li key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 truncate" title={doc.title}>{doc.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{departmentMap.get(doc.departmentId) || 'Unknown Department'}</p>
                  </div>
                  <div className="flex items-center space-x-4 ml-4">
                    {getFileTypeIcon(doc.type)}
                    <button className="text-green-600 hover:text-green-800 p-1" title="Download">
                      <DocumentArrowDownIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">No documents found for your search.</p>
            </div>
          )}
        </main>
        
         <footer className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl flex justify-end items-center gap-4">
          <button
            onClick={onClose}
            className="py-2 px-5 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Close
          </button>
        </footer>

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

export default DocumentLibraryModal;