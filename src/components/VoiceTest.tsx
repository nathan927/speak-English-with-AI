import React, { useState, useEffect } from 'react';
import { Question } from '../data/questionBank';
import { Volume2 } from 'lucide-react';

interface VoiceTestProps {
  questions: Question[];
  showQuestions: boolean;
  onComplete: () => void;
}

const VoiceTest: React.FC<VoiceTestProps> = ({ questions, showQuestions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentQuestion(questions[currentQuestionIndex]);
    }
  }, [questions, currentQuestionIndex]);

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete();
    }
  };

  const speakText = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  if (!currentQuestion) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Voice Test
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Answer the questions by speaking clearly.
          </p>
        </div>

        {/* Question Display */}
        <div className="space-y-4">
          {currentQuestion && (
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
                  {isSpeaking ? 'Playing...' : 'Playing question...'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-end">
          <button
            onClick={nextQuestion}
            className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceTest;
