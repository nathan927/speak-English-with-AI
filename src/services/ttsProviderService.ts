// TTS Provider Service - Manage Text-to-Speech API provider settings
import { logger } from './logService';

export interface TTSProviderConfig {
  providerId: string;
  providerName: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  voiceId: string;
  speed?: number;
}

export interface TTSVoiceOption {
  id: string;
  name: string;
  gender?: string;
  language?: string;
}

export interface TTSProviderPreset {
  id: string;
  name: string;
  icon: string;
  baseUrl: string;
  description: string;
  models: { id: string; name: string; category: string }[];
  voices: TTSVoiceOption[];
  supportsSpeed?: boolean;
}

export const TTS_PROVIDER_PRESETS: TTSProviderPreset[] = [
  {
    id: 'browser',
    name: '瀏覽器內建 (Built-in)',
    icon: '🌐',
    baseUrl: '',
    description: '使用瀏覽器內建語音合成，免費但效果較機械',
    models: [],
    voices: [],
  },
  {
    id: 'grok2api-tts',
    name: 'Grok2API TTS (xAI)',
    icon: '✖️',
    baseUrl: '',
    description: '透過 Grok2API 代理使用 xAI TTS，需填入你的 Grok2API 地址',
    supportsSpeed: false,
    models: [
      { id: 'grok-tts', name: 'Grok TTS', category: 'Standard' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ],
    voices: [
      { id: 'ara', name: 'Ara (溫暖友善)', gender: 'Female' },
      { id: 'eve', name: 'Eve (活力開朗)', gender: 'Female' },
      { id: 'leo', name: 'Leo (權威有力)', gender: 'Male' },
      { id: 'rex', name: 'Rex (自信專業)', gender: 'Male' },
      { id: 'sal', name: 'Sal (流暢多用途)', gender: 'Male' },
    ],
  },
  {
    id: 'xai-tts',
    name: 'xAI Grok TTS (官方)',
    icon: '✖️',
    baseUrl: 'https://api.x.ai/v1',
    description: 'xAI 官方 TTS API，$4.2/百萬字，5種表達力語音',
    supportsSpeed: false,
    models: [
      { id: 'grok-tts', name: 'Grok TTS', category: 'Standard' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ],
    voices: [
      { id: 'ara', name: 'Ara (溫暖友善)', gender: 'Female' },
      { id: 'eve', name: 'Eve (活力開朗)', gender: 'Female' },
      { id: 'leo', name: 'Leo (權威有力)', gender: 'Male' },
      { id: 'rex', name: 'Rex (自信專業)', gender: 'Male' },
      { id: 'sal', name: 'Sal (流暢多用途)', gender: 'Male' },
    ],
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    icon: '🎙️',
    baseUrl: 'https://api.elevenlabs.io/v1',
    description: '業界頂尖仿真人語音，支持 70+ 語言、Audio Tags 情感控制',
    supportsSpeed: true,
    models: [
      { id: 'eleven_v3', name: 'Eleven v3 (最新旗艦)', category: 'Flagship' },
      { id: 'eleven_multilingual_v2', name: 'Multilingual v2 (穩定)', category: 'Premium' },
      { id: 'eleven_turbo_v2_5', name: 'Turbo v2.5 (低延遲)', category: 'Fast' },
      { id: 'eleven_flash_v2_5', name: 'Flash v2.5 (最快)', category: 'Fast' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ],
    voices: [
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (溫柔清晰)', gender: 'Female', language: 'en' },
      { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura (優雅知性)', gender: 'Female', language: 'en' },
      { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice (年輕活潑)', gender: 'Female', language: 'en' },
      { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda (成熟穩重)', gender: 'Female', language: 'en' },
      { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily (甜美自然)', gender: 'Female', language: 'en' },
      { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica (專業播報)', gender: 'Female', language: 'en' },
      { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (英式紳士)', gender: 'Male', language: 'en' },
      { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam (年輕男聲)', gender: 'Male', language: 'en' },
      { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (沉穩磁性)', gender: 'Male', language: 'en' },
      { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric (友善溫暖)', gender: 'Male', language: 'en' },
      { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger (深沉有力)', gender: 'Male', language: 'en' },
      { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian (敘事旁白)', gender: 'Male', language: 'en' },
      { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie (輕鬆隨和)', gender: 'Male', language: 'en' },
      { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum (蘇格蘭口音)', gender: 'Male', language: 'en' },
      { id: 'bIHbv24MWmeRgasZH58o', name: 'Will (自信陽光)', gender: 'Male', language: 'en' },
      { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris (活力充沛)', gender: 'Male', language: 'en' },
      { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill (老練穩重)', gender: 'Male', language: 'en' },
      { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River (中性聲線)', gender: 'Non-binary', language: 'en' },
      { id: '__custom__', name: '🔧 自行輸入語音 ID...', gender: 'Custom' },
    ],
  },
  {
    id: 'openai-tts',
    name: 'OpenAI TTS',
    icon: '🟢',
    baseUrl: 'https://api.openai.com/v1',
    description: 'GPT-4o Mini TTS / TTS-1 HD 系列語音合成',
    supportsSpeed: true,
    models: [
      { id: 'gpt-4o-mini-tts', name: 'GPT-4o Mini TTS (最新)', category: 'Latest' },
      { id: 'tts-1-hd', name: 'TTS-1 HD (高品質)', category: 'Premium' },
      { id: 'tts-1', name: 'TTS-1 (標準)', category: 'Standard' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ],
    voices: [
      { id: 'alloy', name: 'Alloy (平衡中性)', gender: 'Neutral' },
      { id: 'ash', name: 'Ash (溫暖男聲)', gender: 'Male' },
      { id: 'ballad', name: 'Ballad (柔和深沉)', gender: 'Male' },
      { id: 'coral', name: 'Coral (溫暖女聲)', gender: 'Female' },
      { id: 'echo', name: 'Echo (清晰有力)', gender: 'Male' },
      { id: 'fable', name: 'Fable (英式敘事)', gender: 'Male' },
      { id: 'nova', name: 'Nova (活力女聲)', gender: 'Female' },
      { id: 'onyx', name: 'Onyx (低沉磁性)', gender: 'Male' },
      { id: 'sage', name: 'Sage (知性女聲)', gender: 'Female' },
      { id: 'shimmer', name: 'Shimmer (明亮甜美)', gender: 'Female' },
      { id: 'verse', name: 'Verse (多用途)', gender: 'Neutral' },
      { id: '__custom__', name: '🔧 自行輸入語音 ID...', gender: 'Custom' },
    ],
  },
  {
    id: 'google-tts',
    name: 'Google Cloud TTS',
    icon: '🔵',
    baseUrl: 'https://texttospeech.googleapis.com/v1',
    description: 'Google WaveNet / Neural2 / Studio 語音',
    supportsSpeed: true,
    models: [
      { id: 'Studio', name: 'Studio (最佳)', category: 'Premium' },
      { id: 'Neural2', name: 'Neural2', category: 'Standard' },
      { id: 'WaveNet', name: 'WaveNet', category: 'Standard' },
      { id: 'Standard', name: 'Standard', category: 'Basic' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ],
    voices: [
      { id: 'en-US-Studio-O', name: 'Studio-O 美式女聲 (頂級)', gender: 'Female', language: 'en-US' },
      { id: 'en-US-Studio-Q', name: 'Studio-Q 美式男聲 (頂級)', gender: 'Male', language: 'en-US' },
      { id: 'en-US-Neural2-C', name: 'Neural2-C 美式女聲', gender: 'Female', language: 'en-US' },
      { id: 'en-US-Neural2-D', name: 'Neural2-D 美式男聲', gender: 'Male', language: 'en-US' },
      { id: 'en-US-Neural2-A', name: 'Neural2-A 美式男聲 (深沉)', gender: 'Male', language: 'en-US' },
      { id: 'en-US-Neural2-E', name: 'Neural2-E 美式女聲 (明亮)', gender: 'Female', language: 'en-US' },
      { id: 'en-US-Neural2-F', name: 'Neural2-F 美式女聲 (溫暖)', gender: 'Female', language: 'en-US' },
      { id: 'en-US-Neural2-G', name: 'Neural2-G 美式女聲 (年輕)', gender: 'Female', language: 'en-US' },
      { id: 'en-US-Neural2-H', name: 'Neural2-H 美式女聲 (成熟)', gender: 'Female', language: 'en-US' },
      { id: 'en-US-Neural2-I', name: 'Neural2-I 美式男聲 (專業)', gender: 'Male', language: 'en-US' },
      { id: 'en-US-Neural2-J', name: 'Neural2-J 美式男聲 (年輕)', gender: 'Male', language: 'en-US' },
      { id: 'en-GB-Neural2-A', name: 'Neural2-A 英式女聲', gender: 'Female', language: 'en-GB' },
      { id: 'en-GB-Neural2-B', name: 'Neural2-B 英式男聲', gender: 'Male', language: 'en-GB' },
      { id: 'en-GB-Neural2-C', name: 'Neural2-C 英式女聲 (優雅)', gender: 'Female', language: 'en-GB' },
      { id: 'en-GB-Neural2-D', name: 'Neural2-D 英式男聲 (紳士)', gender: 'Male', language: 'en-GB' },
      { id: 'en-AU-Neural2-A', name: 'Neural2-A 澳洲女聲', gender: 'Female', language: 'en-AU' },
      { id: 'en-AU-Neural2-B', name: 'Neural2-B 澳洲男聲', gender: 'Male', language: 'en-AU' },
      { id: '__custom__', name: '🔧 自行輸入語音 ID...', gender: 'Custom' },
    ],
  },
  {
    id: 'azure-tts',
    name: 'Azure Speech',
    icon: '🔷',
    baseUrl: '',
    description: 'Microsoft Azure 語音服務，支持 SSML',
    supportsSpeed: true,
    models: [
      { id: 'neural', name: 'Neural (標準)', category: 'Standard' },
      { id: 'neural-hd', name: 'Neural HD (高品質)', category: 'Premium' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ],
    voices: [
      { id: 'en-US-JennyNeural', name: 'Jenny 美式女聲 (友善)', gender: 'Female', language: 'en-US' },
      { id: 'en-US-AriaNeural', name: 'Aria 美式女聲 (自然)', gender: 'Female', language: 'en-US' },
      { id: 'en-US-SaraNeural', name: 'Sara 美式女聲 (溫柔)', gender: 'Female', language: 'en-US' },
      { id: 'en-US-MichelleNeural', name: 'Michelle 美式女聲 (優雅)', gender: 'Female', language: 'en-US' },
      { id: 'en-US-AmberNeural', name: 'Amber 美式女聲 (溫暖)', gender: 'Female', language: 'en-US' },
      { id: 'en-US-AnaNeural', name: 'Ana 美式女聲 (年輕)', gender: 'Female', language: 'en-US' },
      { id: 'en-US-GuyNeural', name: 'Guy 美式男聲 (專業)', gender: 'Male', language: 'en-US' },
      { id: 'en-US-DavisNeural', name: 'Davis 美式男聲 (沉穩)', gender: 'Male', language: 'en-US' },
      { id: 'en-US-JasonNeural', name: 'Jason 美式男聲 (自信)', gender: 'Male', language: 'en-US' },
      { id: 'en-US-TonyNeural', name: 'Tony 美式男聲 (友善)', gender: 'Male', language: 'en-US' },
      { id: 'en-US-BrandonNeural', name: 'Brandon 美式男聲 (年輕)', gender: 'Male', language: 'en-US' },
      { id: 'en-US-ChristopherNeural', name: 'Christopher 美式男聲 (權威)', gender: 'Male', language: 'en-US' },
      { id: 'en-GB-SoniaNeural', name: 'Sonia 英式女聲', gender: 'Female', language: 'en-GB' },
      { id: 'en-GB-LibbyNeural', name: 'Libby 英式女聲 (活潑)', gender: 'Female', language: 'en-GB' },
      { id: 'en-GB-MaisieNeural', name: 'Maisie 英式女聲 (年輕)', gender: 'Female', language: 'en-GB' },
      { id: 'en-GB-RyanNeural', name: 'Ryan 英式男聲', gender: 'Male', language: 'en-GB' },
      { id: 'en-GB-ThomasNeural', name: 'Thomas 英式男聲 (紳士)', gender: 'Male', language: 'en-GB' },
      { id: 'en-AU-NatashaNeural', name: 'Natasha 澳洲女聲', gender: 'Female', language: 'en-AU' },
      { id: 'en-AU-WilliamNeural', name: 'William 澳洲男聲', gender: 'Male', language: 'en-AU' },
      { id: '__custom__', name: '🔧 自行輸入語音 ID...', gender: 'Custom' },
    ],
  },
  {
    id: 'minimax-tts',
    name: 'MiniMax TTS',
    icon: '🤖',
    baseUrl: 'https://api.minimax.chat/v1',
    description: 'MiniMax 語音合成，支持中英雙語',
    supportsSpeed: true,
    models: [
      { id: 'speech-02-hd', name: 'Speech-02 HD', category: 'Premium' },
      { id: 'speech-02', name: 'Speech-02', category: 'Standard' },
      { id: 'speech-01-turbo', name: 'Speech-01 Turbo', category: 'Fast' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ],
    voices: [
      { id: 'male-qn-qingse', name: '青澀青年', gender: 'Male' },
      { id: 'female-shaonv', name: '少女', gender: 'Female' },
      { id: 'female-yujie', name: '御姐', gender: 'Female' },
      { id: 'male-qn-jingying', name: '精英青年', gender: 'Male' },
      { id: 'presenter_female', name: 'Presenter Female', gender: 'Female' },
      { id: 'presenter_male', name: 'Presenter Male', gender: 'Male' },
    ],
  },
  {
    id: 'fish-audio',
    name: 'Fish Audio',
    icon: '🐟',
    baseUrl: 'https://api.fish.audio/v1',
    description: '開源高品質語音合成，支持 voice cloning',
    supportsSpeed: true,
    models: [
      { id: 'speech-1.5', name: 'Speech 1.5', category: 'Latest' },
      { id: 'speech-1', name: 'Speech 1', category: 'Stable' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ],
    voices: [
      { id: 'default', name: 'Default', gender: 'Female' },
    ],
  },
  {
    id: 'volcengine-tts',
    name: '火山引擎 TTS (ByteDance)',
    icon: '🌋',
    baseUrl: 'https://openspeech.bytedance.com/api/v1',
    description: '字節跳動語音合成，高品質中英文',
    supportsSpeed: true,
    models: [
      { id: 'mega_tts', name: 'Mega TTS (最佳)', category: 'Premium' },
      { id: 'tts_async', name: 'TTS Async', category: 'Standard' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ],
    voices: [
      { id: 'en_us_narrator', name: 'US Narrator', gender: 'Male', language: 'en-US' },
      { id: 'en_female_sarah', name: 'Sarah', gender: 'Female', language: 'en-US' },
    ],
  },
  {
    id: 'xunfei-tts',
    name: '訊飛語音 (iFlytek)',
    icon: '🎤',
    baseUrl: 'https://tts-api.xfyun.cn/v2',
    description: '科大訊飛語音合成，中文優化',
    models: [
      { id: 'xtts', name: 'xTTS (最新)', category: 'Latest' },
      { id: 'normal', name: '標準合成', category: 'Standard' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ],
    voices: [
      { id: 'xiaoyan', name: '小燕 (Female)', gender: 'Female' },
      { id: 'aisjiuxu', name: '許久 (Male)', gender: 'Male' },
      { id: 'catherine', name: 'Catherine (English)', gender: 'Female', language: 'en' },
    ],
  },
];

const TTS_STORAGE_KEY = 'tts_provider_config';
const TTS_ACTIVE_KEY = 'tts_active_provider';

export function saveTTSProviderConfig(config: TTSProviderConfig): void {
  try {
    const allConfigs = getAllTTSProviderConfigs();
    const idx = allConfigs.findIndex(c => c.providerId === config.providerId);
    if (idx >= 0) allConfigs[idx] = config;
    else allConfigs.push(config);
    localStorage.setItem(TTS_STORAGE_KEY, JSON.stringify(allConfigs));
    logger.info('TTS provider config saved', { providerId: config.providerId });
  } catch (error) {
    logger.error('Failed to save TTS provider config', { error });
  }
}

export function getAllTTSProviderConfigs(): TTSProviderConfig[] {
  try {
    const stored = localStorage.getItem(TTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

export function getTTSProviderConfig(providerId: string): TTSProviderConfig | null {
  return getAllTTSProviderConfigs().find(c => c.providerId === providerId) || null;
}

export function deleteTTSProviderConfig(providerId: string): void {
  const configs = getAllTTSProviderConfigs().filter(c => c.providerId !== providerId);
  localStorage.setItem(TTS_STORAGE_KEY, JSON.stringify(configs));
}

export function setActiveTTSProvider(providerId: string): void {
  localStorage.setItem(TTS_ACTIVE_KEY, providerId);
  logger.info('Active TTS provider set', { providerId });
}

export function getActiveTTSProvider(): string {
  return localStorage.getItem(TTS_ACTIVE_KEY) || 'browser';
}

export function getActiveTTSProviderConfig(): TTSProviderConfig | null {
  const id = getActiveTTSProvider();
  if (id === 'browser') return null;
  return getTTSProviderConfig(id);
}

// Test TTS connectivity by generating a short audio clip
export async function testTTSConnectivity(config: TTSProviderConfig): Promise<{ success: boolean; message: string; latencyMs?: number }> {
  const startTime = Date.now();
  const testText = 'Hello, this is a voice test.';

  try {
    if (config.providerId === 'browser') {
      return { success: true, message: '瀏覽器內建語音正常', latencyMs: 0 };
    }

    const { supabase } = await import('@/integrations/supabase/client');
    const { data, error } = await supabase.functions.invoke('tts-proxy', {
      body: {
        text: testText,
        providerId: config.providerId,
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
        model: config.model,
        voiceId: config.voiceId,
        speed: config.speed || 1.0,
        testOnly: true,
      }
    });

    const latencyMs = Date.now() - startTime;

    if (error) return { success: false, message: `Edge function error: ${error.message}` };
    if (data?.error) return { success: false, message: `API error: ${data.error}` };

    return { success: true, message: `連線成功！延遲 ${latencyMs}ms`, latencyMs };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}
