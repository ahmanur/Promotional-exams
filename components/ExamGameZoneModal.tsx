import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { mockQuestions, mockDirectorates, mockDepartments } from '../services/mockData';
import { Department, Question } from '../types';
import { XMarkIcon, GameControllerIcon, MapIcon, ShieldCheckIcon, ClockIcon, PuzzlePieceIcon, LockClosedIcon, StarIcon, CheckCircleIcon, ChevronRightIcon, BookOpenIcon, ArrowPathIcon } from './icons/Icons';

const GAME_PROGRESS_KEY = 'cbnGameZoneProgress';
const allDepts = mockDirectorates.flatMap(d => d.departments);
const deptMap = new Map(allDepts.map(d => [d.id, d]));

interface PlayerProgress {
    unlockedDepts: string[];
    completedDepts: string[];
}

// Simple shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// FIX: Updated the icon type to be more specific, ensuring it accepts a className prop to resolve a cloneElement type error.
interface GameModeCardProps {
    title: string;
    description: string;
    icon: React.ReactElement<{ className?: string }>;
    onClick?: () => void;
    comingSoon?: boolean;
}

const GameModeCard: React.FC<GameModeCardProps> = ({ title, description, icon, onClick, comingSoon }) => (
    <button
        onClick={onClick}
        disabled={comingSoon}
        className={`relative group p-6 border-2 rounded-lg text-left transition-all w-full h-full flex flex-col items-start
            ${comingSoon 
                ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed' 
                : 'border-cbn-green dark:border-cbn-gold hover:bg-cbn-green/10 dark:hover:bg-cbn-gold/10'}`
        }
    >
        {comingSoon && <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">Coming Soon</span>}
        <div className={`p-3 rounded-full mb-4 ${comingSoon ? 'bg-gray-400 dark:bg-gray-600' : 'bg-cbn-green dark:bg-cbn-gold text-cbn-green'}`}>
            {React.cloneElement(icon, { className: 'h-8 w-8 text-white' })}
        </div>
        <h3 className={`text-xl font-bold ${comingSoon ? 'text-gray-500 dark:text-gray-400' : 'text-cbn-green dark:text-cbn-gold'}`}>{title}</h3>
        <p className={`mt-2 ${comingSoon ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>{description}</p>
    </button>
);


interface AdventureQuizProps {
    department: Department;
    onQuizComplete: (passed: boolean) => void;
}

const AdventureQuiz: React.FC<AdventureQuizProps> = ({ department, onQuizComplete }) => {
    const questions = useMemo(() => {
        const deptQuestions = mockQuestions.filter(q => q.departmentId === department.id || q.departmentId === 'general');
        return shuffleArray(deptQuestions).slice(0, 5);
    }, [department.id]);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});

    const handleAnswerSelect = (questionId: string, answer: string) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleNext = () => {
        if(currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
        } else {
            // End of quiz
            const score = questions.reduce((acc, q) => {
                return userAnswers[q.id] === q.correctAnswer ? acc + 1 : acc;
            }, 0);
            onQuizComplete(score >= 3); // Pass if 3 out of 5 are correct
        }
    }

    if(questions.length === 0) {
        return (
            <div className="p-8 text-center">
                <p className="text-xl font-semibold">No questions available for this department yet.</p>
                <button onClick={() => onQuizComplete(true)} className="mt-4 px-6 py-2 font-bold text-white bg-cbn-green rounded-lg hover:bg-opacity-90">Continue Anyway</button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isAnswered = !!userAnswers[currentQuestion.id];

    return (
        <div className="p-6 flex flex-col h-full">
             <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
                <div className="bg-cbn-gold h-2.5 rounded-full" style={{width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`}}></div>
            </div>
            <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-gray-500 dark:text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <h3 className="text-xl md:text-2xl font-semibold my-4 text-gray-800 dark:text-gray-200">{currentQuestion.questionText}</h3>
                <div className="space-y-3 max-w-lg mx-auto w-full my-4">
                    {shuffleArray(currentQuestion.options).map(option => (
                        <label key={option} className={`block w-full text-left p-4 border-2 rounded-lg transition-all cursor-pointer ${userAnswers[currentQuestion.id] === option ? 'bg-cbn-gold/30 border-cbn-green dark:border-cbn-gold' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-cbn-gold'}`}>
                            <input type="radio" name="answer" value={option} checked={userAnswers[currentQuestion.id] === option} onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)} className="hidden"/>
                            <span className="font-semibold">{option}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex justify-end mt-auto">
                 <button onClick={handleNext} disabled={!isAnswered} className="flex items-center px-6 py-3 font-bold text-white bg-cbn-green rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
                     {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish'} <ChevronRightIcon className="ml-2"/>
                 </button>
            </div>
        </div>
    );
};


interface ExamGameZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}
type GameState = 'menu' | 'adventure-map' | 'adventure-quiz' | 'quiz-results';

