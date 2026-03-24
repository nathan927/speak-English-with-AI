import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Check, X, Zap, Save, Trash2, Wifi, WifiOff, Clock
} from 'lucide-react';
import {
  AI_PROVIDER_PRESETS,
  AIProviderConfig,
  AIProviderPreset,
  saveProviderConfig,
  getProviderConfig,
  deleteProviderConfig,
  setActiveProvider,
  getActiveProvider,
  testProviderConnectivity,
} from '@/services/aiProviderService';

const ApiSettings: React.FC = () => {
  const [activeProviderId, setActiveProviderId] = useState(getActiveProvider());
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [customModelId, setCustomModelId] = useState('');
  const [presetBaseUrl, setPresetBaseUrl] = useState('');
  const [reasoningLevel, setReasoningLevel] = useState<'none' | 'low' | 'medium' | 'high'>('none');
  const [showApiKey, setShowApiKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Custom provider state
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [customName, setCustomName] = useState('');
  const [customReasoningLevel, setCustomReasoningLevel] = useState<'none' | 'low' | 'medium' | 'high'>('none');
  const [showCustomApiKey, setShowCustomApiKey] = useState(false);
  const [customTestResult, setCustomTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [isCustomTesting, setIsCustomTesting] = useState(false);

  // Load saved config when editing a provider
  useEffect(() => {
    if (editingProvider) {
      const config = getProviderConfig(editingProvider);
      const preset = AI_PROVIDER_PRESETS.find(p => p.id === editingProvider);
      if (config) {
        setApiKey(config.apiKey);
        setPresetBaseUrl(config.baseUrl || preset?.baseUrl || '');
        const isPresetModel = preset?.models.some(m => m.id === config.model && m.id !== '__custom__');
        if (isPresetModel) {
          setSelectedModel(config.model);
          setCustomModelId('');
        } else {
          setSelectedModel('__custom__');
          setCustomModelId(config.model);
        }
        setReasoningLevel(config.reasoningLevel || 'none');
      } else {
        setApiKey('');
        setCustomModelId('');
        setPresetBaseUrl(preset?.baseUrl || '');
        setSelectedModel(preset?.models[0]?.id || '');
        setReasoningLevel('none');
      }
      setTestResult(null);
      setShowApiKey(false);
    }
  }, [editingProvider]);

  // Load custom provider
  useEffect(() => {
    const config = getProviderConfig('custom');
    if (config) {
      setCustomBaseUrl(config.baseUrl);
      setCustomApiKey(config.apiKey);
      setCustomModel(config.model);
      setCustomName(config.providerName);
      setCustomReasoningLevel(config.reasoningLevel || 'none');
    }
  }, []);

  const getResolvedModel = (presetModels: { id: string }[]) => {
    if (selectedModel === '__custom__' && customModelId.trim()) return customModelId.trim();
    return selectedModel || presetModels[0]?.id || '';
  };

  const handleSaveProvider = (preset: AIProviderPreset) => {
    const config: AIProviderConfig = {
      providerId: preset.id,
      providerName: preset.name,
      baseUrl: presetBaseUrl || preset.baseUrl,
      apiKey,
      model: getResolvedModel(preset.models),
      reasoningLevel: reasoningLevel !== 'none' ? reasoningLevel : undefined,
    };
    saveProviderConfig(config);
    setEditingProvider(null);
  };

  const handleActivateProvider = (providerId: string) => {
    setActiveProvider(providerId);
    setActiveProviderId(providerId);
  };

  const handleDeleteProvider = (providerId: string) => {
    deleteProviderConfig(providerId);
    if (activeProviderId === providerId) {
      handleActivateProvider('minimax');
    }
    setEditingProvider(null);
  };

  const handleTestProvider = async (preset: AIProviderPreset) => {
    setIsTesting(true);
    setTestResult(null);
    const config: AIProviderConfig = {
      providerId: preset.id,
      providerName: preset.name,
      baseUrl: presetBaseUrl || preset.baseUrl,
      apiKey,
      model: getResolvedModel(preset.models),
      reasoningLevel: reasoningLevel !== 'none' ? reasoningLevel : undefined,
    };
    const result = await testProviderConnectivity(config);
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSaveCustom = () => {
    const config: AIProviderConfig = {
      providerId: 'custom',
      providerName: customName || 'Custom Provider',
      baseUrl: customBaseUrl,
      apiKey: customApiKey,
      model: customModel,
      reasoningLevel: customReasoningLevel !== 'none' ? customReasoningLevel : undefined,
    };
    saveProviderConfig(config);
  };

  const handleTestCustom = async () => {
    setIsCustomTesting(true);
    setCustomTestResult(null);
    const config: AIProviderConfig = {
      providerId: 'custom',
      providerName: customName || 'Custom Provider',
      baseUrl: customBaseUrl,
      apiKey: customApiKey,
      model: customModel,
      reasoningLevel: customReasoningLevel !== 'none' ? customReasoningLevel : undefined,
    };
    const result = await testProviderConnectivity(config);
    setCustomTestResult(result);
    setIsCustomTesting(false);
  };

  const hasSavedConfig = (providerId: string) => !!getProviderConfig(providerId);

  return (
    <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg md:text-xl text-gray-900 dark:text-white">
          <Zap className="w-5 h-5 mr-2 text-indigo-600" />
          AI 模型設定
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          配置AI服務提供商，支持多家國際及中國AI平台。設定保存在本機，無需重複輸入。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="presets">預設提供商</TabsTrigger>
            <TabsTrigger value="custom">自訂提供商</TabsTrigger>
          </TabsList>

          {/* Preset Providers Tab */}
          <TabsContent value="presets" className="space-y-3">
            {/* Active provider indicator */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-300 dark:border-indigo-700">
              <Wifi className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                目前使用：{AI_PROVIDER_PRESETS.find(p => p.id === activeProviderId)?.name || 
                  (activeProviderId === 'custom' ? (getProviderConfig('custom')?.providerName || 'Custom') : activeProviderId)}
              </span>
            </div>

            {AI_PROVIDER_PRESETS.map((preset) => {
              const isActive = activeProviderId === preset.id;
              const isEditing = editingProvider === preset.id;
              const hasSaved = hasSavedConfig(preset.id);
              const isLovable = false;

              return (
                <div
                  key={preset.id}
                  className={`rounded-lg border-2 transition-all ${
                    isActive 
                      ? 'border-indigo-500 dark:border-indigo-400 bg-white dark:bg-gray-800 shadow-md' 
                      : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50'
                  }`}
                >
                  {/* Provider header */}
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-xl">{preset.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">{preset.name}</span>
                          {isActive && <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-xs">使用中</Badge>}
                          {hasSaved && !isLovable && <Badge variant="outline" className="text-xs">已設定</Badge>}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{preset.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!isLovable && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProvider(isEditing ? null : preset.id)}
                          className="text-xs h-8"
                        >
                          {isEditing ? '收起' : '設定'}
                        </Button>
                      )}
                      {(isLovable || hasSaved) && (
                        <Button
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          onClick={() => handleActivateProvider(preset.id)}
                          disabled={isActive}
                          className={`text-xs h-8 ${isActive ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
                        >
                          {isActive ? <Check className="w-3 h-3" /> : '啟用'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Editing form */}
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
                          <p className="text-xs text-muted-foreground">請輸入你的服務地址，例如 https://your-host:8000/v1</p>
                        </div>
                      )}
                      {/* API Key */}
                      <div className="space-y-1">
                        <Label className="text-xs">API Key</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              type={showApiKey ? 'text' : 'password'}
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              placeholder="sk-..."
                              className="pr-10 text-sm h-9"
                            />
                            <button
                              type="button"
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Model selector */}
                      <div className="space-y-1">
                        <Label className="text-xs">模型</Label>
                        <Select value={selectedModel} onValueChange={(v) => { setSelectedModel(v); if (v !== '__custom__') setCustomModelId(''); }}>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="選擇模型" />
                          </SelectTrigger>
                          <SelectContent>
                            {preset.models.map((m) => (
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

                      {/* Custom model input */}
                      {selectedModel === '__custom__' && (
                        <div className="space-y-1">
                          <Label className="text-xs">自訂模型 ID</Label>
                          <Input
                            value={customModelId}
                            onChange={(e) => setCustomModelId(e.target.value)}
                            placeholder="輸入模型代碼，例如 gpt-5.4, claude-opus-4.6..."
                            className="h-9 text-sm font-mono"
                          />
                          <p className="text-xs text-muted-foreground">請輸入提供商支援的完整模型 ID</p>
                        </div>
                      )}

                      {/* Reasoning level (for supported providers) */}
                      {preset.supportsReasoning && (
                        <div className="space-y-1">
                          <Label className="text-xs">推理等級 (Reasoning Level)</Label>
                          <Select value={reasoningLevel} onValueChange={(v) => setReasoningLevel(v as any)}>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">無 (None)</SelectItem>
                              <SelectItem value="low">低 (Low)</SelectItem>
                              <SelectItem value="medium">中 (Medium)</SelectItem>
                              <SelectItem value="high">高 (High)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Test result */}
                      {testResult && (
                        <div className={`flex items-center gap-2 p-2 rounded text-xs ${
                          testResult.success 
                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
                            : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                        }`}>
                          {testResult.success ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                          <span className="flex-1">{testResult.message}</span>
                          {testResult.latencyMs && (
                            <span className="flex items-center gap-1 shrink-0">
                              <Clock className="w-3 h-3" />
                              {testResult.latencyMs}ms
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTestProvider(preset)}
                          disabled={!apiKey || isTesting}
                          className="text-xs h-8"
                        >
                          {isTesting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wifi className="w-3 h-3 mr-1" />}
                          測試連線
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveProvider(preset)}
                          disabled={!apiKey}
                          className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <Save className="w-3 h-3 mr-1" />
                          儲存
                        </Button>
                        {hasSaved && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProvider(preset.id)}
                            className="text-xs h-8 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            刪除
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>

          {/* Custom Provider Tab */}
          <TabsContent value="custom" className="space-y-4">
            <div className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">提供商名稱</Label>
                <Input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="My Custom AI"
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Base URL (OpenAI 相容格式)</Label>
                <Input
                  value={customBaseUrl}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  placeholder="https://api.example.com/v1"
                  className="h-9 text-sm font-mono"
                />
                <p className="text-xs text-gray-400">系統會自動在末尾加上 /chat/completions</p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">API Key</Label>
                <div className="relative">
                  <Input
                    type={showCustomApiKey ? 'text' : 'password'}
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="pr-10 h-9 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomApiKey(!showCustomApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCustomApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">模型名稱 (Model ID)</Label>
                <Input
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="e.g., gpt-5, claude-4-sonnet..."
                  className="h-9 text-sm font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">推理等級 (Reasoning Level)</Label>
                <Select value={customReasoningLevel} onValueChange={(v) => setCustomReasoningLevel(v as any)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">無 (None)</SelectItem>
                    <SelectItem value="low">低 (Low)</SelectItem>
                    <SelectItem value="medium">中 (Medium)</SelectItem>
                    <SelectItem value="high">高 (High)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">僅適用於支持 reasoning_effort 參數的模型（如 o3/o4）</p>
              </div>

              {/* Custom test result */}
              {customTestResult && (
                <div className={`flex items-center gap-2 p-2 rounded text-xs ${
                  customTestResult.success 
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                }`}>
                  {customTestResult.success ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                  <span className="flex-1">{customTestResult.message}</span>
                  {customTestResult.latencyMs && (
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {customTestResult.latencyMs}ms
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleTestCustom}
                  disabled={!customBaseUrl || !customApiKey || !customModel || isCustomTesting}
                  className="text-xs h-8"
                >
                  {isCustomTesting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wifi className="w-3 h-3 mr-1" />}
                  測試連線
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveCustom}
                  disabled={!customBaseUrl || !customApiKey || !customModel}
                  className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Save className="w-3 h-3 mr-1" />
                  儲存設定
                </Button>
                <Button
                  size="sm"
                  variant={activeProviderId === 'custom' ? "default" : "outline"}
                  onClick={() => handleActivateProvider('custom')}
                  disabled={activeProviderId === 'custom' || !getProviderConfig('custom')}
                  className={`text-xs h-8 ${activeProviderId === 'custom' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
                >
                  {activeProviderId === 'custom' ? <Check className="w-3 h-3 mr-1" /> : null}
                  {activeProviderId === 'custom' ? '使用中' : '啟用'}
                </Button>
                {getProviderConfig('custom') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      deleteProviderConfig('custom');
                      setCustomBaseUrl('');
                      setCustomApiKey('');
                      setCustomModel('');
                      setCustomName('');
                      if (activeProviderId === 'custom') handleActivateProvider('lovable');
                    }}
                    className="text-xs h-8 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    刪除
                  </Button>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium">💡 使用提示：</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Base URL 需為 OpenAI 相容格式（/v1/chat/completions）</li>
                <li>所有設定儲存在瀏覽器本機，不會上傳至伺服器</li>
                <li>Reasoning Level 僅適用於 OpenAI o3/o4 系列模型</li>
                <li>Anthropic API 使用原生格式，會自動處理</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiSettings;
