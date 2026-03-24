// AI Provider Service - Manage API provider settings in localStorage
import { logger } from './logService';

export interface AIProviderConfig {
  providerId: string;
  providerName: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  reasoningLevel?: 'low' | 'medium' | 'high' | 'none';
}

export interface AIProviderPreset {
  id: string;
  name: string;
  icon: string;
  baseUrl: string;
  models: { id: string; name: string; category: string }[];
  supportsReasoning?: boolean;
  description: string;
}

export const AI_PROVIDER_PRESETS: AIProviderPreset[] = [
  {
    id: 'lovable',
    name: 'Lovable AI (內建)',
    icon: '💜',
    baseUrl: '',
    description: '內建AI服務，無需API Key',
    models: [
      { id: 'google/gemini-3-flash-preview', name: 'Gemini 3 Flash Preview', category: 'Google' },
      { id: 'google/gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview', category: 'Google' },
      { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'Google' },
      { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', category: 'Google' },
      { id: 'openai/gpt-5.2', name: 'GPT-5.2', category: 'OpenAI' },
      { id: 'openai/gpt-5', name: 'GPT-5', category: 'OpenAI' },
      { id: 'openai/gpt-5-mini', name: 'GPT-5 Mini', category: 'OpenAI' },
      { id: 'openai/gpt-5-nano', name: 'GPT-5 Nano', category: 'OpenAI' },
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🟢',
    baseUrl: 'https://api.openai.com/v1',
    description: 'GPT-5.4 / GPT-5.3 Codex / o3 / o4-mini 系列模型',
    supportsReasoning: true,
    models: [
      { id: 'gpt-5.4', name: 'GPT-5.4', category: 'Flagship' },
      { id: 'gpt-5.3-codex', name: 'GPT-5.3 Codex', category: 'Flagship' },
      { id: 'gpt-5.2', name: 'GPT-5.2', category: 'Flagship' },
      { id: 'gpt-5', name: 'GPT-5', category: 'Flagship' },
      { id: 'gpt-5-mini', name: 'GPT-5 Mini', category: 'Fast' },
      { id: 'gpt-4.1', name: 'GPT-4.1', category: 'Fast' },
      { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', category: 'Fast' },
      { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', category: 'Fast' },
      { id: 'o3', name: 'o3 (Reasoning)', category: 'Reasoning' },
      { id: 'o4-mini', name: 'o4-mini (Reasoning)', category: 'Reasoning' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: '🔶',
    baseUrl: 'https://api.anthropic.com/v1',
    description: 'Opus 4.6 / Sonnet 4.6 / Claude 4 系列模型',
    models: [
      { id: 'claude-opus-4.6-20260320', name: 'Opus 4.6', category: 'Flagship' },
      { id: 'claude-sonnet-4.6-20260320', name: 'Sonnet 4.6', category: 'Balanced' },
      { id: 'claude-4-opus-20260301', name: 'Claude 4 Opus', category: 'Flagship' },
      { id: 'claude-4-sonnet-20260301', name: 'Claude 4 Sonnet', category: 'Balanced' },
      { id: 'claude-3.7-sonnet-20250219', name: 'Claude 3.7 Sonnet', category: 'Balanced' },
      { id: 'claude-3.5-haiku-20241022', name: 'Claude 3.5 Haiku', category: 'Fast' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ]
  },
  {
    id: 'google',
    name: 'Google AI Studio',
    icon: '🔵',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    description: 'Gemini 3 / Gemini 2.5 系列模型',
    models: [
      { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview', category: 'Latest' },
      { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview', category: 'Latest' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'Stable' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', category: 'Fast' },
      { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', category: 'Fast' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ]
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    icon: '🌐',
    baseUrl: 'https://openrouter.ai/api/v1',
    description: '聚合多家AI提供商，支持數百個模型',
    supportsReasoning: true,
    models: [
      { id: 'openai/gpt-5.4', name: 'GPT-5.4', category: 'OpenAI' },
      { id: 'openai/gpt-5.3-codex', name: 'GPT-5.3 Codex', category: 'OpenAI' },
      { id: 'anthropic/claude-opus-4.6', name: 'Opus 4.6', category: 'Anthropic' },
      { id: 'anthropic/claude-sonnet-4.6', name: 'Sonnet 4.6', category: 'Anthropic' },
      { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'Google' },
      { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', category: 'DeepSeek' },
      { id: 'deepseek/deepseek-v3-0324', name: 'DeepSeek V3', category: 'DeepSeek' },
      { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick', category: 'Meta' },
      { id: 'qwen/qwen3-235b-a22b', name: 'Qwen3 235B', category: 'Alibaba' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek (深度求索)',
    icon: '🐋',
    baseUrl: 'https://api.deepseek.com/v1',
    description: '高性價比推理模型，支持中英雙語',
    models: [
      { id: 'deepseek-reasoner', name: 'DeepSeek R1 (推理)', category: 'Reasoning' },
      { id: 'deepseek-chat', name: 'DeepSeek V3 (對話)', category: 'Chat' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ]
  },
  {
    id: 'zhipu',
    name: '智譜 AI (Zhipu)',
    icon: '🧠',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    description: 'GLM-4 系列，國產領先大模型',
    models: [
      { id: 'glm-4-plus', name: 'GLM-4 Plus', category: 'Flagship' },
      { id: 'glm-4-long', name: 'GLM-4 Long (長文本)', category: 'Long Context' },
      { id: 'glm-4-flash', name: 'GLM-4 Flash', category: 'Fast' },
      { id: 'glm-4-air', name: 'GLM-4 Air', category: 'Balanced' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ]
  },
  {
    id: 'qwen',
    name: '通義千問 (Qwen / Alibaba)',
    icon: '☁️',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    description: 'Qwen3 系列，阿里巴巴通義大模型',
    models: [
      { id: 'qwen3-235b-a22b', name: 'Qwen3 235B', category: 'Flagship' },
      { id: 'qwen3-30b-a3b', name: 'Qwen3 30B', category: 'Balanced' },
      { id: 'qwen-plus', name: 'Qwen Plus', category: 'Fast' },
      { id: 'qwen-turbo', name: 'Qwen Turbo', category: 'Fast' },
      { id: 'qwen-max', name: 'Qwen Max', category: 'Flagship' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ]
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    icon: '🤖',
    baseUrl: 'https://api.minimax.chat/v1',
    description: 'MiniMax 大模型，支持超長上下文',
    models: [
      { id: 'MiniMax-2.7', name: 'MiniMax-2.7', category: 'Latest' },
      { id: 'MiniMax-M1', name: 'MiniMax-M1 (推理)', category: 'Reasoning' },
      { id: 'MiniMax-Text-01', name: 'MiniMax-Text-01', category: 'Chat' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ]
  },
  {
    id: 'baichuan',
    name: '百川智能 (Baichuan)',
    icon: '🏔️',
    baseUrl: 'https://api.baichuan-ai.com/v1',
    description: 'Baichuan 系列中文大模型',
    models: [
      { id: 'Baichuan4-Turbo', name: 'Baichuan4 Turbo', category: 'Flagship' },
      { id: 'Baichuan4-Air', name: 'Baichuan4 Air', category: 'Fast' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ]
  },
  {
    id: 'moonshot',
    name: '月之暗面 (Moonshot / Kimi)',
    icon: '🌙',
    baseUrl: 'https://api.moonshot.cn/v1',
    description: 'Kimi 大模型，擅長長文本',
    models: [
      { id: 'moonshot-v1-auto', name: 'Moonshot Auto', category: 'Auto' },
      { id: 'moonshot-v1-128k', name: 'Moonshot 128K', category: 'Long Context' },
      { id: 'moonshot-v1-32k', name: 'Moonshot 32K', category: 'Balanced' },
      { id: 'moonshot-v1-8k', name: 'Moonshot 8K', category: 'Fast' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ]
  },
  {
    id: 'nvidia',
    name: 'NVIDIA NIM',
    icon: '💚',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    description: 'NVIDIA NIM 推理平台，支持多種開源模型',
    models: [
      { id: 'meta/llama-4-maverick-17b-128e-instruct', name: 'Llama 4 Maverick', category: 'Meta' },
      { id: 'deepseek-ai/deepseek-r1', name: 'DeepSeek R1', category: 'DeepSeek' },
      { id: 'qwen/qwen3-235b-a22b', name: 'Qwen3 235B', category: 'Qwen' },
      { id: 'google/gemma-3-27b-it', name: 'Gemma 3 27B', category: 'Google' },
      { id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1', name: 'Nemotron Ultra 253B', category: 'NVIDIA' },
      { id: '__custom__', name: '🔧 自行輸入模型...', category: 'Custom' },
    ]
  },
];

const STORAGE_KEY = 'ai_provider_config';
const ACTIVE_PROVIDER_KEY = 'ai_active_provider';

export function saveProviderConfig(config: AIProviderConfig): void {
  try {
    const allConfigs = getAllProviderConfigs();
    const existingIndex = allConfigs.findIndex(c => c.providerId === config.providerId);
    if (existingIndex >= 0) {
      allConfigs[existingIndex] = config;
    } else {
      allConfigs.push(config);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allConfigs));
    logger.info('Provider config saved', { providerId: config.providerId });
  } catch (error) {
    logger.error('Failed to save provider config', { error });
  }
}

export function getAllProviderConfigs(): AIProviderConfig[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getProviderConfig(providerId: string): AIProviderConfig | null {
  const configs = getAllProviderConfigs();
  return configs.find(c => c.providerId === providerId) || null;
}

export function deleteProviderConfig(providerId: string): void {
  const configs = getAllProviderConfigs().filter(c => c.providerId !== providerId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

export function setActiveProvider(providerId: string): void {
  localStorage.setItem(ACTIVE_PROVIDER_KEY, providerId);
  logger.info('Active provider set', { providerId });
}

export function getActiveProvider(): string {
  return localStorage.getItem(ACTIVE_PROVIDER_KEY) || 'lovable';
}

export function getActiveProviderConfig(): AIProviderConfig | null {
  const activeId = getActiveProvider();
  if (activeId === 'lovable') return null; // Use built-in
  return getProviderConfig(activeId);
}

// Test API connectivity
export async function testProviderConnectivity(config: AIProviderConfig): Promise<{ success: boolean; message: string; latencyMs?: number }> {
  const startTime = Date.now();
  
  try {
    // For Lovable built-in, we test via edge function
    if (config.providerId === 'lovable') {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [{ role: 'user', content: 'Say "OK" in one word.' }],
          maxTokens: 10,
          temperature: 0
        }
      });
      const latencyMs = Date.now() - startTime;
      if (error) return { success: false, message: `Edge function error: ${error.message}` };
      if (data?.error) return { success: false, message: `API error: ${data.error}` };
      return { success: true, message: `Connected! Response: "${data?.content?.substring(0, 30)}"`, latencyMs };
    }

    // For Anthropic, use their native format
    const isAnthropic = config.providerId === 'anthropic' || config.baseUrl.includes('anthropic.com');
    
    let response: Response;
    if (isAnthropic) {
      response = await fetch(`${config.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Say "OK" in one word.' }],
        }),
      });
    } else {
      // OpenAI-compatible format (most providers)
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      };

      const body: any = {
        model: config.model,
        messages: [{ role: 'user', content: 'Say "OK" in one word.' }],
        max_tokens: 10,
        temperature: 0,
      };

      // Add reasoning_effort for supported OpenAI models
      if (config.reasoningLevel && config.reasoningLevel !== 'none') {
        body.reasoning_effort = config.reasoningLevel;
      }

      response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
    }

    const latencyMs = Date.now() - startTime;
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `HTTP ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg += `: ${errorJson.error?.message || errorJson.message || errorText.substring(0, 100)}`;
      } catch {
        errorMsg += `: ${errorText.substring(0, 100)}`;
      }
      return { success: false, message: errorMsg };
    }

    const data = await response.json();
    let content = '';
    if (isAnthropic) {
      content = data.content?.[0]?.text || '';
    } else {
      content = data.choices?.[0]?.message?.content || '';
    }
    
    return { 
      success: true, 
      message: `Connected! Response: "${content.substring(0, 30)}"`,
      latencyMs 
    };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown connection error' 
    };
  }
}
