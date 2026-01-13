import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Volume2, Play, Check, Settings as SettingsIcon, Mic } from 'lucide-react';
import { logger } from '@/services/logService';

interface VoiceOption {
  id: string;
  name: string;
  description: string;
  voice: SpeechSynthesisVoice | null;
  category: 'female' | 'male' | 'regional';
}

const Settings = () => {
  const navigate = useNavigate();
  const [speechRate, setSpeechRate] = useState(() => {
    const saved = localStorage.getItem('speechRate');
    return saved ? parseFloat(saved) : 0.9;
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(() => {
    return localStorage.getItem('selectedVoiceId') || 'default';
  });
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('speechRate', speechRate.toString());
  }, [speechRate]);

  useEffect(() => {
    localStorage.setItem('selectedVoiceId', selectedVoiceId);
  }, [selectedVoiceId]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      
      // Enhanced preferred voice names for elegant female voices
      const preferredFemale = [
        'Samantha', 'Karen', 'Moira', 'Tessa', 'Fiona', 'Victoria', 'Allison',
        'Google UK English Female', 'Google US English Female',
        'Microsoft Zira', 'Microsoft Hazel', 'Microsoft Susan', 'Microsoft Catherine',
        'Siri Female', 'Ellen', 'Serena', 'Nicky', 'Veena', 'Ava'
      ];
      const preferredMale = [
        'Daniel', 'Alex', 'Tom', 'Oliver', 'James', 'Arthur',
        'Google UK English Male', 'Google US English Male',
        'Microsoft David', 'Microsoft Mark', 'Microsoft George', 'Microsoft Richard',
        'Siri Male', 'Thomas', 'Lee', 'Ralph'
      ];
      
      const voiceOptions: VoiceOption[] = [];
      
      // Find all available female voices
      const femaleVoices: SpeechSynthesisVoice[] = [];
      for (const name of preferredFemale) {
        const found = englishVoices.find(v => v.name.includes(name) && !femaleVoices.includes(v));
        if (found) {
          femaleVoices.push(found);
        }
      }
      // Also add any with 'female' in name
      const otherFemale = englishVoices.filter(v => 
        v.name.toLowerCase().includes('female') && !femaleVoices.includes(v)
      );
      femaleVoices.push(...otherFemale);
      
      // Find all available male voices
      const maleVoices: SpeechSynthesisVoice[] = [];
      for (const name of preferredMale) {
        const found = englishVoices.find(v => v.name.includes(name) && !maleVoices.includes(v));
        if (found) {
          maleVoices.push(found);
        }
      }
      // Also add any with 'male' in name (but not 'female')
      const otherMale = englishVoices.filter(v => 
        v.name.toLowerCase().includes('male') && 
        !v.name.toLowerCase().includes('female') && 
        !maleVoices.includes(v)
      );
      maleVoices.push(...otherMale);
      
      // Add default option (system will choose best female)
      voiceOptions.push({
        id: 'default',
        name: '自動選擇 (Auto)',
        description: '系統自動選擇最佳女聲',
        voice: femaleVoices[0] || englishVoices[0] || null,
        category: 'female'
      });
      
      // Add all female voices
      femaleVoices.forEach((voice, index) => {
        const shortName = voice.name.split(' ').slice(0, 2).join(' ');
        voiceOptions.push({
          id: `female-${index}`,
          name: `👩 ${shortName}`,
          description: `${voice.name} (${voice.lang})`,
          voice: voice,
          category: 'female'
        });
      });
      
      // Add all male voices
      maleVoices.forEach((voice, index) => {
        const shortName = voice.name.split(' ').slice(0, 2).join(' ');
        voiceOptions.push({
          id: `male-${index}`,
          name: `👨 ${shortName}`,
          description: `${voice.name} (${voice.lang})`,
          voice: voice,
          category: 'male'
        });
      });
      
      // Add regional accent voices
      const ukVoices = englishVoices.filter(v => v.lang === 'en-GB' && !femaleVoices.includes(v) && !maleVoices.includes(v));
      const usVoices = englishVoices.filter(v => v.lang === 'en-US' && !femaleVoices.includes(v) && !maleVoices.includes(v));
      const auVoices = englishVoices.filter(v => v.lang === 'en-AU' && !femaleVoices.includes(v) && !maleVoices.includes(v));
      const ieVoices = englishVoices.filter(v => v.lang === 'en-IE' && !femaleVoices.includes(v) && !maleVoices.includes(v));
      const inVoices = englishVoices.filter(v => v.lang === 'en-IN' && !femaleVoices.includes(v) && !maleVoices.includes(v));
      
      ukVoices.slice(0, 3).forEach((voice, index) => {
        voiceOptions.push({
          id: `uk-${index}`,
          name: `🇬🇧 英式 ${index + 1}`,
          description: `${voice.name}`,
          voice: voice,
          category: 'regional'
        });
      });
      
      usVoices.slice(0, 3).forEach((voice, index) => {
        voiceOptions.push({
          id: `us-${index}`,
          name: `🇺🇸 美式 ${index + 1}`,
          description: `${voice.name}`,
          voice: voice,
          category: 'regional'
        });
      });
      
      auVoices.slice(0, 2).forEach((voice, index) => {
        voiceOptions.push({
          id: `au-${index}`,
          name: `🇦🇺 澳洲 ${index + 1}`,
          description: `${voice.name}`,
          voice: voice,
          category: 'regional'
        });
      });
      
      ieVoices.slice(0, 1).forEach((voice, index) => {
        voiceOptions.push({
          id: `ie-${index}`,
          name: `🇮🇪 愛爾蘭`,
          description: `${voice.name}`,
          voice: voice,
          category: 'regional'
        });
      });
      
      inVoices.slice(0, 1).forEach((voice, index) => {
        voiceOptions.push({
          id: `in-${index}`,
          name: `🇮🇳 印度`,
          description: `${voice.name}`,
          voice: voice,
          category: 'regional'
        });
      });
      
      setAvailableVoices(voiceOptions);
      logger.info('Loaded voices for settings', { count: voiceOptions.length });
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

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

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setPreviewingVoiceId(null);
    }
  };

  const femaleVoices = availableVoices.filter(v => v.category === 'female');
  const maleVoices = availableVoices.filter(v => v.category === 'male');
  const regionalVoices = availableVoices.filter(v => v.category === 'regional');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 group relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 border border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-700 font-medium px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首頁
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">設定</h1>
            <p className="text-gray-600">調整語音和語速設定</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Speech Rate Control */}
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg md:text-xl">
                <Volume2 className="w-5 h-5 mr-2 text-blue-600" />
                語速調節
              </CardTitle>
              <CardDescription>
                調整系統語音播放速度
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>慢速 (0.5x)</span>
                  <span>正常 (1.0x)</span>
                  <span>快速 (1.5x)</span>
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
                  <Badge variant="outline" className="text-base px-4 py-1">{speechRate.toFixed(1)}x</Badge>
                </div>
              </div>
              <Button 
                onClick={isSpeaking ? stopSpeaking : testSpeechRate}
                variant="outline"
                className="w-full"
              >
                {isSpeaking ? '⏹️ 停止' : '▶️ 測試語速'}
              </Button>
            </CardContent>
          </Card>

          {/* Voice Selection - Female */}
          <Card className="border-2 border-pink-200 bg-pink-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg md:text-xl">
                <Mic className="w-5 h-5 mr-2 text-pink-600" />
                選擇語音 - 女聲
              </CardTitle>
              <CardDescription>
                點擊試聽按鈕預覽語音效果
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedVoiceId}
                onValueChange={setSelectedVoiceId}
                className="space-y-2"
              >
                {femaleVoices.map((voiceOption) => (
                  <div 
                    key={voiceOption.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedVoiceId === voiceOption.id 
                        ? 'border-pink-500 bg-white shadow-sm' 
                        : 'border-gray-200 bg-white/50 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <RadioGroupItem value={voiceOption.id} id={voiceOption.id} />
                      <Label htmlFor={voiceOption.id} className="cursor-pointer flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{voiceOption.name}</div>
                        <div className="text-xs text-gray-500 truncate">{voiceOption.description}</div>
                      </Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => previewVoice(voiceOption.id)}
                      disabled={isSpeaking && previewingVoiceId !== voiceOption.id}
                      className="flex items-center space-x-1 ml-2 shrink-0"
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
            </CardContent>
          </Card>

          {/* Voice Selection - Male */}
          {maleVoices.length > 0 && (
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg md:text-xl">
                  <Mic className="w-5 h-5 mr-2 text-blue-600" />
                  選擇語音 - 男聲
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedVoiceId}
                  onValueChange={setSelectedVoiceId}
                  className="space-y-2"
                >
                  {maleVoices.map((voiceOption) => (
                    <div 
                      key={voiceOption.id}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedVoiceId === voiceOption.id 
                          ? 'border-blue-500 bg-white shadow-sm' 
                          : 'border-gray-200 bg-white/50 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <RadioGroupItem value={voiceOption.id} id={voiceOption.id} />
                        <Label htmlFor={voiceOption.id} className="cursor-pointer flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{voiceOption.name}</div>
                          <div className="text-xs text-gray-500 truncate">{voiceOption.description}</div>
                        </Label>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => previewVoice(voiceOption.id)}
                        disabled={isSpeaking && previewingVoiceId !== voiceOption.id}
                        className="flex items-center space-x-1 ml-2 shrink-0"
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
              </CardContent>
            </Card>
          )}

          {/* Voice Selection - Regional */}
          {regionalVoices.length > 0 && (
            <Card className="border-2 border-green-200 bg-green-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg md:text-xl">
                  <Mic className="w-5 h-5 mr-2 text-green-600" />
                  選擇語音 - 地區口音
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedVoiceId}
                  onValueChange={setSelectedVoiceId}
                  className="space-y-2"
                >
                  {regionalVoices.map((voiceOption) => (
                    <div 
                      key={voiceOption.id}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedVoiceId === voiceOption.id 
                          ? 'border-green-500 bg-white shadow-sm' 
                          : 'border-gray-200 bg-white/50 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <RadioGroupItem value={voiceOption.id} id={voiceOption.id} />
                        <Label htmlFor={voiceOption.id} className="cursor-pointer flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{voiceOption.name}</div>
                          <div className="text-xs text-gray-500 truncate">{voiceOption.description}</div>
                        </Label>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => previewVoice(voiceOption.id)}
                        disabled={isSpeaking && previewingVoiceId !== voiceOption.id}
                        className="flex items-center space-x-1 ml-2 shrink-0"
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
              </CardContent>
            </Card>
          )}

          {/* Current Selection */}
          {selectedVoiceId && (
            <Card className="border-2 border-purple-300 bg-purple-100/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-center text-purple-700">
                  <Check className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    已選擇：{availableVoices.find(v => v.id === selectedVoiceId)?.name || '自動選擇'}
                  </span>
                  <Badge variant="outline" className="ml-3">{speechRate.toFixed(1)}x 語速</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
