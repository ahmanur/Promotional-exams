import React, { useState, useEffect } from 'react';
import { Document } from '../types';
import { documentContent } from '../services/documentContent';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';

interface DocumentViewerProps {
  document: Document | null;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Reset to the first page whenever a new document is opened
    setCurrentPage(0);
  }, [document]);

  if (!document) return null;

  const content = documentContent[document.id] || 
`This is a placeholder for the document "${document.title}".

In a real application, the content of the PDF, DOCX, or PPTX file would be rendered here for reading.`;

  const pages = Array.isArray(content) ? content : [content];
  const totalPages = pages.length;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderContent = (text: string) => {
    if (!text) return <p className="text-gray-500">Page is empty.</p>;
    const lines = text.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: { type: 'ul' | 'ol', items: string[] } | null = null;
    let isFirstHeading = true;

    const flushList = () => {
        if (currentList) {
            const ListTag = currentList.type;
            const listClass = ListTag === 'ul' 
                ? "list-disc list-inside space-y-2 my-4 pl-4" 
                : "list-decimal list-inside space-y-2 my-4 pl-4";
            
            elements.push(
                <ListTag key={`list-${elements.length}`} className={listClass}>
                    {currentList.items.map((item, index) => <li key={index}>{item.replace(/•/g, '').trim()}</li>)}
                </ListTag>
            );
            currentList = null;
        }
    };

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        const isUnorderedItem = trimmedLine.startsWith('- ') || trimmedLine.startsWith('■') || trimmedLine.startsWith('•');
        const isOrderedItem = /^\d+\.\s/.test(trimmedLine);

        if (isUnorderedItem || isOrderedItem) {
            const listType = isOrderedItem ? 'ol' : 'ul';
            const itemText = trimmedLine.replace(/^-\s*|^■\s*|^•\s*|^\d+\.\s*/, '');

            if (!currentList || currentList.type !== listType) {
                flushList();
                currentList = { type: listType, items: [] };
            }
            currentList.items.push(itemText);
        } else {
            flushList();
            
            if (trimmedLine.match(/^-{10,}$/)) {
                elements.push(<hr key={`hr-${index}`} className="my-6 border-gray-300 dark:border-gray-600" />);
            } else if (trimmedLine.length > 0) {
                 if (isFirstHeading && totalPages > 1) {
                     elements.push(<h1 key={index} className="text-3xl font-bold text-cbn-green dark:text-cbn-gold mb-4">{trimmedLine}</h1>);
                     isFirstHeading = false;
                 } else if (trimmedLine.length < 70 && !trimmedLine.endsWith('.') && !trimmedLine.endsWith(':') && trimmedLine === trimmedLine.toUpperCase()) {
                     elements.push(<h2 key={index} className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4 border-b pb-2 border-gray-300 dark:border-gray-600">{trimmedLine}</h2>);
                 } else {
                     elements.push(<p key={index} className="leading-relaxed my-4">{trimmedLine}</p>);
                 }
            }
        }
    });

    flushList();
    return elements;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scale-in 0.2s ease-out forwards' }}
      >
        <header className="flex justify-between items-center p-5 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-xl z-10">
          <h2 className="text-xl font-bold text-cbn-green dark:text-cbn-gold truncate pr-4">{document.title}</h2>
          <button onClick={onClose} className="flex-shrink-0 text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XMarkIcon />
          </button>
        </header>

        <main className="p-6 md:p-8 overflow-y-auto flex-1">
          <div className="text-gray-700 dark:text-gray-300 leading-7 text-base">
            {renderContent(pages[currentPage])}
          </div>
        </main>
        
        <footer className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl flex justify-between items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
          >
            <ChevronLeftIcon /> <span className="ml-2">Previous</span>
          </button>
          
          <div className="font-semibold text-gray-600 dark:text-gray-300">
            Page {currentPage + 1} of {totalPages}
          </div>

          {currentPage < totalPages - 1 ? (
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
                className="flex items-center px-4 py-2 bg-cbn-green text-white rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span className="mr-2">Next</span> <ChevronRightIcon />
              </button>
          ) : (
            <button
              onClick={onClose}
              className="py-2 px-5 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Close
            </button>
          )}
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

export default DocumentViewer;
