import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Mic, MicOff, Play, Pause, RotateCcw, Volume2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { performAIEvaluation } from '@/services/aiEvaluationService';
import { getRandomQuestionSet, type Question } from '@/data/questionBank';
import { buildNaturalQuestion, getCompletionPhrase } from '@/services/conversationService';
import { logger } from '@/services/logService';

interface VoiceTestProps {
  grade: string;
  speechRate: number;
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

export const VoiceTest = ({ grade, speechRate, onComplete, onBack }: VoiceTestProps) => {
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
  const [hasSpokenTransition, setHasSpokenTransition] = useState(false);
  const [showBackConfirmDialog, setShowBackConfirmDialog] = useState(false);
  
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

  const isReadingQuestion = useMemo(() => 
    currentQ?.section.toLowerCase() === 'reading' || 
    currentQ?.instruction.toLowerCase().includes('read') || 
    currentQ?.section === 'B. 朗讀',
    [currentQ]
  );

  // Check if current grade is kindergarten (K1, K2, K3) - disable transitions for these
  const isKindergarten = useMemo(() => ['K1', 'K2', 'K3'].includes(grade), [grade]);

  useEffect(() => {
    logger.info('VoiceTest component mounted', {
      grade,
      speechRate,
      questionsCount: questions.length,
      isKindergarten
    }, 'VoiceTest', 'mount');

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        logger.debug('Speech synthesis cancelled on unmount', {}, 'VoiceTest', 'cleanup');
      }
    };
  }, []);

  // 簮化 useEffect，處理題目切換和過渡句
  useEffect(() => {
    logger.questionLog(currentQuestion, currentQ, 'changed');
    
    // 重置過渡句標記
    setHasSpokenTransition(false);
    
    // 對於非閱讀題目，自動開始監聽，但不自動說話
    if (currentQ && !isReadingQuestion && !hasRecorded) {
      const autoListenTimeout = setTimeout(() => {
        logger.debug('Auto-triggering listen for non-reading question', {
          currentQuestion,
          hasRecorded
        }, 'VoiceTest', 'autoListen');
        handleListen();
      }, 500);
      return () => clearTimeout(autoListenTimeout);
    }
  }, [currentQuestion, hasRecorded]);

  const handleBackClick = () => {
    if (isRecording || recordings.length > 0) {
      setShowBackConfirmDialog(true);
    } else {
      onBack();
    }
  };

  const confirmBack = () => {
    setShowBackConfirmDialog(false);
    onBack();
  };

  const cancelBack = () => {
    setShowBackConfirmDialog(false);
  };

  const handleListen = () => {
    logger.info('Listen button clicked', {
      currentQuestion,
      questionText: currentQ?.text?.substring(0, 50),
      speechSynthesisAvailable: 'speechSynthesis' in window,
      currentlySpeaking: speechSynthesis?.speaking
    }, 'VoiceTest', 'listenClicked');
    
    if (currentQ) {
      setIsSpeaking(true);
      
      let speechText: string;
      
      // 針對誦讀題，只說指示句
      if (isReadingQuestion) {
        speechText = "Please read the following text aloud.";
        logger.info('Using simplified reading instruction', {
          speechText,
          isReadingQuestion: true
        }, 'VoiceTest', 'readingInstruction');
      } else {
        // 對於非誦讀題，如果是切換後第一次說話且還沒說過過渡句，先說過渡句（但排除幼稚園）
        if (currentQuestion > 0 && !hasSpokenTransition && !isKindergarten) {
          const completionPhrase = getCompletionPhrase();
          speechText = completionPhrase + ' ' + buildNaturalQuestion(currentQ.text, false, currentQuestion === questions.length - 1, grade);
          setHasSpokenTransition(true);
        } else {
          // Build natural conversation text with grade context
          const isFirst = currentQuestion === 0;
          const isLast = currentQuestion === questions.length - 1;
          speechText = buildNaturalQuestion(currentQ.text, isFirst, isLast, grade);
        }
      }
      
      logger.info('Speech text prepared', {
        speechText,
        textLength: speechText.length,
        hasSpokenTransition,
        currentQuestion,
        isKindergarten
      }, 'VoiceTest', 'textPrepared');
      
      speakText(speechText, () => {
        questionReadTimeRef.current = Date.now();
        setIsSpeaking(false);
        logger.info('Speech completed, question read time set', {
          questionReadTime: questionReadTimeRef.current,
          currentQuestion
        }, 'VoiceTest', 'speechCompleted');
        
        // Auto-start recording after speech completes with shorter delay (EXCLUDE Reading questions)
        if (!isReadingQuestion) {
          setTimeout(() => {
            logger.debug('Auto-starting recording after speech', {
              delay: 300,
              currentQuestion
            }, 'VoiceTest', 'autoRecord');
            startRecording();
          }, 300); // Reduced delay from 1000ms to 300ms for faster conversation
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
    if (!audioBlob) return;
    
    logger.info('Moving to next question', {
      currentQuestion,
      totalQuestions: questions.length,
      hasAudioBlob: !!audioBlob,
      recordingTime
    }, 'VoiceTest', 'nextQuestion');
    
    // 保存錄音資料
    const responseTime = responseStartTime && questionReadTimeRef.current > 0
      ? responseStartTime - questionReadTimeRef.current
      : 0;

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

    logger.debug('Recording data saved', {
      questionId: recordingData.questionId,
      section: recordingData.section,
      duration: recordingData.duration,
      responseTime: recordingData.responseTime,
      totalRecordings: newRecordings.length
    }, 'VoiceTest', 'recordingSaved');

    if (currentQuestion < questions.length - 1) {
      // 直接切換題目，不說過渡句（過渡句會在新題目的 handleListen 中說）
      setCurrentQuestion(prev => prev + 1);
      resetRecording();
      questionReadTimeRef.current = 0;
    } else {
      logger.info('Test completed, starting analysis', {
        totalRecordings: newRecordings.length
      }, 'VoiceTest', 'testCompleted');
      completeTest(newRecordings);
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
    logger.speechLog('speakText_called', {
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      textLength: text.length,
      speechRate,
      hasOnEndCallback: !!onEnd,
      currentlySpeaking: speechSynthesis?.speaking,
      speechSynthesisState: {
        speaking: speechSynthesis?.speaking,
        pending: speechSynthesis?.pending,
        paused: speechSynthesis?.paused
      }
    });
    
    // Clear any existing timeout
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      logger.debug('Cleared existing speech timeout', {}, 'VoiceTest', 'timeoutCleared');
    }
    
    if ('speechSynthesis' in window) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        logger.warn('Cancelled existing speech synthesis', {}, 'VoiceTest', 'speechCancelled');
      }
      
      const timeoutDuration = Math.max(5000, text.length * 200 / speechRate);
      speechTimeoutRef.current = setTimeout(() => {
        logger.warn('Speech timeout triggered - force completing', {
          timeoutDuration,
          textLength: text.length,
          speechRate
        }, 'VoiceTest', 'speechTimeout');
        setIsSpeaking(false);
        if (onEnd) {
          onEnd();
        }
      }, timeoutDuration);
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = speechRate;
        utterance.volume = 1.0;
        
        utterance.onstart = () => {
          logger.speechLog('speech_started', {
            text: text.substring(0, 50) + '...',
            rate: speechRate,
            volume: utterance.volume,
            lang: utterance.lang
          });
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          logger.speechLog('speech_ended_normally', {
            text: text.substring(0, 50) + '...',
            duration: Date.now() - (speechTimeoutRef.current ? 0 : Date.now())
          });
          if (speechTimeoutRef.current) {
            clearTimeout(speechTimeoutRef.current);
          }
          setIsSpeaking(false);
          if (onEnd) {
            onEnd();
          }
        };
        
        utterance.onerror = (event) => {
          logger.speechLog('speech_error', {
            error: event.error,
            text: text.substring(0, 50) + '...',
            errorEvent: event
          });
          if (speechTimeoutRef.current) {
            clearTimeout(speechTimeoutRef.current);
          }
          setIsSpeaking(false);
          if (onEnd) {
            onEnd();
          }
        };
        
        logger.speechLog('speech_synthesis_speak_called', {
          utteranceReady: true,
          text: text.substring(0, 50) + '...'
        });
        
        speechSynthesis.speak(utterance);
      }, 150);
    } else {
      logger.error('Speech synthesis not supported, using fallback', {
        textLength: text.length,
        fallbackDuration: Math.max(2000, text.length * 80)
      }, 'VoiceTest', 'speechNotSupported');
      
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">🤖 AI is performing deep voice analysis...</h3>
            <p className="text-sm text-gray-600 mb-4">
              Our AI expert is evaluating your pronunciation, vocabulary, fluency and confidence,
              and generating personalized learning recommendations for you
            </p>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '85%'}}></div>
              </div>
              <p className="text-xs text-gray-500">Analyzing {recordings.length} recordings, please wait...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-3 py-3 md:px-4 md:py-8">
        {/* Compressed header for mobile */}
        <div className="mb-3 md:mb-8">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <Button 
              variant="ghost" 
              onClick={handleBackClick}
              className="group relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 border border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-700 font-medium px-3 py-2 md:px-6 md:py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <ArrowLeft className="w-4 h-4 mr-1 md:mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="relative z-10 text-sm md:text-base">Back</span>
            </Button>
          </div>
          
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                {grade} English Assessment
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Question {currentQuestion + 1} / {questions.length}
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
              {Math.round(progress)}%
            </Badge>
          </div>
          
          <Progress value={progress} className="w-full h-2" />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Compressed recording instructions for mobile */}
          <Card className="mb-2 md:mb-4 bg-blue-50 border-blue-200">
            <CardContent className="p-2 md:p-4">
              <div className="flex items-start space-x-2 md:space-x-3">
                <Info className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs md:text-sm text-blue-800">
                  <p className="font-medium mb-1">錄音提示：</p>
                  <p>系統會自動按下 「Start Recording」 模擬真人對話，請盡快回答</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-3 md:mb-6">
            <CardHeader className="pb-3 md:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg">
                  {/* Show question number or reading instruction */}
                  {(currentQ.section === 'B. 朗讀' || (currentQ.instruction && currentQ.instruction.includes('朗讀')))
                    ? 'Please read the following text aloud'
                    : `Question ${currentQuestion + 1}`}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {/* Convert section names to English */}
                  {currentQ.section === 'A. 自發表達' ? 'Speaking' :
                   currentQ.section === 'B. 朗讀' ? 'Reading' :
                   currentQ.section === 'C. 個人資料' ? 'Personal' :
                   currentQ.section}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 md:p-10 mb-4 md:mb-6">
                <p className="text-lg md:text-2xl font-bold text-gray-900 mb-3 leading-relaxed">
                  {currentQ.text}
                </p>
                {isSpeaking && (
                  <div className="flex items-center space-x-2 mt-3">
                    <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
                    <span className="text-xs md:text-sm text-blue-600">Playing question...</span>
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-5 md:space-y-6">
                {!hasRecorded ? (
                  <div>
                    {!isRecording ? (
                      <div className="space-y-3 md:space-y-4">
                        {/* Only show Listen button for non-Reading questions */}
                        {!isReadingQuestion && (
                          <Button
                            size="sm"
                            onClick={handleListen}
                            disabled={isSpeaking}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-8 md:py-4 text-sm md:text-lg mr-2 md:mr-4 disabled:opacity-50"
                          >
                            <Volume2 className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2" />
                            {isSpeaking ? 'Playing...' : 'Listen Again'}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={startRecording}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 md:px-8 md:py-4 text-sm md:text-lg"
                        >
                          <Mic className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2" />
                          Start Recording
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center justify-center space-x-2 md:space-x-4">
                          <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-lg md:text-xl font-mono">
                            {formatTime(recordingTime)}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={stopRecording}
                          variant="outline"
                          className="px-4 py-2 md:px-8 md:py-4 text-sm"
                        >
                          <MicOff className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2" />
                          Stop Recording
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-center space-x-2 md:space-x-4">
                      {!isPlaying ? (
                        <Button
                          size="sm"
                          onClick={playRecording}
                          variant="outline"
                          className="px-3 py-2 md:px-6 md:py-3 text-sm"
                        >
                          <Play className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                          Play
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={stopPlaying}
                          variant="outline"
                          className="px-3 py-2 md:px-6 md:py-3 text-sm"
                        >
                          <Pause className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                          Stop
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        onClick={resetRecording}
                        variant="outline"
                        className="px-3 py-2 md:px-6 md:py-3 text-sm"
                      >
                        <RotateCcw className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                        Re-record
                      </Button>
                    </div>
                    
                    <Button
                      size="lg"
                      onClick={nextQuestion}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 md:px-16 md:py-5 text-lg md:text-xl"
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

      {/* Back Confirmation Dialog */}
      <Dialog open={showBackConfirmDialog} onOpenChange={setShowBackConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認離開測驗</DialogTitle>
            <DialogDescription>
              您正在進行測驗中，如果現在離開，您的進度將會遺失。確定要離開嗎？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelBack}>
              繼續測驗
            </Button>
            <Button variant="destructive" onClick={confirmBack}>
              確定離開
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
