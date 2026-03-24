import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Save, Check, Wifi } from 'lucide-react';
import {
  getActiveSTTProvider,
  setActiveSTTProvider,
  getSTTProviderConfig,
  saveSTTProviderConfig,
  STTProviderConfig,
} from '@/services/sttProviderService';

const STT_PRESETS = [
  {
    id: 'browser',
    name: '瀏覽器內建 (Web Speech API)',
    icon: '🌐',
    description: '免費，即時辨識，但準確度較低',
  },
  {
    id: 'grok2api-stt',
    name: 'Grok2API STT (xAI)',
    icon: '✖️',
    description: '透過 Grok2API 代理，使用 Grok 模型轉錄語音，準確度高',
    needsBaseUrl: true,
    models: [
      { id: 'grok-4', name: 'Grok 4 (推薦)' },
      { id: 'grok-4.1-fast', name: 'Grok 4.1 Fast' },
      { id: 'grok-3', name: 'Grok 3' },
    ],
  },
  {
    id: 'xai-stt',
    name: 'xAI STT (官方)',
    icon: '✖️',
    description: 'xAI 官方 API，使用 Grok 模型做語音轉文字',
    models: [
      { id: 'grok-4', name: 'Grok 4 (推薦)' },
      { id: 'grok-4.1-fast', name: 'Grok 4.1 Fast' },
    ],
  },
];

const SttSettings: React.FC = () => {
  const [activeProviderId, setActiveProviderId] = useState(getActiveSTTProvider());
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  

  useEffect(() => {
    if (editingProvider && editingProvider !== 'browser') {
      const config = getSTTProviderConfig();
      if (config && config.providerId === editingProvider) {
        setBaseUrl(config.baseUrl || '');
        setApiKey(config.apiKey || '');
        setModel(config.model || '');
      } else {
        setBaseUrl('');
        setApiKey('');
        const preset = STT_PRESETS.find(p => p.id === editingProvider);
        setModel(preset?.models?.[0]?.id || 'grok-4');
      }
      
    }
  }, [editingProvider]);

  const handleSave = (presetId: string) => {
    const config: STTProviderConfig = {
      providerId: presetId,
      baseUrl: baseUrl,
      apiKey: apiKey,
      model: model || 'grok-4',
    };
    saveSTTProviderConfig(config);
    setEditingProvider(null);
  };

  const handleActivate = (providerId: string) => {
    setActiveSTTProvider(providerId);
    setActiveProviderId(providerId);
  };

  const hasSavedConfig = () => {
    const config = getSTTProviderConfig();
    return !!config?.apiKey;
  };

  return (
    <Card className="border-2 border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg md:text-xl text-foreground">
          <Mic className="w-5 h-5 mr-2 text-sky-600" />
          語音辨識 (STT) 設定
        </CardTitle>
        <CardDescription>
          選擇語音轉文字引擎。使用 Grok API 可大幅提高英語辨識準確度。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-sky-100 dark:bg-sky-900/40 border border-sky-300 dark:border-sky-700">
          <Wifi className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span className="text-sm font-medium text-sky-700 dark:text-sky-300">
            目前使用：{STT_PRESETS.find(p => p.id === activeProviderId)?.name || activeProviderId}
          </span>
        </div>

        {STT_PRESETS.map((preset) => {
          const isActive = activeProviderId === preset.id;
          const isEditing = editingProvider === preset.id;
          const isBrowser = preset.id === 'browser';

          return (
            <div
              key={preset.id}
              className={`rounded-lg border-2 transition-all ${
                isActive
                  ? 'border-sky-500 dark:border-sky-400 bg-white dark:bg-gray-800 shadow-md'
                  : 'border-border bg-card/70'
              }`}
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xl">{preset.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground">{preset.name}</span>
                      {isActive && (
                        <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 text-xs">
                          使用中
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{preset.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!isBrowser && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProvider(isEditing ? null : preset.id)}
                      className="text-xs h-8"
                    >
                      {isEditing ? '收起' : '設定'}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant={isActive ? 'default' : 'outline'}
                    onClick={() => handleActivate(preset.id)}
                    disabled={isActive || (!isBrowser && !hasSavedConfig())}
                    className={`text-xs h-8 ${isActive ? 'bg-sky-600 hover:bg-sky-700 text-white' : ''}`}
                  >
                    {isActive ? <Check className="w-3 h-3" /> : '啟用'}
                  </Button>
                </div>
              </div>

              {isEditing && !isBrowser && (
                <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
                  {preset.needsBaseUrl && (
                    <div className="space-y-1">
                      <Label className="text-xs">
                        Base URL <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder="https://your-grok2api-host:8000/v1"
                        className="h-9 text-sm font-mono"
                      />
                      <p className="text-xs text-muted-foreground">你的 Grok2API 服務地址</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label className="text-xs">API Key</Label>
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="text-sm h-9"
                    />
                  </div>

                  {preset.models && (
                    <div className="space-y-1">
                      <Label className="text-xs">模型</Label>
                      <Select value={model} onValueChange={setModel}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="選擇模型" />
                        </SelectTrigger>
                        <SelectContent>
                          {preset.models.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave(preset.id)}
                      disabled={!apiKey.trim() || (preset.needsBaseUrl && !baseUrl.trim())}
                      className="bg-sky-600 hover:bg-sky-700 text-white"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      儲存
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800">
          <p className="text-xs text-sky-700 dark:text-sky-300">
            💡 <strong>提示：</strong>Grok API STT 會錄製你的語音並發送到 AI 模型進行轉錄，準確度遠高於瀏覽器內建辨識。
            錄音完成後同樣可以編輯文字再提交。
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SttSettings;
