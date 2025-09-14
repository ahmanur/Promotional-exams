import React from 'react';
// FIX: Reverted to named imports for react-router-dom to resolve component and hook resolution errors.
import { useLocation, Navigate, Link } from 'react-router-dom';
import { ExamResult, Question } from '../types';
import { CheckIcon, XMarkIcon } from '../components/icons/Icons';

const AnswerReview: React.FC<{ question: Question; userAnswer: string }> = ({ question, userAnswer }) => {
    const isCorrect = userAnswer === question.correctAnswer;
    return (
        <div className={`p-4 rounded-lg border-l-4 mb-4 ${isCorrect ? 'bg-green-50 dark:bg-green-900/40 border-green-500' : 'bg-red-50 dark:bg-red-900/40 border-red-500'}`}>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{question.questionText}</p>
            <div className="mt-2 space-y-1">
                {question.options.map((option, index) => {
                    const isUserChoice = userAnswer === option;
                    const isCorrectAnswer = question.correctAnswer === option;

                    let highlightClass = 'dark:text-gray-300';
                    if (isCorrectAnswer) highlightClass = 'text-green-700 dark:text-green-400 font-bold';
                    if (isUserChoice && !isCorrectAnswer) highlightClass = 'text-red-700 dark:text-red-400 line-through';

                    return (
                        <div key={index} className={`flex items-center ${highlightClass}`}>
                            {isCorrectAnswer && <CheckIcon className="text-green-500 mr-2" />}
                            {isUserChoice && !isCorrectAnswer && <XMarkIcon className="text-red-500 mr-2" />}
                            <span className="ml-4">{option}</span>
                        </div>
                    );
                })}
            </div>
            {question.explanation && (
                 <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 p-2 rounded">
                    <strong>Explanation:</strong> {question.explanation}
                </p>
            )}
        </div>
    );
};

const ExamResults: React.FC = () => {
    const location = useLocation();
    const result = location.state as ExamResult | null;

    if (!result) {
        return <Navigate to="/dashboard" />;
    }

    const { score, totalQuestions, answers, questions } = result;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const isPass = percentage >= 50;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Exam Completed!</h1>
                <p className={`text-6xl font-bold mt-4 ${isPass ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {percentage}%
                </p>
                <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">You scored {score} out of {totalQuestions} questions correctly.</p>

                <div className="mt-8">
                     <Link to="/dashboard" className="bg-cbn-green text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
                        Back to Dashboard
                     </Link>
                </div>
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Answer Review</h2>
                <div>
                    {questions.map((q) => (
                        <AnswerReview key={q.id} question={q} userAnswer={answers[q.id]} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExamResults;