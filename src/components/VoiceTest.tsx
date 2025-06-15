
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mic, MicOff, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceTestProps {
  grade: string;
  onComplete: (results: any) => void;
  onBack: () => void;
}

export const VoiceTest = ({ grade, onComplete, onBack }: VoiceTestProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  // 測試題目數據
  const getQuestionsForGrade = (grade: string) => {
    const hkElements = ['MTR', '維港', '中秋節', '點心', '茶餐廳', '太平山頂'];
    
    const baseQuestions = {
      'K1': [
        { id: 1, type: 'word', text: 'apple', instruction: '請說出這個詞語', hkElement: '' },
        { id: 2, type: 'sentence', text: 'I like milk tea', instruction: '請跟著說這句話', hkElement: '奶茶' },
        { id: 3, type: 'describe', text: '描述你看到的紅色巴士', instruction: '用英語描述', hkElement: '巴士' },
        { id: 4, type: 'question', text: 'What is your name?', instruction: '回答這個問題', hkElement: '' },
        { id: 5, type: 'story', text: '說說你在公園玩的經歷', instruction: '用英語講述', hkElement: '公園' },
        { id: 6, type: 'rhyme', text: 'Twinkle, twinkle, little star', instruction: '跟著唸兒歌', hkElement: '' }
      ],
      'P1': [
        { id: 1, type: 'word', text: 'school', instruction: '請清楚說出這個詞語', hkElement: '' },
        { id: 2, type: 'sentence', text: 'I go to school by MTR', instruction: '請跟著說這句話', hkElement: 'MTR' },
        { id: 3, type: 'describe', text: '描述香港的天氣', instruction: '用英語描述今天的天氣', hkElement: '香港天氣' },
        { id: 4, type: 'question', text: 'What do you eat for breakfast?', instruction: '回答這個問題', hkElement: '' },
        { id: 5, type: 'story', text: '說說你在茶餐廳的經歷', instruction: '用英語講述', hkElement: '茶餐廳' },
        { id: 6, type: 'roleplay', text: '你是店員，歡迎客人', instruction: '角色扮演', hkElement: '購物' }
      ],
      'S1': [
        { id: 1, type: 'pronunciation', text: 'international', instruction: '請清楚說出這個較複雜的詞語', hkElement: '' },
        { id: 2, type: 'sentence', text: 'Hong Kong is famous for its Victoria Harbour', instruction: '請流利地說出這句話', hkElement: '維港' },
        { id: 3, type: 'describe', text: '描述中秋節的慶祝活動', instruction: '用英語詳細描述', hkElement: '中秋節' },
        { id: 4, type: 'opinion', text: 'What do you think about online learning?', instruction: '表達你的看法', hkElement: '' },
        { id: 5, type: 'presentation', text: '介紹香港的特色小食', instruction: '做一個簡短演講', hkElement: '點心' },
        { id: 6, type: 'debate', text: '討論太平山頂是否值得遊覽', instruction: '提出論點', hkElement: '太平山頂' }
      ]
    };

    return baseQuestions[grade as keyof typeof baseQuestions] || baseQuestions['P1'];
  };

  const questions = getQuestionsForGrade(grade);
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setHasRecorded(true);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('錄音啟動失敗:', error);
      toast({
        title: "錄音失敗",
        description: "請確保已允許麥克風權限",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
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
    stopPlaying();
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      resetRecording();
    } else {
      completeTest();
    }
  };

  const completeTest = () => {
    setIsAnalyzing(true);
    
    // 模擬分析過程
    setTimeout(() => {
      const mockResults = {
        overallScore: Math.floor(Math.random() * 20) + 80, // 80-100分
        pronunciation: Math.floor(Math.random() * 20) + 75,
        vocabulary: Math.floor(Math.random() * 20) + 78,
        fluency: Math.floor(Math.random() * 20) + 72,
        confidence: Math.floor(Math.random() * 20) + 85,
        grade: grade,
        questionsAttempted: questions.length,
        strengths: ['發音清晰', '詞彙運用恰當', '表達自信'],
        improvements: ['語速可以稍微加快', '可以增加更多連接詞'],
        detailedAnalysis: questions.map((q, index) => ({
          question: q.text,
          score: Math.floor(Math.random() * 20) + 70,
          feedback: '整體表現良好，建議多練習流暢度'
        }))
      };
      
      setIsAnalyzing(false);
      setTestCompleted(true);
      onComplete(mockResults);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">正在分析您的錄音...</h3>
            <p className="text-gray-600 mb-6">AI正在評估您的發音、詞彙、流暢度和自信程度</p>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
              <p className="text-sm text-gray-500">分析中... 請稍候</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 hover:bg-white/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回選擇
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {grade} 英語口語測試
              </h1>
              <p className="text-gray-600">
                題目 {currentQuestion + 1} / {questions.length}
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              進度: {Math.round(progress)}%
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakText(currentQ.text)}
                  className="shrink-0"
                >
                  <Volume2 className="w-4 h-4 mr-1" />
                  發音
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-4">
                <p className="text-xl font-medium text-gray-900 mb-2">
                  "{currentQ.text}"
                </p>
                {currentQ.hkElement && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    香港元素: {currentQ.hkElement}
                  </Badge>
                )}
              </div>
              
              <div className="text-center space-y-4">
                {!hasRecorded ? (
                  <div>
                    {!isRecording ? (
                      <Button
                        size="lg"
                        onClick={startRecording}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg"
                      >
                        <Mic className="w-6 h-6 mr-2" />
                        開始錄音
                      </Button>
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
                          停止錄音
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
                          播放錄音
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          onClick={stopPlaying}
                          variant="outline"
                          className="px-6 py-3"
                        >
                          <Pause className="w-5 h-5 mr-2" />
                          停止播放
                        </Button>
                      )}
                      
                      <Button
                        size="lg"
                        onClick={resetRecording}
                        variant="outline"
                        className="px-6 py-3"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        重新錄音
                      </Button>
                    </div>
                    
                    <Button
                      size="lg"
                      onClick={nextQuestion}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                    >
                      {currentQuestion === questions.length - 1 ? '完成測試' : '下一題'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 提示卡片 */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 錄音提示：</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 請在安靜的環境中進行錄音</li>
                <li>• 說話時保持自然語速，不要過快或過慢</li>
                <li>• 如果不滿意可以重新錄音</li>
                <li>• 錄音完成後可以播放檢查</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
