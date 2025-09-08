import React, { useState, useEffect, useCallback } from 'react';
// FIX: Changed react-router-dom import to a namespace import to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { mockQuestions, mockDepartments } from '../services/mockData';
import { Question } from '../types';
import { ClockIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, CheckIcon, XMarkIcon, ListBulletIcon } from '../components/icons/Icons';

// Simple shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

interface QuestionNavigatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    questions: Question[];
    userAnswers: { [key: string]: string };
    onJumpToQuestion: (index: number) => void;
}

const QuestionNavigatorModal: React.FC<QuestionNavigatorModalProps> = ({ isOpen, onClose, questions, userAnswers, onJumpToQuestion }) => {
    if (!isOpen) return null;
    
    return (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col transform transition-all duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'scale-in 0.2s ease-out forwards' }}
          >
            <header className="flex justify-between items-center p-5 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-xl z-10">
              <h2 className="text-2xl font-bold text-cbn-green dark:text-cbn-gold">Question Overview</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <XMarkIcon />
              </button>
            </header>

            <main className="p-5 overflow-y-auto flex-1">
                <ul className="space-y-4">
                    {questions.map((q, index) => {
                        const userAnswer = userAnswers[q.id];
                        const isAnswered = !!userAnswer;

                        return (
                            <li key={q.id}>
                                <button
                                    onClick={() => {
                                        onJumpToQuestion(index);
                                        onClose();
                                    }}
                                    className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:ring-2 hover:ring-cbn-green transition-all"
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                                            {index + 1}. {q.questionText}
                                        </p>
                                        {isAnswered ? 
                                            <span className="flex-shrink-0 ml-4 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Answered</span> :
                                            <span className="flex-shrink-0 ml-4 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">Unanswered</span>
                                        }
                                    </div>
                                    {isAnswered && (
                                        <p className="mt-2 text-sm text-cbn-green dark:text-cbn-gold pl-4 border-l-2 border-cbn-green dark:border-cbn-gold">
                                            Your answer: <span className="font-semibold">{userAnswer}</span>
                                        </p>
                                    )}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </main>
             <footer className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl flex justify-end items-center">
              <button
                onClick={onClose}
                className="py-2 px-5 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                Close
              </button>
            </footer>
             <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            ` }} />
          </div>
        </div>
    );
};


const ExamPortal: React.FC = () => {
    const { deptId } = ReactRouterDOM.useParams<{ deptId: string }>();
    const navigate = ReactRouterDOM.useNavigate();
    const location = ReactRouterDOM.useLocation();
    
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
    const [examTitle, setExamTitle] = useState('');
    const [examMode, setExamMode] = useState<'standard' | 'instant'>('standard');
    const [isAnswered, setIsAnswered] = useState(false);
    const [isNavigatorModalOpen, setIsNavigatorModalOpen] = useState(false);

    const department = mockDepartments.find(d => d.id === deptId);

    const handleSubmit = useCallback(() => {
        const score = questions.reduce((acc, question) => {
            return userAnswers[question.id] === question.correctAnswer ? acc + 1 : acc;
        }, 0);

        navigate('/results', { state: { score, totalQuestions: questions.length, answers: userAnswers, questions } });
    }, [questions, userAnswers, navigate]);

    useEffect(() => {
        const state = (location.state as { examMode?: 'standard' | 'instant', questionCount?: number, timeLimit?: number }) || {};
        setExamMode(state.examMode || 'standard');
        
        if (deptId === 'general') {
            const questionCount = state.questionCount || 10;
            const timeLimit = state.timeLimit || 15;
            
            if (!location.state) {
                 console.warn("Navigated to general exam without state. Using defaults.");
            }

            const allQuestionsShuffled = shuffleArray(mockQuestions);
            setQuestions(allQuestionsShuffled.slice(0, questionCount));
            setTimeLeft(timeLimit * 60);
            setExamTitle('General Promotion Exam');
        } else {
            const deptQuestions = mockQuestions.filter(q => q.departmentId === deptId);
            setQuestions(shuffleArray(deptQuestions));
            setTimeLeft(30 * 60); // Default for department exams
            setExamTitle(`${department?.name || 'Department'} Practice Exam`);
        }
    }, [deptId, location.state, department?.name]);

    useEffect(() => {
        if (questions.length === 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questions, handleSubmit]);
    
    const handleAnswerSelect = (questionId: string, answer: string) => {
        if (examMode === 'instant' && isAnswered) return;
        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
        if (examMode === 'instant') {
            setIsAnswered(true);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsAnswered(false); // Reset for new question
        }
    };
    
    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    if (questions.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-700">No Questions Available</h2>
                <p className="text-gray-500 mt-2">There are currently no practice questions available for this exam.</p>
            </div>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center border-b dark:border-gray-700 pb-4 mb-4">
                    <h1 className="text-2xl font-bold text-cbn-green dark:text-cbn-gold">{examTitle}</h1>
                     <div className="flex items-center gap-4">
                        {examMode === 'standard' && (
                            <button
                                onClick={() => setIsNavigatorModalOpen(true)}
                                className="flex items-center text-cbn-green dark:text-cbn-gold p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="Question Overview"
                            >
                                <ListBulletIcon />
                                <span className="ml-2 hidden sm:inline">Overview</span>
                            </button>
                        )}
                        <div className={`flex items-center font-bold p-2 rounded-lg ${timeLeft < 300 ? 'text-red-600 bg-red-100 dark:bg-red-900/50' : 'text-cbn-green bg-green-100 dark:text-green-300 dark:bg-green-900/50'}`}>
                            <ClockIcon />
                            <span className="ml-2">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mb-4">
                        <p className="text-gray-500 dark:text-gray-400 font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</p>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-1">{currentQuestion.questionText}</h2>
                    </div>
                    
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = userAnswers[currentQuestion.id] === option;
                            const isCorrect = currentQuestion.correctAnswer === option;
                            
                            let optionClass = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer';
                            let icon = null;

                            if (examMode === 'instant' && isAnswered) {
                                optionClass = 'cursor-not-allowed';
                                if (isCorrect) {
                                    optionClass += ' bg-green-100 dark:bg-green-900/50 border-green-500 dark:border-green-600';
                                    icon = <CheckIcon className="text-green-600 dark:text-green-400 h-5 w-5" />;
                                } else if (isSelected) {
                                    optionClass += ' bg-red-100 dark:bg-red-900/50 border-red-500 dark:border-red-600';
                                    icon = <XMarkIcon className="text-red-600 dark:text-red-400 h-5 w-5" />;
                                } else {
                                    optionClass += ' bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700';
                                }
                            } else if (isSelected) {
                                optionClass = 'bg-cbn-gold border-cbn-green ring-2 ring-cbn-green dark:text-gray-900 cursor-pointer';
                            }
                            
                            return (
                                <label key={index} className={`flex items-center justify-between w-full p-4 border rounded-lg transition-colors ${optionClass}`}>
                                    <span>{option}</span>
                                    {icon}
                                    <input
                                        type="radio"
                                        name={currentQuestion.id}
                                        value={option}
                                        checked={isSelected}
                                        onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                                        className="hidden"
                                        disabled={examMode === 'instant' && isAnswered}
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>

                 <div className="flex justify-between items-center mt-8 pt-4 border-t dark:border-gray-700">
                    <button onClick={handlePrev} disabled={currentQuestionIndex === 0 || examMode === 'instant'} className="flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400">
                        <ChevronLeftIcon /> <span className="ml-2">Previous</span>
                    </button>
                    
                    {currentQuestionIndex === questions.length - 1 ? (
                         <button onClick={handleSubmit} disabled={examMode === 'instant' && !isAnswered} className="flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed">
                             <CheckCircleIcon /> <span className="ml-2">Submit Exam</span>
                         </button>
                    ) : (
                         <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1 || (examMode === 'instant' && !isAnswered)} className="flex items-center px-4 py-2 bg-cbn-green text-white rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed">
                             <span className="mr-2">Next</span> <ChevronRightIcon />
                         </button>
                    )}
                </div>
            </div>
             <QuestionNavigatorModal 
                isOpen={isNavigatorModalOpen}
                onClose={() => setIsNavigatorModalOpen(false)}
                questions={questions}
                userAnswers={userAnswers}
                onJumpToQuestion={(index) => setCurrentQuestionIndex(index)}
            />
        </div>
    );
};

export default ExamPortal;