const ExamGameZoneModal: React.FC<ExamGameZoneModalProps> = ({ isOpen, onClose }) => {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [playerProgress, setPlayerProgress] = useState<PlayerProgress>({ unlockedDepts: ['general'], completedDepts: [] });
    const [currentDept, setCurrentDept] = useState<Department | null>(null);
    const [lastQuizPassed, setLastQuizPassed] = useState(false);

    useEffect(() => {
        try {
            const savedProgress = localStorage.getItem(GAME_PROGRESS_KEY);
            if (savedProgress) {
                const parsed = JSON.parse(savedProgress);
                // Basic validation
                if(Array.isArray(parsed.unlockedDepts) && Array.isArray(parsed.completedDepts)){
                    setPlayerProgress(parsed);
                }
            }
        } catch (error) {
            console.error("Failed to load game progress:", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(playerProgress));
        } catch (error) {
            console.error("Failed to save game progress:", error);
        }
    }, [playerProgress]);
    
    const handleStartAdventure = () => setGameState('adventure-map');
    
    const handleDeptClick = (dept: Department) => {
        if(playerProgress.unlockedDepts.includes(dept.id)) {
            setCurrentDept(dept);
            setGameState('adventure-quiz');
        }
    };
    
    const handleQuizComplete = (passed: boolean) => {
        setLastQuizPassed(passed);
        if(passed && currentDept) {
            setPlayerProgress(prev => {
                const newCompleted = [...new Set([...prev.completedDepts, currentDept.id])];
                
                const currentDeptIndex = allDepts.findIndex(d => d.id === currentDept.id);
                const nextDept = allDepts[currentDeptIndex + 1];
                
                const newUnlocked = nextDept 
                    ? [...new Set([...prev.unlockedDepts, nextDept.id])]
                    : prev.unlockedDepts;
                
                return { completedDepts: newCompleted, unlockedDepts: newUnlocked };
            });
        }
        setGameState('quiz-results');
    };

    const handleResetProgress = () => {
        if(window.confirm("Are you sure you want to reset all your adventure progress? This cannot be undone.")){
            const initialProgress = { unlockedDepts: ['general'], completedDepts: [] };
            setPlayerProgress(initialProgress);
            localStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(initialProgress));
        }
    };

    const renderContent = () => {
      switch (gameState) {
        case 'menu':
          return (
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center mb-6">Welcome to the Game Zone!</h3>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Choose an interactive game to test your knowledge.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GameModeCard title="Quiz Adventure Map" description="Travel across CBN departments, answering questions to advance your journey." icon={<MapIcon />} onClick={handleStartAdventure} />
                <GameModeCard title="Battle Mode" description="Challenge a colleague or an AI bot in a head-to-head quiz battle." icon={<ShieldCheckIcon />} comingSoon />
                <GameModeCard title="Time Attack" description="Answer questions correctly to speed through a virtual track against the clock." icon={<ClockIcon />} comingSoon />
                <GameModeCard title="Puzzle Unlock" description="Reveal a hidden image by solving puzzles and answering trivia questions." icon={<PuzzlePieceIcon />} comingSoon />
              </div>
            </div>
          );
        case 'adventure-map':
            return (
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">CBN Adventure Map</h3>
                        <div>
                            <button onClick={() => setGameState('menu')} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:underline mr-4">Back to Menu</button>
                            <button onClick={handleResetProgress} className="text-sm font-semibold text-red-600 hover:underline"><ArrowPathIcon className="h-4 w-4 inline mr-1"/>Reset</button>
                        </div>
                    </div>
                    {mockDirectorates.map(dir => (
                        <div key={dir.name} className="mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                            <h4 className="text-lg font-bold text-cbn-green dark:text-cbn-gold mb-3">{dir.name}</h4>
                            <div className="flex flex-wrap gap-4">
                                {dir.departments.map(dept => {
                                    const isCompleted = playerProgress.completedDepts.includes(dept.id);
                                    const isUnlocked = playerProgress.unlockedDepts.includes(dept.id);
                                    
                                    return (
                                        <button key={dept.id} onClick={() => handleDeptClick(dept)} disabled={!isUnlocked} className="w-40 h-28 p-3 border-2 rounded-lg flex flex-col justify-between items-center text-center transition-all disabled:cursor-not-allowed group">
                                            {isCompleted ? (
                                                <div className="w-full h-full flex flex-col justify-center items-center bg-cbn-gold/20 border-cbn-gold">
                                                    <StarIcon className="w-8 h-8 text-cbn-gold"/>
                                                    <p className="font-bold text-xs mt-1 text-cbn-green dark:text-cbn-gold">{dept.name}</p>
                                                </div>
                                            ) : isUnlocked ? (
                                                <div className="w-full h-full flex flex-col justify-center items-center bg-cbn-green/10 border-cbn-green hover:bg-cbn-green/20">
                                                     <BookOpenIcon className="w-8 h-8 text-cbn-green dark:text-cbn-gold"/>
                                                     <p className="font-bold text-xs mt-1 text-cbn-green dark:text-cbn-gold">{dept.name}</p>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col justify-center items-center bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-60">
                                                    <LockClosedIcon className="w-8 h-8 text-gray-500"/>
                                                    <p className="font-bold text-xs mt-1 text-gray-500">{dept.name}</p>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )
        case 'adventure-quiz':
            if(!currentDept) return <div>Error: No department selected.</div>
            return <AdventureQuiz department={currentDept} onQuizComplete={handleQuizComplete} />;
        case 'quiz-results':
            return (
                 <div className="p-8 text-center flex flex-col justify-center items-center h-full">
                    <CheckCircleIcon className={`w-24 h-24 mb-4 ${lastQuizPassed ? 'text-green-500' : 'text-red-500'}`} />
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{lastQuizPassed ? 'Level Complete!' : 'Challenge Failed'}</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                        {lastQuizPassed 
                            ? `You have successfully passed the ${currentDept?.name} challenge.`
                            : `You need to score at least 60% to pass. Better luck next time!`
                        }
                    </p>
                    <div className="flex gap-4 mt-8">
                        <button onClick={() => setGameState('adventure-map')} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Back to Map</button>
                        {!lastQuizPassed && currentDept &&
                            <button onClick={() => handleDeptClick(currentDept)} className="bg-cbn-green text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90">
                                Try Again
                            </button>
                        }
                    </div>
                </div>
            );
        default:
          return <div>Error</div>;
      }
    };
    
    if (!isOpen) return null;
    
    return (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] max-h-[800px] flex flex-col transform transition-all duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'scale-in 0.2s ease-out forwards' }}
          >
            <header className="flex justify-between items-center p-5 border-b dark:border-gray-700 flex-shrink-0">
              <h2 className="text-2xl font-bold text-cbn-green dark:text-cbn-gold flex items-center gap-2">
                <GameControllerIcon /> Exam Game Zone
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <XMarkIcon />
              </button>
            </header>
            <main className="flex-1 overflow-y-auto min-h-0">
              {renderContent()}
            </main>
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

export default ExamGameZoneModal;