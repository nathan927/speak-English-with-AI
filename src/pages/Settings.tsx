import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Volume2, Play, Check, Settings as SettingsIcon, Mic, Moon, Sun, Download } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/services/logService';
import ApiSettings from '@/components/ApiSettings';
import TtsSettings from '@/components/TtsSettings';
import SttSettings from '@/components/SttSettings';
import SettingsImportExport from '@/components/SettingsImportExport';

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

  // 5-click settings icon to download project
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSettingsIconClick = useCallback(() => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    
    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      downloadProjectAsZip();
      return;
    }
    
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);
  }, []);

  const downloadProjectAsZip = async () => {
    toast.info('正在打包項目原始碼...', { duration: 5000 });
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Use Vite's import.meta.glob to collect all source files - comprehensive patterns
      const allFiles = import.meta.glob([
        '/src/**/*.{ts,tsx,js,jsx,css,json,md,svg,png,jpg,jpeg,gif,ico,webp}',
        '/public/**/*',
        '/supabase/**/*.{ts,tsx,js,json,toml,sql}',
        '/*.{ts,js,json,html,css,md,toml,mjs,cjs}',
        '/.env.example',
      ], { query: '?raw', import: 'default', eager: false });

      const entries = Object.entries(allFiles);
      let loaded = 0;

      for (const [path, loader] of entries) {
        try {
          const content = await (loader as () => Promise<string>)();
          const filePath = path.startsWith('/') ? path.slice(1) : path;
          zip.file(filePath, content);
          loaded++;
        } catch {
          // Skip files that can't be loaded as raw
        }
      }

      // Also add settings export as a convenience file
      try {
        const { getAllProviderConfigs, getActiveProvider } = await import('@/services/aiProviderService');
        const { getAllTTSProviderConfigs, getActiveTTSProvider } = await import('@/services/ttsProviderService');
        const { getSTTProviderConfig, getActiveSTTProvider } = await import('@/services/sttProviderService');
        
        const settingsExport = {
          _format: 'app-settings-v1',
          _exportedAt: new Date().toISOString(),
          ai: { activeProvider: getActiveProvider(), configs: getAllProviderConfigs() },
          tts: { activeProvider: getActiveTTSProvider(), configs: getAllTTSProviderConfigs() },
          stt: { activeProvider: getActiveSTTProvider(), config: getSTTProviderConfig() },
          browser: {
            speechRate: parseFloat(localStorage.getItem('speechRate') || '0.9'),
            selectedVoiceId: localStorage.getItem('selectedVoiceId') || 'default',
            darkMode: localStorage.getItem('darkMode') === 'true',
          },
        };
        zip.file('app-settings-export.json', JSON.stringify(settingsExport, null, 2));
      } catch { /* settings export is optional */ }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-source-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`已下載 ${loaded} 個檔案的項目原始碼 ZIP`);
      logger.info('Project downloaded as ZIP', { fileCount: loaded });
    } catch (err) {
      toast.error('打包失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
      logger.error('Project ZIP download failed', { error: err });
    }
  };

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
      
      // Enhanced preferred voice names - comprehensive list for maximum browser coverage
      const preferredFemale = [
        'Samantha', 'Karen', 'Moira', 'Tessa', 'Fiona', 'Victoria', 'Allison',
        'Google UK English Female', 'Google US English Female',
        'Microsoft Zira', 'Microsoft Hazel', 'Microsoft Susan', 'Microsoft Catherine',
        'Microsoft Jenny', 'Microsoft Aria', 'Microsoft Sara', 'Microsoft Michelle',
        'Siri Female', 'Ellen', 'Serena', 'Nicky', 'Veena', 'Ava',
        'Kathy', 'Princess', 'Vicki', 'Sandy', 'Shelley',
        'Kate', 'Joelle', 'Amelie', 'Anna', 'Helena', 'Ioana', 'Luciana',
        'Mei-Jia', 'Milena', 'Monica', 'Paulina', 'Zosia',
        'Rishi', 'Kanya', 'Kyoko', 'Yuna',
        'en-US-Standard-C', 'en-US-Standard-E', 'en-US-Standard-F', 'en-US-Standard-G', 'en-US-Standard-H',
        'en-GB-Standard-A', 'en-GB-Standard-C',
      ];
      const preferredMale = [
        'Daniel', 'Alex', 'Tom', 'Oliver', 'James', 'Arthur',
        'Google UK English Male', 'Google US English Male',
        'Microsoft David', 'Microsoft Mark', 'Microsoft George', 'Microsoft Richard',
        'Microsoft Guy', 'Microsoft Davis', 'Microsoft Jason', 'Microsoft Tony',
        'Microsoft Christopher', 'Microsoft Brandon',
        'Siri Male', 'Thomas', 'Lee', 'Ralph',
        'Fred', 'Junior', 'Albert', 'Bruce', 'Reed', 'Rocko',
        'Aaron', 'Eddy', 'Evan', 'Gordon', 'Jacques', 'Luca', 'Magnus',
        'Otis', 'Remy', 'Sandy',
        'en-US-Standard-A', 'en-US-Standard-B', 'en-US-Standard-D', 'en-US-Standard-I', 'en-US-Standard-J',
        'en-GB-Standard-B', 'en-GB-Standard-D',
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
      
      // Add ALL remaining English voices that weren't categorized
      const remainingVoices = englishVoices.filter(v => !addedVoiceNames.has(v.name));
      
      // Categorize remaining voices by region
      const regionMap: Record<string, { flag: string; label: string }> = {
        'en-GB': { flag: '🇬🇧', label: 'UK' },
        'en-US': { flag: '🇺🇸', label: 'US' },
        'en-AU': { flag: '🇦🇺', label: 'AU' },
        'en-IE': { flag: '🇮🇪', label: 'IE' },
        'en-IN': { flag: '🇮🇳', label: 'IN' },
        'en-ZA': { flag: '🇿🇦', label: 'ZA' },
        'en-NZ': { flag: '🇳🇿', label: 'NZ' },
        'en-SG': { flag: '🇸🇬', label: 'SG' },
        'en-PH': { flag: '🇵🇭', label: 'PH' },
        'en-HK': { flag: '🇭🇰', label: 'HK' },
        'en-CA': { flag: '🇨🇦', label: 'CA' },
        'en-SC': { flag: '🏴', label: 'SC' },
      };
      
      remainingVoices.forEach((voice) => {
        const region = regionMap[voice.lang] || { flag: '🌍', label: voice.lang.replace('en-', '') };
        voiceOptions.push({
          id: voice.name,
          displayName: `${region.flag} ${voice.name.split(' ').slice(0, 2).join(' ')}`,
          description: `${voice.name} (${voice.lang})`,
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
              <div 
                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
                onClick={handleSettingsIconClick}
                title="設定"
              >
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

          {/* Import/Export Settings */}
          <SettingsImportExport />
          {/* AI Provider Settings */}
          <ApiSettings />
          {/* TTS Provider Settings */}
          <TtsSettings />
          {/* STT Provider Settings */}
          <SttSettings />
        </div>
      </div>
    </div>
  );
};

export default Settings;
