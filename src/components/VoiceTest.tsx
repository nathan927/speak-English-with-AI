import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mic, MicOff, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { performAIEvaluation } from '@/services/aiEvaluationService';
import { getRandomQuestionSet, type Question } from '@/data/questionBank';

interface VoiceTestProps {
  grade: string;
  onComplete: (results: any) => void;
  onBack: () => void;
}

interface RecordingData {
  questionId: number;
  section: string;
  question: string;
  audioBlob: Blob;
  timestamp: string;
  duration: number;
  wordCount: number;
  responseTime: number;
}

export const VoiceTest = ({ grade, onComplete, onBack }: VoiceTestProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordings, setRecordings] = useState<RecordingData[]>([]);
  const [responseStartTime, setResponseStartTime] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionReadTimeRef = useRef<number>(0);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  // Get questions from the comprehensive question bank
  const questions: Question[] = useMemo(() => getRandomQuestionSet(grade), [grade]);
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      // Clean up speech synthesis
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-trigger LISTEN when question changes (EXCLUDE Reading questions completely)
  useEffect(() => {
    if (currentQ && currentQ.section.toLowerCase() !== 'reading' && !currentQ.instruction.toLowerCase().includes('read')) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        handleListen();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestion]);

  const handleListen = () => {
    console.log('Listen button clicked');
    console.log('Current question:', currentQ);
    console.log('Speech synthesis available:', 'speechSynthesis' in window);
    
    if (currentQ) {
      setIsSpeaking(true);
      speakText(currentQ.text, () => {
        questionReadTimeRef.current = Date.now();
        setIsSpeaking(false);
        console.log('Speech completed, question read time set');
        // Auto-start recording after speech completes (EXCLUDE Reading questions)
        if (currentQ.section.toLowerCase() !== 'reading' && !currentQ.instruction.toLowerCase().includes('read')) {
          setTimeout(() => {
            startRecording();
          }, 1000); // Small delay before starting recording
        }
      });
    }
  };

  const startRecording = async () => {
    console.log('Starting recording...');
    try {
      // Record the time when recording starts (user starts responding)
      if (questionReadTimeRef.current > 0 && !responseStartTime) {
        setResponseStartTime(Date.now());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setHasRecorded(true);
        console.log('Recording completed, blob size:', blob.size);
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Recording failed:', error);
      toast({
        title: "Recording Failed",
        description: "Please ensure microphone permission is granted",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording...');
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      
      audio.play();
    }
  };

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setHasRecorded(false);
    setRecordingTime(0);
    setResponseStartTime(null);
    stopPlaying();
  };

  const nextQuestion = () => {
    if (audioBlob) {
      // Calculate response time
      const responseTime = responseStartTime && questionReadTimeRef.current > 0 
        ? responseStartTime - questionReadTimeRef.current 
        : 0;

      // Save recording data without analysis
      const recordingData: RecordingData = {
        questionId: currentQ.id,
        section: currentQ.section,
        question: currentQ.text,
        audioBlob,
        timestamp: new Date().toISOString(),
        duration: recordingTime,
        wordCount: Math.max(1, Math.floor(recordingTime / 0.7)),
        responseTime
      };
      
      const newRecordings = [...recordings, recordingData];
      setRecordings(newRecordings);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        resetRecording();
        questionReadTimeRef.current = 0;
      } else {
        completeTest(newRecordings);
      }
    }
  };

  const completeTest = async (finalRecordings: RecordingData[]) => {
    setIsAnalyzing(true);
    
    try {
      console.log('Starting AI-powered speech analysis...');
      const results = await performAIEvaluation(finalRecordings, grade);
      
      console.log('AI analysis completed:', results);
      setIsAnalyzing(false);
      onComplete(results);
    } catch (error) {
      console.error('AI analysis failed:', error);
      setIsAnalyzing(false);
      
      toast({
        title: "Assessment Complete",
        description: "Used fallback evaluation method, recommend retrying for detailed AI analysis",
        variant: "default",
      });
      
      // Provide basic fallback results
      const fallbackResults = {
        overallScore: 50,
        pronunciation: 45,
        vocabulary: 55,
        fluency: 50,
        confidence: 45,
        sectionScores: { spontaneous: 50, reading: 55, personal: 45 },
        grade,
        questionsAttempted: finalRecordings.length,
        strengths: ['Completed all test sections'],
        improvements: ['Recommend retesting for detailed AI analysis'],
        detailedAnalysis: finalRecordings.map(rec => ({
          section: rec.section,
          question: rec.question,
          score: 50,
          feedback: `Recording completed (${rec.duration}s) - Please retest for AI analysis`
        }))
      };
      
      onComplete(fallbackResults);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const speakText = (text: string, onEnd?: () => void) => {
    console.log('speakText called with:', text);
    
    // Clear any existing timeout
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      // Set a safety timeout to prevent getting stuck
      speechTimeoutRef.current = setTimeout(() => {
        console.log('Speech timeout triggered, force completing');
        setIsSpeaking(false);
        if (onEnd) {
          onEnd();
        }
      }, Math.max(3000, text.length * 100)); // At least 3 seconds, or 100ms per character
      
      // Wait a bit for cancel to complete
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.volume = 1.0;
        
        utterance.onstart = () => {
          console.log('Speech started');
        };
        
        utterance.onend = () => {
          console.log('Speech ended normally');
          if (speechTimeoutRef.current) {
            clearTimeout(speechTimeoutRef.current);
          }
          setIsSpeaking(false);
          if (onEnd) {
            onEnd();
          }
        };
        
        utterance.onerror = (event) => {
          console.error('Speech error:', event);
          if (speechTimeoutRef.current) {
            clearTimeout(speechTimeoutRef.current);
          }
          setIsSpeaking(false);
          if (onEnd) {
            onEnd();
          }
          toast({
            title: "Speech playback failed",
            description: "Skipped speech playback, you can start recording directly",
            variant: "default",
          });
        };
        
        console.log('Starting speech synthesis...');
        speechSynthesis.speak(utterance);
      }, 100);
    } else {
      console.log('Speech synthesis not supported, using fallback');
      // Fallback: call onEnd after estimated reading time
      const estimatedTime = Math.max(2000, text.length * 80);
      setTimeout(() => {
        setIsSpeaking(false);
        if (onEnd) {
          onEnd();
        }
      }, estimatedTime);
      
      toast({
        title: "Speech not supported",
        description: "Your browser doesn't support speech playback, skipped speech playback",
        variant: "default",
      });
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">🤖 AI is performing deep voice analysis...</h3>
            <p className="text-gray-600 mb-6">
              Our AI expert is evaluating your pronunciation, vocabulary, fluency and confidence,
              and generating personalized learning recommendations for you
            </p>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '85%'}}></div>
              </div>
              <p className="text-sm text-gray-500">Analyzing {recordings.length} recordings, please wait...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if current question is a reading question
  const isReadingQuestion = currentQ?.section.toLowerCase() === 'reading' || currentQ?.instruction.toLowerCase().includes('read');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="group relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 border border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-700 font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="relative z-10">Back to Selection</span>
            </Button>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {grade} English Speaking Assessment
              </h1>
              <p className="text-gray-600">
                Question {currentQuestion + 1} / {questions.length}
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Progress: {Math.round(progress)}%
            </Badge>
          </div>
          
          <Progress value={progress} className="w-full" />
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {currentQ.instruction}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {currentQ.section}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-4">
                <p className="text-xl font-medium text-gray-900 mb-2">
                  {currentQ.text}
                </p>
                {isSpeaking && (
                  <div className="flex items-center space-x-2 mt-4">
                    <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
                    <span className="text-sm text-blue-600">Playing question...</span>
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-4">
                {!hasRecorded ? (
                  <div>
                    {!isRecording ? (
                      <div className="space-y-4">
                        {/* Only show Listen button for non-Reading questions */}
                        {!isReadingQuestion && (
                          <Button
                            size="lg"
                            onClick={handleListen}
                            disabled={isSpeaking}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg mr-4 disabled:opacity-50"
                          >
                            <Volume2 className="w-6 h-6 mr-2" />
                            {isSpeaking ? 'Playing...' : 'Listen Again'}
                          </Button>
                        )}
                        <Button
                          size="lg"
                          onClick={startRecording}
                          className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg"
                        >
                          <Mic className="w-6 h-6 mr-2" />
                          Start Recording
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xl font-mono">
                            {formatTime(recordingTime)}
                          </span>
                        </div>
                        <Button
                          size="lg"
                          onClick={stopRecording}
                          variant="outline"
                          className="px-8 py-4 text-lg"
                        >
                          <MicOff className="w-6 h-6 mr-2" />
                          Stop Recording
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-4">
                      {!isPlaying ? (
                        <Button
                          size="lg"
                          onClick={playRecording}
                          variant="outline"
                          className="px-6 py-3"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Play Recording
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          onClick={stopPlaying}
                          variant="outline"
                          className="px-6 py-3"
                        >
                          <Pause className="w-5 h-5 mr-2" />
                          Stop Playing
                        </Button>
                      )}
                      
                      <Button
                        size="lg"
                        onClick={resetRecording}
                        variant="outline"
                        className="px-6 py-3"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Re-record
                      </Button>
                    </div>
                    
                    <Button
                      size="lg"
                      onClick={nextQuestion}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                    >
                      {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
