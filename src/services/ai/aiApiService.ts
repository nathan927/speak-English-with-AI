// AI API Service - Calls the Lovable AI Edge Function
import { supabase } from '@/integrations/supabase/client';
import { logger } from '../logService';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  maxTokens?: number;
  temperature?: number;
}

export async function callAI(
  messages: Message[],
  options: ChatOptions = {}
): Promise<string> {
  const { maxTokens = 350, temperature = 0.85 } = options;

  logger.info('Calling AI via Edge Function', { 
    messageCount: messages.length,
    lastMessage: messages[messages.length - 1]?.content?.substring(0, 50)
  });

  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { messages, maxTokens, temperature }
    });

    if (error) {
      logger.error('Edge function error', { error });
      throw new Error(error.message || 'Failed to call AI');
    }

    if (data?.error) {
      logger.error('AI API error', { error: data.error });
      throw new Error(data.error);
    }

    const content = data?.content || '';
    
    if (!content) {
      throw new Error('Empty response from AI');
    }

    logger.info('AI response received', { preview: content.substring(0, 50) });
    return content;
  } catch (error) {
    logger.error('Failed to call AI', { error });
    throw error;
  }
}

// Generate a discussion response using system and user prompts
export async function generateDiscussionResponse(
  systemPrompt: string,
  userPrompt: string,
  options?: ChatOptions
): Promise<string> {
  const messages: Message[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  return callAI(messages, options);
}

// Legacy function for backward compatibility with evaluation service
export async function callApi(systemPrompt: string, userPrompt: string, base64Audio: string[] = []): Promise<string> {
  // Note: base64Audio is currently not supported by the new API
  // The evaluation will work based on text transcription
  return generateDiscussionResponse(systemPrompt, userPrompt, { maxTokens: 8192, temperature: 0.3 });
}
