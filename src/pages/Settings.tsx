import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Volume2, Play, Check, Settings as SettingsIcon, Mic, Moon, Sun } from 'lucide-react';
import { logger } from '@/services/logService';

interface VoiceOption {
  id: string; // Use voice.name as unique ID
  displayName: string;
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('speechRate', speechRate.toString());
  }, [speechRate]);

  useEffect(() => {
    localStorage.setItem('selectedVoiceId', selectedVoiceId);
    logger.info('Voice saved to localStorage', { selectedVoiceId });
  }, [selectedVoiceId]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      
      logger.info('Loading voices', { totalVoices: voices.length, englishVoices: englishVoices.length });
      
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
      const addedVoiceNames = new Set<string>();
      
      // Find all available female voices
      const femaleVoices: SpeechSynthesisVoice[] = [];
      for (const name of preferredFemale) {
        const found = englishVoices.find(v => v.name.includes(name) && !addedVoiceNames.has(v.name));
        if (found) {
          femaleVoices.push(found);
          addedVoiceNames.add(found.name);
        }
      }
      // Also add any with 'female' in name
      const otherFemale = englishVoices.filter(v => 
        v.name.toLowerCase().includes('female') && !addedVoiceNames.has(v.name)
      );
      otherFemale.forEach(v => {
        femaleVoices.push(v);
        addedVoiceNames.add(v.name);
      });
      
      // Find all available male voices
      const maleVoices: SpeechSynthesisVoice[] = [];
      for (const name of preferredMale) {
        const found = englishVoices.find(v => v.name.includes(name) && !addedVoiceNames.has(v.name));
        if (found) {
          maleVoices.push(found);
          addedVoiceNames.add(found.name);
        }
      }
      // Also add any with 'male' in name (but not 'female')
      const otherMale = englishVoices.filter(v => 
        v.name.toLowerCase().includes('male') && 
        !v.name.toLowerCase().includes('female') && 
        !addedVoiceNames.has(v.name)
      );
      otherMale.forEach(v => {
        maleVoices.push(v);
        addedVoiceNames.add(v.name);
      });
      
      // Add default option (system will choose best female)
      voiceOptions.push({
        id: 'default',
        displayName: '自動選擇 (Auto)',
        description: '系統自動選擇最佳女聲',
        voice: femaleVoices[0] || englishVoices[0] || null,
        category: 'female'
      });
      
      // Add all female voices - use voice.name as ID for consistency
      femaleVoices.forEach((voice) => {
        const shortName = voice.name.split(' ').slice(0, 2).join(' ');
        voiceOptions.push({
          id: voice.name, // Use full voice name as unique ID
          displayName: `👩 ${shortName}`,
          description: `${voice.name} (${voice.lang})`,
          voice: voice,
          category: 'female'
        });
      });
      
      // Add all male voices
      maleVoices.forEach((voice) => {
        const shortName = voice.name.split(' ').slice(0, 2).join(' ');
        voiceOptions.push({
          id: voice.name, // Use full voice name as unique ID
          displayName: `👨 ${shortName}`,
          description: `${voice.name} (${voice.lang})`,
          voice: voice,
          category: 'male'
        });
      });
      
      // Add regional accent voices (that weren't already added)
      const ukVoices = englishVoices.filter(v => v.lang === 'en-GB' && !addedVoiceNames.has(v.name));
      const usVoices = englishVoices.filter(v => v.lang === 'en-US' && !addedVoiceNames.has(v.name));
      const auVoices = englishVoices.filter(v => v.lang === 'en-AU' && !addedVoiceNames.has(v.name));
      const ieVoices = englishVoices.filter(v => v.lang === 'en-IE' && !addedVoiceNames.has(v.name));
      const inVoices = englishVoices.filter(v => v.lang === 'en-IN' && !addedVoiceNames.has(v.name));
      
      ukVoices.slice(0, 3).forEach((voice) => {
        voiceOptions.push({
          id: voice.name,
          displayName: `🇬🇧 ${voice.name.split(' ').slice(0, 2).join(' ')}`,
          description: `${voice.name}`,
          voice: voice,
          category: 'regional'
        });
        addedVoiceNames.add(voice.name);
      });
      
      usVoices.slice(0, 3).forEach((voice) => {
        voiceOptions.push({
          id: voice.name,
          displayName: `🇺🇸 ${voice.name.split(' ').slice(0, 2).join(' ')}`,
          description: `${voice.name}`,
          voice: voice,
          category: 'regional'
        });
        addedVoiceNames.add(voice.name);
      });
      
      auVoices.slice(0, 2).forEach((voice) => {
        voiceOptions.push({
          id: voice.name,
          displayName: `🇦🇺 ${voice.name.split(' ').slice(0, 2).join(' ')}`,
          description: `${voice.name}`,
          voice: voice,
          category: 'regional'
        });
        addedVoiceNames.add(voice.name);
      });
      
      ieVoices.slice(0, 1).forEach((voice) => {
        voiceOptions.push({
          id: voice.name,
          displayName: `🇮🇪 ${voice.name.split(' ').slice(0, 2).join(' ')}`,
          description: `${voice.name}`,
          voice: voice,
          category: 'regional'
        });
        addedVoiceNames.add(voice.name);
      });
      
      inVoices.slice(0, 1).forEach((voice) => {
        voiceOptions.push({
          id: voice.name,
          displayName: `🇮🇳 ${voice.name.split(' ').slice(0, 2).join(' ')}`,
          description: `${voice.name}`,
          voice: voice,
          category: 'regional'
        });
        addedVoiceNames.add(voice.name);
      });
      
      setAvailableVoices(voiceOptions);
      logger.info('Loaded voices for settings', { count: voiceOptions.length, voiceIds: voiceOptions.map(v => v.id) });
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
        logger.info('Previewing voice', { voiceId, voiceName: voice.name });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 group relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900 dark:hover:to-purple-900 border border-gray-300 dark:border-gray-600 hover:border-blue-300 text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">設定</h1>
            <p className="text-gray-600 dark:text-gray-400">調整語音和顯示設定</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Dark Mode Toggle */}
          <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg md:text-xl text-gray-900 dark:text-white">
                {isDarkMode ? <Moon className="w-5 h-5 mr-2 text-purple-600" /> : <Sun className="w-5 h-5 mr-2 text-yellow-500" />}
                顯示模式
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                切換淺色或深色主題
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">淺色模式</span>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-700 dark:text-gray-200">深色模式</span>
                  <Moon className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Speech Rate Control */}
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg md:text-xl text-gray-900 dark:text-white">
                <Volume2 className="w-5 h-5 mr-2 text-blue-600" />
                語速調節
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                調整系統語音播放速度
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
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

          {/* Voice availability notice */}
          {availableVoices.length <= 3 && (
            <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center shrink-0">
                    <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">語音選擇較少?</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      可用的語音數量取決於您的裝置和瀏覽器。手機通常比電腦提供較少的語音選擇。
                      如需更多語音選項，建議使用桌面版 Chrome 或 Safari 瀏覽器。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Voice Selection - Female */}
          <Card className="border-2 border-pink-200 dark:border-pink-800 bg-pink-50/50 dark:bg-pink-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg md:text-xl text-gray-900 dark:text-white">
                <Mic className="w-5 h-5 mr-2 text-pink-600" />
                選擇語音 - 女聲
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                點擊試聽按鈕預覽語音效果 · 共 {availableVoices.length} 個語音
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
                        ? 'border-pink-500 bg-white dark:bg-gray-800 shadow-sm' 
                        : 'border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <RadioGroupItem value={voiceOption.id} id={voiceOption.id} />
                      <Label htmlFor={voiceOption.id} className="cursor-pointer flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">{voiceOption.displayName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{voiceOption.description}</div>
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
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg md:text-xl text-gray-900 dark:text-white">
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
                          ? 'border-blue-500 bg-white dark:bg-gray-800 shadow-sm' 
                          : 'border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <RadioGroupItem value={voiceOption.id} id={voiceOption.id} />
                        <Label htmlFor={voiceOption.id} className="cursor-pointer flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">{voiceOption.displayName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{voiceOption.description}</div>
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
            <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg md:text-xl text-gray-900 dark:text-white">
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
                          ? 'border-green-500 bg-white dark:bg-gray-800 shadow-sm' 
                          : 'border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <RadioGroupItem value={voiceOption.id} id={voiceOption.id} />
                        <Label htmlFor={voiceOption.id} className="cursor-pointer flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">{voiceOption.displayName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{voiceOption.description}</div>
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
            <Card className="border-2 border-purple-300 dark:border-purple-700 bg-purple-100/50 dark:bg-purple-900/30">
              <CardContent className="py-4">
                <div className="flex items-center justify-center text-purple-700 dark:text-purple-300 flex-wrap gap-2">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">
                    已選擇：{availableVoices.find(v => v.id === selectedVoiceId)?.displayName || '自動選擇'}
                  </span>
                  <Badge variant="outline" className="ml-2">{speechRate.toFixed(1)}x 語速</Badge>
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
