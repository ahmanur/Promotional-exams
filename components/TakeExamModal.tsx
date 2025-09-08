import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { mockQuestions } from '../services/mockData';
import { XMarkIcon } from './icons/Icons';

interface TakeExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TakeExamModal: React.FC<TakeExamModalProps> = ({ isOpen, onClose }) => {
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(15); // in minutes
  const [examMode, setExamMode] = useState<'standard' | 'instant'>('standard');
  const navigate = ReactRouterDOM.useNavigate();

  if (!isOpen) return null;

  const maxQuestions = mockQuestions.length;

  const handleStartExam = () => {
    onClose();
    navigate(`/exam/general`, {
      state: {
        questionCount: numQuestions,
        timeLimit: timeLimit,
        examMode: examMode,
      },
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        style={{ animation: 'scale-in 0.2s ease-out forwards' }}
      >
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-cbn-green dark:text-cbn-gold">General Promotion Exam</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XMarkIcon />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-gray-600 dark:text-gray-400 mb-6">Create a custom practice exam with questions from all departments. Adjust the number of questions and set your own time limit to challenge yourself.</p>
          <div className="space-y-8">
            {/* Number of Questions Slider */}
            <div>
              <label htmlFor="numQuestions" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Number of Questions: <span className="font-bold text-cbn-green dark:text-cbn-gold">{numQuestions}</span></label>
              <input
                id="numQuestions"
                type="range"
                min="5"
                max={maxQuestions}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cbn-green"
              />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>5</span>
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
                max="60"
                step="5"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cbn-green"
              />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>5</span>
                <span>60</span>
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
                className="py-2 px-5 font-bold text-white bg-cbn-green rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cbn-green transition-transform transform hover:scale-105"
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

export default TakeExamModal;