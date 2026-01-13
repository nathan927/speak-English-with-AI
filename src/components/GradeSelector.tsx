import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Volume2, Play, Check } from 'lucide-react';
import { logger } from '@/services/logService';

interface VoiceOption {
  id: string;
  name: string;
  description: string;
  voice: SpeechSynthesisVoice | null;
}

interface GradeSelectorProps {
  onGradeSelect: (grade: string, speechRate: number, voiceId: string) => void;
  onBack: () => void;
}

export const GradeSelector = ({ onGradeSelect, onBack }: GradeSelectorProps) => {
  const [speechRate, setSpeechRate] = useState(0.9);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('default');
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      
      // Preferred voice names for elegant female voices
      const preferredFemale = ['Samantha', 'Karen', 'Moira', 'Tessa', 'Google UK English Female', 'Google US English Female', 'Microsoft Zira', 'Microsoft Hazel', 'Fiona', 'Victoria', 'Allison'];
      const preferredMale = ['Daniel', 'Alex', 'Google UK English Male', 'Google US English Male', 'Microsoft David', 'Microsoft Mark'];
      
      const voiceOptions: VoiceOption[] = [];
      
      // Find best female voice
      let femaleVoice: SpeechSynthesisVoice | null = null;
      for (const name of preferredFemale) {
        const found = englishVoices.find(v => v.name.includes(name));
        if (found) {
          femaleVoice = found;
          break;
        }
      }
      if (!femaleVoice) {
        femaleVoice = englishVoices.find(v => v.name.toLowerCase().includes('female')) || null;
      }
      
      // Find best male voice
      let maleVoice: SpeechSynthesisVoice | null = null;
      for (const name of preferredMale) {
        const found = englishVoices.find(v => v.name.includes(name));
        if (found) {
          maleVoice = found;
          break;
        }
      }
      if (!maleVoice) {
        maleVoice = englishVoices.find(v => v.name.toLowerCase().includes('male') && !v.name.toLowerCase().includes('female')) || null;
      }
      
      // Add default option (system will choose best)
      voiceOptions.push({
        id: 'default',
        name: '自動選擇',
        description: '系統自動選擇最佳女聲',
        voice: femaleVoice
      });
      
      // Add female option if available
      if (femaleVoice) {
        voiceOptions.push({
          id: 'female',
          name: '優雅女聲',
          description: femaleVoice.name,
          voice: femaleVoice
        });
      }
      
      // Add male option if available
      if (maleVoice) {
        voiceOptions.push({
          id: 'male',
          name: '專業男聲',
          description: maleVoice.name,
          voice: maleVoice
        });
      }
      
      // Add some specific regional voices if available
      const ukVoice = englishVoices.find(v => v.lang === 'en-GB');
      const usVoice = englishVoices.find(v => v.lang === 'en-US' && v !== femaleVoice && v !== maleVoice);
      const auVoice = englishVoices.find(v => v.lang === 'en-AU');
      
      if (ukVoice && ukVoice !== femaleVoice && ukVoice !== maleVoice) {
        voiceOptions.push({
          id: 'uk',
          name: '英式發音',
          description: ukVoice.name,
          voice: ukVoice
        });
      }
      
      if (auVoice && auVoice !== femaleVoice && auVoice !== maleVoice) {
        voiceOptions.push({
          id: 'au',
          name: '澳洲發音',
          description: auVoice.name,
          voice: auVoice
        });
      }
      
      setAvailableVoices(voiceOptions);
      logger.info('Loaded voices', { count: voiceOptions.length });
    };

    // Load voices immediately and also when voices change
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleGradeSelect = (grade: string) => {
    logger.info('Grade selected in GradeSelector', { grade, speechRate, voiceId: selectedVoiceId });
    onGradeSelect(grade, speechRate, selectedVoiceId);
  };

  const getSelectedVoice = (voiceId: string): SpeechSynthesisVoice | null => {
    const option = availableVoices.find(v => v.id === voiceId);
    return option?.voice || null;
  };

  const previewVoice = (voiceId: string) => {
    const testText = "Hello! I will be reading the questions for you today. How does my voice sound?";
    
    if ('speechSynthesis' in window) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      
      setPreviewingVoiceId(voiceId);
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(testText);
      const voice = getSelectedVoice(voiceId);
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.lang = 'en-US';
      utterance.rate = speechRate;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setPreviewingVoiceId(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setPreviewingVoiceId(null);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const testSpeechRate = () => {
    const testText = "This is a test of the speech rate. How does this sound to you?";
    setIsSpeaking(true);
    
    if ('speechSynthesis' in window) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(testText);
      const voice = getSelectedVoice(selectedVoiceId);
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.lang = 'en-US';
      utterance.rate = speechRate;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const gradeGroups = [
    {
      title: "幼稚園",
      subtitle: "Kindergarten (K1-K3)",
      description: "遊戲化設計，大按鈕介面，鮮豔色彩",
      grades: ["K1", "K2", "K3"],
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      title: "小學",
      subtitle: "Primary School (P1-P6)", 
      description: "成就徽章，進度追蹤，互動元素",
      grades: ["P1", "P2", "P3", "P4", "P5", "P6"],
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "中學",
      subtitle: "Secondary School (S1-S6)",
      description: "專業分析，詳細報告，自主學習",
      grades: ["S1", "S2", "S3", "S4", "S5", "S6"],
      bgColor: "bg-green-50", 
      borderColor: "border-green-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 md:mb-6 group relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 border border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-700 font-medium px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="relative z-10">返回首頁</span>
          </Button>
          
          <div className="text-center mb-4 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">選擇您的年級</h1>
            <p className="text-gray-600 text-base md:text-lg">根據香港教育體系設計的分級評測</p>
          </div>
        </div>

        {/* Voice Selection Card */}
        <Card className="mb-4 md:mb-6 max-w-2xl mx-auto border-2 border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center text-lg md:text-xl">
              <Volume2 className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-600" />
              選擇語音
            </CardTitle>
            <CardDescription className="text-sm">
              點擊試聽按鈕預覽不同語音效果
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup
              value={selectedVoiceId}
              onValueChange={setSelectedVoiceId}
              className="space-y-3"
            >
              {availableVoices.map((voiceOption) => (
                <div 
                  key={voiceOption.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedVoiceId === voiceOption.id 
                      ? 'border-purple-500 bg-white shadow-sm' 
                      : 'border-gray-200 bg-white/50 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={voiceOption.id} id={voiceOption.id} />
                    <Label htmlFor={voiceOption.id} className="cursor-pointer flex-1">
                      <div className="font-medium text-gray-900">{voiceOption.name}</div>
                      <div className="text-xs text-gray-500">{voiceOption.description}</div>
                    </Label>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => previewVoice(voiceOption.id)}
                    disabled={isSpeaking}
                    className="flex items-center space-x-1 ml-2"
                  >
                    {previewingVoiceId === voiceOption.id ? (
                      <>
                        <Volume2 className="w-3 h-3 animate-pulse" />
                        <span className="text-xs">播放中</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span className="text-xs">試聽</span>
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </RadioGroup>
            
            {selectedVoiceId && (
              <div className="mt-3 flex items-center text-sm text-green-600">
                <Check className="w-4 h-4 mr-1" />
                已選擇：{availableVoices.find(v => v.id === selectedVoiceId)?.name}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Speech Rate Control */}
        <Card className="mb-4 md:mb-8 max-w-2xl mx-auto">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="flex items-center text-lg md:text-xl">
              <Volume2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              語速調節
            </CardTitle>
            <CardDescription className="text-sm">
              調整系統語音播放速度，讓您更舒適地進行測驗
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-xs md:text-sm text-gray-600">
                <span>慢速</span>
                <span>正常</span>
                <span>快速</span>
              </div>
              <Slider
                value={[speechRate]}
                onValueChange={(value) => setSpeechRate(value[0])}
                min={0.5}
                max={1.5}
                step={0.1}
                className="w-full"
              />
              <div className="text-center">
                <Badge variant="outline" className="text-xs">{speechRate.toFixed(1)}x</Badge>
              </div>
            </div>
            <Button 
              onClick={testSpeechRate}
              disabled={isSpeaking}
              variant="outline"
              className="w-full text-sm py-2"
            >
              {isSpeaking ? '播放中...' : '測試語速'}
            </Button>
          </CardContent>
        </Card>

        {/* Grade Selection */}
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-8">
          {gradeGroups.map((group) => (
            <Card key={group.title} className={`${group.bgColor} ${group.borderColor} border-2`}>
              <CardHeader className="text-center pb-3 md:pb-6">
                <CardTitle className="text-xl md:text-2xl text-gray-900">{group.title}</CardTitle>
                <CardDescription className="text-base md:text-lg font-medium text-gray-700">
                  {group.subtitle}
                </CardDescription>
                <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">
                  {group.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
                  {group.grades.map((grade) => (
                    <Button
                      key={grade}
                      onClick={() => handleGradeSelect(grade)}
                      className="h-12 md:h-16 text-base md:text-lg font-semibold bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 text-gray-900 hover:text-white border-2 border-gray-200 hover:border-transparent transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      {grade}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};