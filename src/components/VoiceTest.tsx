import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Mic, MicOff, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { getRandomQuestionSet, Question } from '@/data/questionBank';
import { performAIEvaluation } from '@/services/aiEvaluationService';

const VoiceTest: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showQuestions, setShowQuestions] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    let mediaRecorder: MediaRecorder | null = null;

    const initRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(blob);
          setAudioURL(url);
          stream.getTracks().forEach(track => track.stop());
        };
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast.error('Error accessing microphone');
      }
    };

    initRecorder();

    return () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedGrade) {
      const gradeQuestions = getRandomQuestionSet(selectedGrade);
      setQuestions(gradeQuestions);
      setCurrentQuestionIndex(0);
      setAudioURL('');
      setEvaluation('');
    }
  }, [selectedGrade]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Error accessing microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    setAudioURL('');
    setEvaluation('');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetRecording();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetRecording();
    }
  };

  const evaluateResponse = async () => {
    if (!audioURL || !questions[currentQuestionIndex]) {
      toast.error('No recording or question available for evaluation');
      return;
    }

    setIsEvaluating(true);
    try {
      const question = questions[currentQuestionIndex];
      const evaluation = await performAIEvaluation(audioURL, question.text, selectedGrade);
      setEvaluation(evaluation);
      toast.success('Evaluation completed');
    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error('Failed to evaluate response');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Voice Test Assessment</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Show Questions</span>
              <Switch 
                checked={showQuestions} 
                onCheckedChange={setShowQuestions}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Grade Level:</label>
            <select 
              value={selectedGrade} 
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Choose a grade...</option>
              <option value="K1">K1</option>
              <option value="K2">K2</option>
              <option value="K3">K3</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
              <option value="P4">P4</option>
              <option value="P5">P5</option>
              <option value="P6">P6</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
              <option value="S4">S4</option>
              <option value="S5">S5</option>
              <option value="S6">S6</option>
            </select>
          </div>

          {questions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
                <Badge variant="secondary">
                  {currentQuestion?.section}
                </Badge>
              </div>

              <Card className="p-4">
                <div className="space-y-3">
                  {(showQuestions || currentQuestion?.type === 'reading') && (
                    <div>
                      <p className="text-lg font-medium">{currentQuestion?.text}</p>
                      <Button
                        onClick={() => handleTextToSpeech(currentQuestion?.text || '')}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Read Question
                      </Button>
                    </div>
                  )}
                  
                  {currentQuestion?.readingPassage && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
                      <h4 className="font-semibold mb-2">Reading Passage:</h4>
                      <div className="text-sm leading-relaxed whitespace-pre-line">
                        {currentQuestion.readingPassage}
                      </div>
                      <Button
                        onClick={() => handleTextToSpeech(currentQuestion?.readingPassage || '')}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Read Passage
                      </Button>
                    </div>
                  )}

                  {!showQuestions && currentQuestion?.type !== 'reading' && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Question hidden - Listen for the question or turn on "Show Questions"</p>
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "default"}
                  className="flex-1"
                >
                  {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>

                {audioURL && (
                  <>
                    <Button
                      onClick={isPlaying ? pauseAudio : playAudio}
                      variant="outline"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Button
                      onClick={resetRecording}
                      variant="outline"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      onClick={evaluateResponse}
                      disabled={isEvaluating}
                      variant="secondary"
                    >
                      {isEvaluating ? 'Evaluating...' : 'Get AI Evaluation'}
                    </Button>
                  </>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                >
                  Previous Question
                </Button>
                <Button
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  variant="outline"
                >
                  Next Question
                </Button>
              </div>

              {evaluation && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <h4 className="font-semibold mb-2">AI Evaluation:</h4>
                  <p className="text-sm">{evaluation}</p>
                </Card>
              )}

              {audioURL && (
                <audio
                  ref={audioRef}
                  src={audioURL}
                  onEnded={() => setIsPlaying(false)}
                  style={{ display: 'none' }}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceTest;
