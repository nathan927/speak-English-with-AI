import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Play, Pause, RotateCcw, ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';
import { getRandomQuestionSet } from '@/data/questionBank';
import { logger } from '@/services/logService';
import { performAIEvaluation } from '@/services/aiEvaluationService';

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
  onShowQuestionsChange,
}) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudios, setRecordedAudios] = useState<{ [key: number]: Blob }>({});
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const questionSet = getRandomQuestionSet(grade);
    if (questionSet.length > 0) {
      setQuestions(questionSet);
      logger.info('Questions loaded for test', { grade, questionCount: questionSet.length });
    }
  }, [grade]);

  useEffect(() => {
    return () => {
      // Cleanup when the component unmounts
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [mediaRecorder]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const handleAudioPlayback = (index: number) => {
    const audio = new Audio(URL.createObjectURL(recordedAudios[index]));
    audio.play();
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handlePlayQuestion = async () => {
    if (!currentQuestion) return;

    try {
      setIsPlaying(true);
      // For now, we'll use browser's speech synthesis as a fallback
      const utterance = new SpeechSynthesisUtterance(currentQuestion.text);
      utterance.rate = speechRate;
      utterance.onend = () => {
        setIsPlaying(false);
      };
      speechSynthesis.speak(utterance);
    } catch (error) {
      logger.error('Error playing question audio', error);
      setIsPlaying(false);
    }
  };

  const startRecording = async () => {
    logger.info('Recording started', { question: currentQuestion?.id });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setIsRecording(true);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedAudios((prevAudios) => ({
          ...prevAudios,
          [currentQuestionIndex]: audioBlob,
        }));
        stream.getTracks().forEach(track => track.stop());
        logger.info('Recording stopped', { question: currentQuestion?.id, size: audioBlob.size });
      };

      recorder.start();
    } catch (error) {
      logger.error('Error starting recording', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      logger.info('Stopping recording', { question: currentQuestion?.id });
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      logger.info('Pausing recording', { question: currentQuestion?.id });
      mediaRecorder.pause();
      setIsPaused(true);
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      logger.info('Resuming recording', { question: currentQuestion?.id });
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRecordingTime(0);
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setRecordingTime(0);
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const completeTest = async () => {
    logger.info('Completing test', { grade });
    const testResults: any = {};

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const audioBlob = recordedAudios[i];

      if (audioBlob) {
        try {
          const responseText = responses[i] || 'No response recorded.';
          // Create recording data for AI evaluation
          const recordingData = {
            questionId: i,
            section: question.section,
            question: question.text,
            audioBlob: audioBlob,
            timestamp: new Date().toISOString(),
            duration: recordingTime,
            wordCount: Math.max(1, Math.floor(recordingTime / 0.8)),
            responseTime: 3000 // Default response time
          };
          
          const evaluation = await performAIEvaluation([recordingData], grade);
          testResults[question.id] = {
            question: question.text,
            responseText: responseText,
            evaluation: evaluation,
          };
        } catch (error) {
          logger.error('Error evaluating response', { questionId: question.id, error });
          testResults[question.id] = {
            question: question.text,
            responseText: 'Error evaluating response.',
            evaluation: null,
          };
        }
      } else {
        testResults[question.id] = {
          question: question.text,
          responseText: 'No audio recorded.',
          evaluation: null,
        };
      }
    }

    onComplete(testResults);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">載入題目中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-questions"
                checked={showQuestions}
                onCheckedChange={onShowQuestionsChange}
              />
              <Label htmlFor="show-questions">顯示題目</Label>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">進度</span>
            <span className="text-sm text-gray-600">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                題目 {currentQuestionIndex + 1}
              </CardTitle>
              <Badge variant="secondary">
                {currentQuestion?.section}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Question Text - Only show if showQuestions is true OR if it's not a reading question */}
            {(showQuestions || currentQuestion?.type !== 'reading') && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-medium text-blue-900">
                  {currentQuestion?.text}
                </p>
              </div>
            )}

            {/* Reading Passage - Always show for reading type questions */}
            {currentQuestion?.type === 'reading' && currentQuestion?.readingPassage && (
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-800 mb-2">閱讀段落:</h4>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {currentQuestion.readingPassage}
                </div>
              </div>
            )}

            {/* Audio Controls */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePlayQuestion}
                disabled={isPlaying}
                variant="outline"
                size="sm"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {isPlaying ? '播放中...' : '播放題目'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recording Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>錄音控制</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-medium">
                錄音時間: {recordingTime} 秒
              </div>
              <div className="flex items-center space-x-2">
                {isRecording ? (
                  isPaused ? (
                    <Button
                      onClick={resumeRecording}
                      disabled={!mediaRecorder}
                      variant="secondary"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      繼續
                    </Button>
                  ) : (
                    <Button
                      onClick={pauseRecording}
                      disabled={!mediaRecorder}
                      variant="secondary"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      暫停
                    </Button>
                  )
                ) : null}

                {isRecording ? (
                  <Button
                    onClick={stopRecording}
                    disabled={!mediaRecorder}
                    variant="destructive"
                  >
                    <MicOff className="w-4 h-4 mr-2" />
                    停止
                  </Button>
                ) : (
                  <Button onClick={startRecording} variant="secondary">
                    <Mic className="w-4 h-4 mr-2" />
                    開始錄音
                  </Button>
                )}
              </div>
            </div>

            {recordedAudios[currentQuestionIndex] && (
              <div className="mt-4">
                <Button
                  onClick={() => handleAudioPlayback(currentQuestionIndex)}
                  variant="outline"
                >
                  <Play className="w-4 h-4 mr-2" />
                  播放錄音
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            上一題
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={completeTest}
              className="bg-green-600 hover:bg-green-700"
            >
              完成測驗
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              下一題
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default VoiceTest;
