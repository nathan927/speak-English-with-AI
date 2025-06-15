
import React, { useState, useEffect } from 'react';
import { Question } from '../data/questionBank';
import { Volume2 } from 'lucide-react';

interface VoiceTestProps {
  grade: string;
  speechRate: number;
  showQuestions: boolean;
  onComplete: (results: any) => void;
  onBack: () => void;
  onShowQuestionsChange: (checked: boolean) => void;
}

const VoiceTest: React.FC<VoiceTestProps> = ({ 
  grade, 
  speechRate, 
  showQuestions, 
  onComplete, 
  onBack,
  onShowQuestionsChange 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Load questions based on grade - this would need to be implemented
    // For now, using empty array as placeholder
    const loadedQuestions: Question[] = [];
    setQuestions(loadedQuestions);
  }, [grade]);

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentQuestion(questions[currentQuestionIndex]);
    }
  }, [questions, currentQuestionIndex]);

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Create mock results for completion
      const results = {
        grade,
        totalQuestions: questions.length,
        completedAt: new Date().toISOString()
      };
      onComplete(results);
    }
  };

  const speakText = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  if (!currentQuestion && questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Voice Test - {grade}
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Answer the questions by speaking clearly.
          </p>
        </div>

        {/* Question Display */}
        {currentQuestion && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Question {currentQuestionIndex + 1}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    {currentQuestion.section}
                  </span>
                  {currentQuestion.setGroup && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                      Set {currentQuestion.setGroup}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Always show question text */}
                <div className="text-gray-800">
                  {currentQuestion.text}
                </div>
                
                {/* Always show reading passage for reading questions */}
                {currentQuestion.type === 'reading' && currentQuestion.readingPassage && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <div className="text-sm text-gray-600 mb-2">Reading Passage:</div>
                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {currentQuestion.readingPassage}
                    </div>
                  </div>
                )}
                
                {/* Show other question details if showQuestions is enabled */}
                {showQuestions && (
                  <>
                    {currentQuestion.instruction && (
                      <div className="text-sm text-gray-600 italic">
                        {currentQuestion.instruction}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Audio Controls */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => speakText(currentQuestion.text)}
                  disabled={isSpeaking}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  {isSpeaking ? 'Playing...' : 'Play question'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
          >
            Back
          </button>
          <button
            onClick={nextQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceTest;
