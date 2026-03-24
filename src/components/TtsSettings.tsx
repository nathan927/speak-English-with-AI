import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2, Check, X, Volume2, Save, Trash2, Wifi, Clock, Play, Square
} from 'lucide-react';
import {
  TTS_PROVIDER_PRESETS,
  TTSProviderConfig,
  TTSProviderPreset,
  saveTTSProviderConfig,
  getTTSProviderConfig,
  deleteTTSProviderConfig,
  setActiveTTSProvider,
  getActiveTTSProvider,
  testTTSConnectivity,
} from '@/services/ttsProviderService';
import { supabase } from '@/integrations/supabase/client';

const TtsSettings: React.FC = () => {
  const [activeProviderId, setActiveProviderId] = useState(getActiveTTSProvider());
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [customModelId, setCustomModelId] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [customVoiceId, setCustomVoiceId] = useState('');
  const [presetBaseUrl, setPresetBaseUrl] = useState('');
  const [speed, setSpeed] = useState(1.0);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [customName, setCustomName] = useState('');
  const [customVoice, setCustomVoice] = useState('');
  const [customSpeed, setCustomSpeed] = useState(1.0);
  const [showCustomApiKey, setShowCustomApiKey] = useState(false);
  const [customTestResult, setCustomTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [isCustomTesting, setIsCustomTesting] = useState(false);

  useEffect(() => {
    if (editingProvider && editingProvider !== 'browser') {
      const config = getTTSProviderConfig(editingProvider);
      const preset = TTS_PROVIDER_PRESETS.find(p => p.id === editingProvider);
      if (config) {
        setApiKey(config.apiKey);
        setPresetBaseUrl(config.baseUrl || preset?.baseUrl || '');
        const isPresetModel = preset?.models.some(m => m.id === config.model && m.id !== '__custom__');
        if (isPresetModel) { setSelectedModel(config.model); setCustomModelId(''); }
        else { setSelectedModel('__custom__'); setCustomModelId(config.model); }
        const isPresetVoice = preset?.voices.some(v => v.id === config.voiceId);
        if (isPresetVoice) { setSelectedVoice(config.voiceId); setCustomVoiceId(''); }
        else { setSelectedVoice('__custom__'); setCustomVoiceId(config.voiceId); }
        setSpeed(config.speed || 1.0);
      } else {
        setApiKey('');
        setPresetBaseUrl(preset?.baseUrl || '');
        setCustomModelId('');
        setCustomVoiceId('');
        setSelectedModel(preset?.models[0]?.id || '');
        setSelectedVoice(preset?.voices[0]?.id || '');
        setSpeed(1.0);
      }
      setTestResult(null);
      setShowApiKey(false);
    }
  }, [editingProvider]);

  useEffect(() => {
    const config = getTTSProviderConfig('custom-tts');
    if (config) {
      setCustomBaseUrl(config.baseUrl);
      setCustomApiKey(config.apiKey);
      setCustomModel(config.model);
      setCustomName(config.providerName);
      setCustomVoice(config.voiceId);
      setCustomSpeed(config.speed || 1.0);
    }
  }, []);

  const getResolvedModel = (preset: TTSProviderPreset) => {
    if (selectedModel === '__custom__' && customModelId.trim()) return customModelId.trim();
    return selectedModel || preset.models[0]?.id || '';
  };

  const getResolvedVoice = (preset: TTSProviderPreset) => {
    if (selectedVoice === '__custom__' && customVoiceId.trim()) return customVoiceId.trim();
    return selectedVoice || preset.voices[0]?.id || '';
  };

  const handleSaveProvider = (preset: TTSProviderPreset) => {
    const config: TTSProviderConfig = {
      providerId: preset.id,
      providerName: preset.name,
      baseUrl: presetBaseUrl || preset.baseUrl,
      apiKey,
      model: getResolvedModel(preset),
      voiceId: getResolvedVoice(preset),
      speed,
    };
    saveTTSProviderConfig(config);
    setEditingProvider(null);
  };

  const handleActivateProvider = (providerId: string) => {
    setActiveTTSProvider(providerId);
    setActiveProviderId(providerId);
  };

  const handleDeleteProvider = (providerId: string) => {
    deleteTTSProviderConfig(providerId);
    if (activeProviderId === providerId) handleActivateProvider('browser');
    setEditingProvider(null);
  };

  const handleTestProvider = async (preset: TTSProviderPreset) => {
    setIsTesting(true);
    setTestResult(null);
    const config: TTSProviderConfig = {
      providerId: preset.id,
      providerName: preset.name,
      baseUrl: presetBaseUrl || preset.baseUrl,
      apiKey,
      model: getResolvedModel(preset),
      voiceId: getResolvedVoice(preset),
      speed,
    };
    const result = await testTTSConnectivity(config);
    setTestResult(result);
    setIsTesting(false);
  };

  const handlePreviewVoice = async (preset: TTSProviderPreset) => {
    setIsPlaying(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tts-proxy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            text: 'Hello! This is a voice preview test. How does my voice sound?',
            providerId: preset.id,
            baseUrl: presetBaseUrl || preset.baseUrl,
            apiKey,
            model: getResolvedModel(preset),
            voiceId: getResolvedVoice(preset),
            speed,
          }),
        }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (data.audioContent) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await audio.play();
      }
    } catch (error) {
      console.error('Preview failed:', error);
      setIsPlaying(false);
    }
  };

  const handleSaveCustom = () => {
    const config: TTSProviderConfig = {
      providerId: 'custom-tts',
      providerName: customName || 'Custom TTS',
      baseUrl: customBaseUrl,
      apiKey: customApiKey,
      model: customModel,
      voiceId: customVoice,
      speed: customSpeed,
    };
    saveTTSProviderConfig(config);
  };

  const handleTestCustom = async () => {
    setIsCustomTesting(true);
    setCustomTestResult(null);
    const config: TTSProviderConfig = {
      providerId: 'custom-tts',
      providerName: customName || 'Custom TTS',
      baseUrl: customBaseUrl,
      apiKey: customApiKey,
      model: customModel,
      voiceId: customVoice,
      speed: customSpeed,
    };
    const result = await testTTSConnectivity(config);
    setCustomTestResult(result);
    setIsCustomTesting(false);
  };

  const hasSavedConfig = (providerId: string) => !!getTTSProviderConfig(providerId);
  const nonBrowserPresets = TTS_PROVIDER_PRESETS.filter(p => p.id !== 'browser');

  return (
    <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg md:text-xl text-foreground">
          <Volume2 className="w-5 h-5 mr-2 text-emerald-600" />
          語音合成 (TTS) 設定
        </CardTitle>
        <CardDescription>
          配置外部語音合成服務，替代瀏覽器內建 TTS 以獲得更仿真人的效果。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="presets">預設提供商</TabsTrigger>
            <TabsTrigger value="custom">自訂提供商</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700">
              <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                目前使用：{TTS_PROVIDER_PRESETS.find(p => p.id === activeProviderId)?.name ||
                  (activeProviderId === 'custom-tts' ? (getTTSProviderConfig('custom-tts')?.providerName || 'Custom TTS') : activeProviderId)}
              </span>
            </div>

            <div className={`rounded-lg border-2 transition-all ${activeProviderId === 'browser' ? 'border-emerald-500 dark:border-emerald-400 bg-white dark:bg-gray-800 shadow-md' : 'border-border bg-card/70'}`}>
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌐</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">瀏覽器內建 (Built-in)</span>
                      {activeProviderId === 'browser' && <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs">使用中</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">免費，無需 API Key，但語音效果較機械</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={activeProviderId === 'browser' ? "default" : "outline"}
                  onClick={() => handleActivateProvider('browser')}
                  disabled={activeProviderId === 'browser'}
                  className={`text-xs h-8 ${activeProviderId === 'browser' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
                >
                  {activeProviderId === 'browser' ? <Check className="w-3 h-3" /> : '啟用'}
                </Button>
              </div>
            </div>

            {nonBrowserPresets.map((preset) => {
              const isActive = activeProviderId === preset.id;
              const isEditing = editingProvider === preset.id;
              const hasSaved = hasSavedConfig(preset.id);

              return (
                <div key={preset.id} className={`rounded-lg border-2 transition-all ${isActive ? 'border-emerald-500 dark:border-emerald-400 bg-white dark:bg-gray-800 shadow-md' : 'border-border bg-card/70'}`}>
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-xl">{preset.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-foreground">{preset.name}</span>
                          {isActive && <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs">使用中</Badge>}
                          {hasSaved && <Badge variant="outline" className="text-xs">已設定</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{preset.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => setEditingProvider(isEditing ? null : preset.id)} className="text-xs h-8">
                        {isEditing ? '收起' : '設定'}
                      </Button>
                      {hasSaved && (
                        <Button size="sm" variant={isActive ? "default" : "outline"} onClick={() => handleActivateProvider(preset.id)} disabled={isActive}
                          className={`text-xs h-8 ${isActive ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}>
                          {isActive ? <Check className="w-3 h-3" /> : '啟用'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
                      {/* Base URL (for providers without fixed URL) */}
                      {!preset.baseUrl && (
                        <div className="space-y-1">
                          <Label className="text-xs">Base URL <span className="text-destructive">*</span></Label>
                          <Input
                            value={presetBaseUrl}
                            onChange={(e) => setPresetBaseUrl(e.target.value)}
                            placeholder="https://your-grok2api-host:8000/v1"
                            className="h-9 text-sm font-mono"
                          />
                          <p className="text-xs text-muted-foreground">請輸入你的服務地址</p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <Label className="text-xs">API Key</Label>
                        <div className="relative">
                          <Input type={showApiKey ? 'text' : 'password'} value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className="pr-10 text-sm h-9" />
                          <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {preset.models.length > 0 && (
                        <>
                          <div className="space-y-1">
                            <Label className="text-xs">模型</Label>
                            <Select value={selectedModel} onValueChange={(v) => { setSelectedModel(v); if (v !== '__custom__') setCustomModelId(''); }}>
                              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="選擇模型" /></SelectTrigger>
                              <SelectContent>
                                {preset.models.map(m => (
                                  <SelectItem key={m.id} value={m.id}>
                                    <span className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs py-0">{m.category}</Badge>
                                      {m.name}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {selectedModel === '__custom__' && (
                            <div className="space-y-1">
                              <Label className="text-xs">自訂模型 ID</Label>
                              <Input value={customModelId} onChange={(e) => setCustomModelId(e.target.value)} placeholder="輸入模型代碼..." className="h-9 text-sm font-mono" />
                            </div>
                          )}
                        </>
                      )}

                      {preset.voices.length > 0 && (
                        <>
                          <div className="space-y-1">
                            <Label className="text-xs">語音角色</Label>
                            <Select value={selectedVoice} onValueChange={(v) => { setSelectedVoice(v); if (v !== '__custom__') setCustomVoiceId(''); }}>
                              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="選擇語音" /></SelectTrigger>
                              <SelectContent>
                                {preset.voices.map(v => (
                                  <SelectItem key={v.id} value={v.id}>
                                    <span className="flex items-center gap-2">
                                      {v.gender && <Badge variant="outline" className="text-xs py-0">{v.gender}</Badge>}
                                      {v.name}
                                      {v.language && <span className="text-xs text-muted-foreground">({v.language})</span>}
                                    </span>
                                  </SelectItem>
                                ))}
                                <SelectItem value="__custom__">
                                  <span className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs py-0">Custom</Badge>
                                    🔧 自行輸入語音 ID...
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {selectedVoice === '__custom__' && (
                            <div className="space-y-1">
                              <Label className="text-xs">自訂語音 ID</Label>
                              <Input value={customVoiceId} onChange={(e) => setCustomVoiceId(e.target.value)} placeholder="輸入語音 ID..." className="h-9 text-sm font-mono" />
                            </div>
                          )}
                        </>
                      )}

                      {preset.supportsSpeed && (
                        <div className="space-y-1">
                          <Label className="text-xs">語速 ({speed.toFixed(1)}x)</Label>
                          <Slider value={[speed]} onValueChange={(v) => setSpeed(v[0])} min={0.5} max={2.0} step={0.1} className="w-full" />
                        </div>
                      )}

                      {testResult && (
                        <div className={`flex items-center gap-2 p-2 rounded text-xs ${testResult.success ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
                          {testResult.success ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                          <span className="flex-1">{testResult.message}</span>
                          {testResult.latencyMs !== undefined && <span className="flex items-center gap-1 shrink-0"><Clock className="w-3 h-3" />{testResult.latencyMs}ms</span>}
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline" onClick={() => handleTestProvider(preset)} disabled={!apiKey || isTesting} className="text-xs h-8">
                          {isTesting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wifi className="w-3 h-3 mr-1" />}
                          測試連線
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handlePreviewVoice(preset)} disabled={!apiKey || isPlaying} className="text-xs h-8">
                          {isPlaying ? <Square className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                          試聽語音
                        </Button>
                        <Button size="sm" onClick={() => handleSaveProvider(preset)} disabled={!apiKey} className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white">
                          <Save className="w-3 h-3 mr-1" />儲存
                        </Button>
                        {hasSaved && (
                          <Button size="sm" variant="outline" onClick={() => handleDeleteProvider(preset.id)} className="text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10">
                            <Trash2 className="w-3 h-3 mr-1" />刪除
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="p-4 rounded-lg border-2 border-border bg-card space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">提供商名稱</Label>
                <Input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="My Custom TTS" className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Base URL (OpenAI 相容格式)</Label>
                <Input value={customBaseUrl} onChange={(e) => setCustomBaseUrl(e.target.value)} placeholder="https://api.example.com/v1" className="h-9 text-sm font-mono" />
                <p className="text-xs text-muted-foreground">系統會自動在末尾加上 /audio/speech</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">API Key</Label>
                <div className="relative">
                  <Input type={showCustomApiKey ? 'text' : 'password'} value={customApiKey} onChange={(e) => setCustomApiKey(e.target.value)} placeholder="sk-..." className="pr-10 h-9 text-sm" />
                  <button type="button" onClick={() => setShowCustomApiKey(!showCustomApiKey)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showCustomApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">模型名稱</Label>
                <Input value={customModel} onChange={(e) => setCustomModel(e.target.value)} placeholder="tts-1-hd" className="h-9 text-sm font-mono" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">語音 ID / Voice ID</Label>
                <Input value={customVoice} onChange={(e) => setCustomVoice(e.target.value)} placeholder="nova, alloy, ..." className="h-9 text-sm font-mono" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">語速 ({customSpeed.toFixed(1)}x)</Label>
                <Slider value={[customSpeed]} onValueChange={(v) => setCustomSpeed(v[0])} min={0.5} max={2.0} step={0.1} className="w-full" />
              </div>

              {customTestResult && (
                <div className={`flex items-center gap-2 p-2 rounded text-xs ${customTestResult.success ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
                  {customTestResult.success ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                  <span className="flex-1">{customTestResult.message}</span>
                  {customTestResult.latencyMs !== undefined && <span className="flex items-center gap-1 shrink-0"><Clock className="w-3 h-3" />{customTestResult.latencyMs}ms</span>}
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={handleTestCustom} disabled={!customBaseUrl || !customApiKey || !customModel || isCustomTesting} className="text-xs h-8">
                  {isCustomTesting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wifi className="w-3 h-3 mr-1" />}
                  測試連線
                </Button>
                <Button size="sm" onClick={handleSaveCustom} disabled={!customBaseUrl || !customApiKey || !customModel} className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Save className="w-3 h-3 mr-1" />儲存設定
                </Button>
                <Button size="sm" variant={activeProviderId === 'custom-tts' ? "default" : "outline"}
                  onClick={() => handleActivateProvider('custom-tts')} disabled={activeProviderId === 'custom-tts' || !getTTSProviderConfig('custom-tts')}
                  className={`text-xs h-8 ${activeProviderId === 'custom-tts' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}>
                  {activeProviderId === 'custom-tts' ? <Check className="w-3 h-3 mr-1" /> : null}
                  {activeProviderId === 'custom-tts' ? '使用中' : '啟用'}
                </Button>
                {getTTSProviderConfig('custom-tts') && (
                  <Button size="sm" variant="outline" onClick={() => {
                    deleteTTSProviderConfig('custom-tts');
                    setCustomBaseUrl(''); setCustomApiKey(''); setCustomModel(''); setCustomName(''); setCustomVoice('');
                    if (activeProviderId === 'custom-tts') handleActivateProvider('browser');
                  }} className="text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10">
                    <Trash2 className="w-3 h-3 mr-1" />刪除
                  </Button>
                )}
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted rounded-lg">
              <p className="font-medium">💡 使用提示：</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Base URL 需為 OpenAI 相容格式（/v1/audio/speech）</li>
                <li>所有設定儲存在瀏覽器本機，不會上傳至伺服器</li>
                <li>API Key 僅在語音生成時通過加密通道傳送</li>
                <li>推薦 ElevenLabs 或 OpenAI TTS 獲得最佳仿真人效果</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TtsSettings;
