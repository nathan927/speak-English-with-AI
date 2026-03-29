import React, { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, FileJson, Check, X, AlertTriangle } from 'lucide-react';
import { getAllProviderConfigs, saveProviderConfig, setActiveProvider, getActiveProvider } from '@/services/aiProviderService';
import { getAllTTSProviderConfigs, saveTTSProviderConfig, setActiveTTSProvider, getActiveTTSProvider } from '@/services/ttsProviderService';
import { getSTTProviderConfig, saveSTTProviderConfig, setActiveSTTProvider, getActiveSTTProvider } from '@/services/sttProviderService';
import { logger } from '@/services/logService';

interface ExportData {
  _format: 'app-settings-v1';
  _exportedAt: string;
  ai: {
    activeProvider: string;
    configs: any[];
  };
  tts: {
    activeProvider: string;
    configs: any[];
  };
  stt: {
    activeProvider: string;
    config: any | null;
  };
  browser: {
    speechRate: number;
    selectedVoiceId: string;
    darkMode: boolean;
    showQuestions?: boolean;
    selectedGrade?: string;
  };
}

const SettingsImportExport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleExport = () => {
    const exportData: ExportData = {
      _format: 'app-settings-v1',
      _exportedAt: new Date().toISOString(),
      ai: {
        activeProvider: getActiveProvider(),
        configs: getAllProviderConfigs(),
      },
      tts: {
        activeProvider: getActiveTTSProvider(),
        configs: getAllTTSProviderConfigs(),
      },
      stt: {
        activeProvider: getActiveSTTProvider(),
        config: getSTTProviderConfig(),
      },
      browser: {
        speechRate: parseFloat(localStorage.getItem('speechRate') || '0.9'),
        selectedVoiceId: localStorage.getItem('selectedVoiceId') || 'default',
        darkMode: localStorage.getItem('darkMode') === 'true',
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-settings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logger.info('Settings exported');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as ExportData;

        if (data._format !== 'app-settings-v1') {
          setImportResult({ success: false, message: '格式不正確：不是有效的設定檔案' });
          return;
        }

        let imported = 0;

        // Import AI configs
        if (data.ai?.configs) {
          data.ai.configs.forEach((c: any) => saveProviderConfig(c));
          if (data.ai.activeProvider) setActiveProvider(data.ai.activeProvider);
          imported += data.ai.configs.length;
        }

        // Import TTS configs
        if (data.tts?.configs) {
          data.tts.configs.forEach((c: any) => saveTTSProviderConfig(c));
          if (data.tts.activeProvider) setActiveTTSProvider(data.tts.activeProvider);
          imported += data.tts.configs.length;
        }

        // Import STT config
        if (data.stt?.config) {
          saveSTTProviderConfig(data.stt.config);
          if (data.stt.activeProvider) setActiveSTTProvider(data.stt.activeProvider);
          imported += 1;
        }

        // Import browser settings
        if (data.browser) {
          if (data.browser.speechRate) localStorage.setItem('speechRate', data.browser.speechRate.toString());
          if (data.browser.selectedVoiceId) localStorage.setItem('selectedVoiceId', data.browser.selectedVoiceId);
          if (data.browser.darkMode !== undefined) {
            localStorage.setItem('darkMode', data.browser.darkMode.toString());
            if (data.browser.darkMode) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
          }
        }

        logger.info('Settings imported', { imported });
        setImportResult({ success: true, message: `成功匯入 ${imported} 個提供商設定！請重新整理頁面以完整套用。` });

        // Reload after short delay
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        setImportResult({ success: false, message: `解析失敗：${err instanceof Error ? err.message : '未知錯誤'}` });
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg md:text-xl text-foreground">
          <FileJson className="w-5 h-5 mr-2 text-amber-600" />
          匯入 / 匯出設定
        </CardTitle>
        <CardDescription>
          將所有 API 設定（AI、TTS、STT）匯出為 JSON 檔案，方便在新項目中快速套用。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={handleExport}
            variant="outline"
            className="flex-1 min-w-[140px] h-12 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40"
          >
            <Download className="w-4 h-4 mr-2" />
            匯出設定 (JSON)
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex-1 min-w-[140px] h-12 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40"
          >
            <Upload className="w-4 h-4 mr-2" />
            匯入設定 (JSON)
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {importResult && (
          <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
            importResult.success
              ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}>
            {importResult.success ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
            <span>{importResult.message}</span>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-100/60 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
            <p><strong>注意：</strong>匯出的 JSON 檔案包含 API Key，請妥善保管，切勿分享給他人。</p>
            <p>匯入時會覆蓋現有的同名提供商設定。</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            AI: {getAllProviderConfigs().length} 個提供商
          </Badge>
          <Badge variant="outline" className="text-xs">
            TTS: {getAllTTSProviderConfigs().length} 個提供商
          </Badge>
          <Badge variant="outline" className="text-xs">
            STT: {getSTTProviderConfig() ? '已設定' : '未設定'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsImportExport;
