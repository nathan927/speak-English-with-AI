// STT Provider Service - Manage Speech-to-Text provider settings
import { logger } from './logService';

export interface STTProviderConfig {
  providerId: string; // 'browser' | 'grok2api-stt' | 'xai-stt'
  baseUrl: string;
  apiKey: string;
  model: string;
}

const STT_ACTIVE_KEY = 'stt_active_provider';
const STT_CONFIG_KEY = 'stt_provider_config';

export function getActiveSTTProvider(): string {
  return localStorage.getItem(STT_ACTIVE_KEY) || 'browser';
}

export function setActiveSTTProvider(providerId: string): void {
  localStorage.setItem(STT_ACTIVE_KEY, providerId);
  logger.info('Active STT provider set', { providerId });
}

export function getSTTProviderConfig(): STTProviderConfig | null {
  try {
    const stored = localStorage.getItem(STT_CONFIG_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveSTTProviderConfig(config: STTProviderConfig): void {
  localStorage.setItem(STT_CONFIG_KEY, JSON.stringify(config));
  logger.info('STT provider config saved', { providerId: config.providerId });
}

// Transcribe audio using external STT provider via edge function
export async function transcribeWithExternalSTT(audioBlob: Blob): Promise<string> {
  const config = getSTTProviderConfig();
  if (!config) throw new Error('No STT provider configured');

  // Convert blob to base64
  const base64Audio = await blobToBase64(audioBlob);

  const { supabase } = await import('@/integrations/supabase/client');
  const { data, error } = await supabase.functions.invoke('stt-proxy', {
    body: {
      audio: base64Audio,
      providerId: config.providerId,
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      model: config.model,
    }
  });

  if (error) throw new Error(`STT edge function error: ${error.message}`);
  if (data?.error) throw new Error(`STT API error: ${data.error}`);
  if (!data?.text) throw new Error('No transcription returned');

  return data.text;
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:audio/webm;base64,")
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
