import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, ArrowLeft, Volume2, Play, Pause, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { getRandomQuestionSet, Question } from '@/data/questionBank';
import { logger } from '@/services/logService';

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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [responses, setResponses] = useState<{ [key: number]: Blob }>({});
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [speechInitialized, setSpeechInitialized] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef(0);

  // Load questions on component mount
  useEffect(() => {
    const loadQuestions = () => {
      try {
        setIsLoadingQuestions(true);
        const questionSet = getRandomQuestionSet(grade);
        if (questionSet.length === 0) {
          logger.warn(`No questions available for grade ${grade}`);
        } else {
          logger.info(`Loaded ${questionSet.length} questions for grade ${grade}`);
        }
        setQuestions(questionSet);
      } catch (error) {
        logger.error('Error loading questions', { error, grade });
        setQuestions([]);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, [grade]);

  // Initialize speech synthesis
  useEffect(() => {
    const initializeSpeech = () => {
      if ('speechSynthesis' in window) {
        logger.info('Speech synthesis is supported');
        setSpeechInitialized(true);
      } else {
        logger.warn('Speech synthesis is not supported');
        alert('Text-to-speech is not supported in your browser. Please try a different browser.');
      }
    };

    initializeSpeech();
  }, []);

  // Function to speak the current question
  const speakQuestion = (text: string) => {
    if (!speechInitialized) {
      logger.warn('Speech synthesis not initialized');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate; // Set speech rate
    utterance.lang = 'en-US'; // Set language

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      logger.info('Speech started');
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      logger.info('Speech ended');
    };

    utterance.onpause = () => {
      setIsPaused(true);
      logger.info('Speech paused');
    };

    utterance.onresume = () => {
      setIsPaused(false);
      logger.info('Speech resumed');
    };

    utterance.onerror = (event) => {
      logger.error('Speech error', { error: event.error });
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Handle play question
  const handlePlayQuestion = () => {
    if (currentQuestion) {
      speakQuestion(currentQuestion.text);
    }
  };

  // Handle start recording
  const handleStartRecording = async () => {
    logger.info('Start recording');
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.onstop = handleStopRecording;
      mediaRecorderRef.current.start();

      // Set a timeout to automatically stop recording after a certain duration (e.g., 10 seconds)
      speechTimeoutRef.current = setTimeout(() => {
        logger.info('Stopping recording automatically after timeout');
        stopRecording();
      }, 10000); // 10 seconds
    } catch (error) {
      logger.error('Error starting recording', { error });
      setIsRecording(false);
      alert('Failed to start recording. Please make sure you have a microphone and it is enabled.');
    }
  };

  // Handle data available during recording
  const handleDataAvailable = (event: BlobEvent) => {
    logger.info('Data available during recording');
    if (event.data.size > 0) {
      setResponses(prevResponses => ({
        ...prevResponses,
        [currentQuestion.id]: event.data,
      }));
    }
  };

  // Handle stop recording
  const handleStopRecording = () => {
    logger.info('Recording stopped');
    setIsRecording(false);
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      clearTimeout(speechTimeoutRef.current); // Clear the timeout
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    logger.info('Next question');
    stopRecording(); // Ensure recording is stopped

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Test is complete
      const results = Object.entries(responses).map(([questionId, audioBlob]) => ({
        questionId: parseInt(questionId),
        audioBlob,
      }));
      onComplete(results);
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    logger.info('Previous question');
    stopRecording(); // Ensure recording is stopped
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">No Questions Available</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              No questions are available for grade {grade}.
            </p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-questions"
                checked={showQuestions}
                onCheckedChange={onShowQuestionsChange}
              />
              <Label htmlFor="show-questions">Show The Questions</Label>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {grade} English Assessment
            </h1>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-1">
            Question {currentQuestionIndex + 1} / {questions.length}
          </p>
        </div>

        {/* Instructions */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-800 font-medium mb-1">語音提示：</p>
                <p className="text-blue-700 text-sm">
                  系統會自動按下「Start Recording」，請聽實人對話，請當然回答
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
              <Badge variant="secondary">{currentQuestion.section}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Text - Show only if showQuestions is true */}
            {showQuestions && (
              <div className="text-lg font-medium text-gray-900">
                {currentQuestion.text}
              </div>
            )}

            {/* Reading Passage - Show only for reading type questions and if showQuestions is true */}
            {showQuestions && currentQuestion.type === 'reading' && currentQuestion.readingPassage && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3">Reading Passage:</h4>
                <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {currentQuestion.readingPassage}
                </div>
              </div>
            )}

            {/* Audio Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePlayQuestion}
                disabled={isPlaying && !isPaused}
                className="flex items-center space-x-2"
              >
                {isPlaying && !isPaused ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Playing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Play Question</span>
                  </>
                )}
              </Button>

              <Button
                size="lg"
                onClick={handleStartRecording}
                disabled={isRecording}
                className={`flex items-center space-x-2 ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>Recording...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>Start Recording</span>
                  </>
                )}
              </Button>
            </div>

            {/* Response indicator */}
            {responses[currentQuestion.id] && (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Response recorded</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex >= questions.length - 1}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Complete Test' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoiceTest;
