import React, { useState, useMemo, useEffect } from 'react';
// FIX: Reverted to named imports for react-router-dom to resolve hook resolution errors.
import { useParams, useNavigate } from 'react-router-dom';
import { mockDepartments, mockDocuments, mockQuestions } from '../services/mockData';
import { Document, DocumentType } from '../types';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { MagnifyingGlassIcon, DocumentArrowDownIcon, PencilIcon, TrashIcon, ArrowUpOnSquareIcon, DocumentDuplicateIcon, XMarkIcon, BookOpenIcon } from '../components/icons/Icons';
import DocumentViewer from '../components/DocumentViewer';
import { documentContent } from '../services/documentContent';

interface ExamModeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (config: { mode: 'standard' | 'instant'; numQuestions: number; timeLimit: number }) => void;
  maxQuestions: number;
  departmentName: string;
}

const ExamModeSelectionModal: React.FC<ExamModeSelectionModalProps> = ({ isOpen, onClose, onStart, maxQuestions, departmentName }) => {
  const [numQuestions, setNumQuestions] = useState(maxQuestions > 0 ? Math.min(10, maxQuestions) : 0);
  const [timeLimit, setTimeLimit] = useState(15);
  const [examMode, setExamMode] = useState<'standard' | 'instant'>('standard');
  
  useEffect(() => {
    const initialQuestions = maxQuestions > 0 ? Math.min(10, maxQuestions) : 0;
    setNumQuestions(initialQuestions);
  }, [maxQuestions]);


  if (!isOpen) return null;

  const handleStartExam = () => {
    if (numQuestions === 0) return;
    onStart({ mode: examMode, numQuestions, timeLimit });
  };
  
  const minQuestions = maxQuestions > 0 ? 1 : 0;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scale-in 0.2s ease-out forwards' }}
      >
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-cbn-green dark:text-cbn-gold">Practice Exam: {departmentName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XMarkIcon />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-gray-600 dark:text-gray-400 mb-6">Customize your practice exam. Adjust the number of questions and set your own time limit to challenge yourself.</p>
          {maxQuestions > 0 ? (
            <div className="space-y-8">
              {/* Number of Questions Slider */}
              <div>
                <label htmlFor="numQuestions" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Number of Questions: <span className="font-bold text-cbn-green dark:text-cbn-gold">{numQuestions}</span></label>
                <input
                  id="numQuestions"
                  type="range"
                  min={minQuestions}
                  max={maxQuestions}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cbn-green"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>{minQuestions}</span>
                  <span>{maxQuestions}</span>
                </div>
              </div>

              {/* Time Limit Slider */}
              <div>
                <label htmlFor="timeLimit" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Time Limit (minutes): <span className="font-bold text-cbn-green dark:text-cbn-gold">{timeLimit}</span></label>
                <input
                  id="timeLimit"
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cbn-green"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>5</span>
                  <span>120</span>
                </div>
              </div>

              {/* Exam Mode Selection */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Exam Mode</label>
                <div className="flex flex-col sm:flex-row gap-2 rounded-lg bg-gray-100 dark:bg-gray-900 p-1">
                  <label className={`flex-1 text-center font-semibold p-2 rounded-md cursor-pointer transition-colors ${examMode === 'standard' ? 'bg-cbn-green text-white shadow' : 'dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                    <input
                      type="radio"
                      name="examMode"
                      value="standard"
                      checked={examMode === 'standard'}
                      onChange={() => setExamMode('standard')}
                      className="sr-only"
                      aria-label="Standard Mode"
                    />
                    Standard
                    <span className="block text-xs opacity-80 font-normal">Results at the end</span>
                  </label>
                  <label className={`flex-1 text-center font-semibold p-2 rounded-md cursor-pointer transition-colors ${examMode === 'instant' ? 'bg-cbn-green text-white shadow' : 'dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                    <input
                      type="radio"
                      name="examMode"
                      value="instant"
                      checked={examMode === 'instant'}
                      onChange={() => setExamMode('instant')}
                      className="sr-only"
                      aria-label="Instant Feedback Mode"
                    />
                    Instant Feedback
                    <span className="block text-xs opacity-80 font-normal">Answer revealed instantly</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-lg text-gray-500 dark:text-gray-400 py-8">
              There are currently no questions available for this department.
            </p>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl flex justify-end items-center gap-4">
          <button
            onClick={onClose}
            className="py-2 px-5 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
           <button
                onClick={handleStartExam}
                disabled={maxQuestions === 0}
                className="py-2 px-5 font-bold text-white bg-cbn-green rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cbn-green transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Start Exam
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


const DepartmentDocs: React.FC = () => {
    const { deptId } = useParams<{ deptId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<DocumentType | 'All'>('All');
    const [filterYear, setFilterYear] = useState<number | 'All'>('All');
    const [isModeModalOpen, setIsModeModalOpen] = useState(false);
    const [viewingDocument, setViewingDocument] = useState<Document | null>(null);

    const department = mockDepartments.find(d => d.id === deptId);

    const filteredDocuments = useMemo(() => {
        return mockDocuments
            .filter(doc => doc.departmentId === deptId)
            .filter(doc => searchTerm === '' || doc.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(doc => filterType === 'All' || doc.type === filterType)
            .filter(doc => filterYear === 'All' || doc.year === filterYear);
    }, [deptId, searchTerm, filterType, filterYear]);

    const years = useMemo(() => {
        const docYears = mockDocuments
            .filter(doc => doc.departmentId === deptId)
            .map(doc => doc.year);
        return [...new Set(docYears)].sort((a, b) => b - a);
    }, [deptId]);
    
    const maxQuestions = useMemo(() => {
        if (!deptId) return 0;
        return mockQuestions.filter(q => q.departmentId === deptId).length;
    }, [deptId]);
    
    if (!department) {
        return <div>Department not found.</div>;
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            // In a real app, you would handle the file upload here.
            alert(`Simulating upload of: ${event.target.files[0].name}`);
        }
    };

    const handleDownload = (doc: Document) => {
        const content = documentContent[doc.id];
        if (!content) {
            alert("Sorry, the content for this document could not be found.");
            return;
        }

        const fileContent = Array.isArray(content) ? content.join('\n\n--- End of Page ---\n\n') : content;
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        // We use .txt because the content is text, not a real PDF/DOCX.
        link.setAttribute("download", `${doc.title.replace(/ /g, '_')}.txt`); 
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    const getFileTypeIcon = (type: DocumentType) => {
        switch (type) {
            case DocumentType.PDF: return <span className="text-red-500 font-bold">PDF</span>;
            case DocumentType.DOCX: return <span className="text-blue-500 font-bold">DOCX</span>;
            case DocumentType.PPTX: return <span className="text-orange-500 font-bold">PPTX</span>;
            case DocumentType.PNG:
            case DocumentType.JPG: return <span className="text-purple-500 font-bold">IMG</span>;
            default: return <DocumentDuplicateIcon />;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{department.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Browse and manage documents for this department.</p>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 relative">
                         <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by document title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cbn-green dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as DocumentType | 'All')}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cbn-green dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="All">All Types</option>
                            {Object.values(DocumentType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cbn-green dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="All">All Years</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                 {user?.role === Role.ADMIN && (
                    <div className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center bg-cbn-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">
                            <ArrowUpOnSquareIcon />
                            <span className="ml-2">Upload Document</span>
                        </label>
                        <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.docx,.pptx,.png,.jpg" />
                    </div>
                )}
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">Title</th>
                            <th className="p-4 font-semibold">Type</th>
                            <th className="p-4 font-semibold">Year</th>
                            <th className="p-4 font-semibold">Uploaded</th>
                            <th className="p-4 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocuments.map(doc => (
                            <tr key={doc.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{doc.title}</td>
                                <td className="p-4">{getFileTypeIcon(doc.type)}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{doc.year}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{doc.uploadedAt}</td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center items-center space-x-2">
                                        <button onClick={() => setViewingDocument(doc)} className="text-blue-600 hover:text-blue-800 p-1" title="Read Document"><BookOpenIcon /></button>
                                        <button onClick={() => handleDownload(doc)} className="text-green-600 hover:text-green-800 p-1" title="Download"><DocumentArrowDownIcon /></button>
                                        {user?.role === Role.ADMIN && (
                                            <>
                                                <button className="text-yellow-600 hover:text-yellow-800 p-1" title="Edit"><PencilIcon /></button>
                                                <button className="text-red-600 hover:text-red-800 p-1" title="Delete"><TrashIcon /></button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {filteredDocuments.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center p-6 text-gray-500 dark:text-gray-400">No documents found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-8">
                 <button 
                    onClick={() => setIsModeModalOpen(true)}
                    className="inline-block bg-cbn-gold text-cbn-green font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
                  >
                    Start Practice Exam for {department.name}
                 </button>
            </div>
            <ExamModeSelectionModal 
                isOpen={isModeModalOpen}
                onClose={() => setIsModeModalOpen(false)}
                onStart={(config) => {
                    setIsModeModalOpen(false);
                    navigate(`/exam/${deptId}`, { state: { 
                        examMode: config.mode,
                        questionCount: config.numQuestions,
                        timeLimit: config.timeLimit
                     } });
                }}
                maxQuestions={maxQuestions}
                departmentName={department.name}
            />
            <DocumentViewer document={viewingDocument} onClose={() => setViewingDocument(null)} />
        </div>
    );
};

export default DepartmentDocs;