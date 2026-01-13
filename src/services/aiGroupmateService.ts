// AI Groupmate Service - Generate responses from AI discussion partners
import { logger } from './logService';
import { getAgreementPhrase, getRandomDisagreementPhrase } from './conversationService';

// Using the same API endpoint as aiApiService for consistency
const AI_API_URL = 'https://aiquiz.ycm927.workers.dev';
const MIMO_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MIMO_MODEL = 'Qwen/Qwen2.5-7B-Instruct';

// Get API key from environment (will be empty in browser, need to use worker proxy)
const MIMO_API_KEY = 'sk-sltxmvec3ikcp32e7yvgfwdwcvlrozyiqqpcvuvvtvfl8m4r';

interface GroupmateResponse {
  text: string;
  stance: 'support' | 'oppose';
  groupmateName: string;
}

// Groupmate personalities
const GROUPMATES = {
  supporter: {
    name: 'Alex',
    personality: 'supportive, encouraging, builds on others ideas',
    avatar: '👩‍🎓'
  },
  opposer: {
    name: 'Jordan',
    personality: 'critical thinker, respectfully challenges ideas, offers alternative viewpoints',
    avatar: '👨‍🎓'
  }
};

export async function generateGroupmateResponse(
  topic: string,
  userTranscript: string,
  stance: 'support' | 'oppose',
  conversationHistory: string[] = []
): Promise<GroupmateResponse> {
  const groupmate = stance === 'support' ? GROUPMATES.supporter : GROUPMATES.opposer;
  
  const stanceInstruction = stance === 'support' 
    ? `You AGREE with the user's points. Start by acknowledging something specific they said, then add your own supporting argument.`
    : `You RESPECTFULLY DISAGREE with some aspect of the user's points. Start by acknowledging their perspective, then offer an alternative viewpoint or challenge their reasoning.`;

  const systemPrompt = `You are ${groupmate.name}, a ${groupmate.personality} student in a group discussion about: "${topic}".

Your task:
1. Listen carefully to what the previous speaker said
2. ${stanceInstruction}
3. Keep your response natural, conversational, and 2-4 sentences long
4. Use phrases like "${stance === 'support' ? getAgreementPhrase() : getRandomDisagreementPhrase()}" to start
5. Sound like a real student, not overly formal
6. Reference specific points the user made to show you were listening

IMPORTANT: Respond ONLY in English. Keep it concise and natural.`;

  const userPrompt = `The discussion topic is: "${topic}"

The previous speaker (a student) just said:
"${userTranscript}"

${conversationHistory.length > 0 ? `\nPrevious discussion points:\n${conversationHistory.join('\n')}\n` : ''}

Generate your response as ${groupmate.name}. Remember to:
- Reference what they specifically said
- ${stance === 'support' ? 'Build on and support their argument' : 'Respectfully offer a different perspective'}
- Keep it natural and conversational (2-4 sentences)`;

  try {
    logger.info('Generating AI groupmate response', { 
      stance, 
      groupmateName: groupmate.name,
      topicPreview: topic.substring(0, 50) 
    });

    // Try SiliconFlow API directly first
    const response = await fetch(MIMO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MIMO_API_KEY}`
      },
      body: JSON.stringify({
        model: MIMO_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 200,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content?.trim() || '';

    if (!generatedText) {
      throw new Error('Empty response from AI');
    }

    logger.info('AI groupmate response generated', {
      groupmateName: groupmate.name,
      responseLength: generatedText.length
    });

    return {
      text: generatedText,
      stance,
      groupmateName: groupmate.name
    };
  } catch (error) {
    logger.error('Failed to generate AI groupmate response', { error, stance });
    
    // Fallback responses
    const fallbackSupport = `${getAgreementPhrase()} You made a really good point there. I think that's something we should definitely consider in this discussion.`;
    const fallbackOppose = `${getRandomDisagreementPhrase()} While I understand your perspective, I wonder if we should also consider the other side of this issue.`;
    
    return {
      text: stance === 'support' ? fallbackSupport : fallbackOppose,
      stance,
      groupmateName: groupmate.name
    };
  }
}

// Text-to-Speech for groupmate responses
export async function speakGroupmateResponse(text: string, voiceType: 'male' | 'female' = 'female'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      logger.warn('Speech synthesis not supported');
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get voices
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    
    // Try to get a different voice for groupmates
    let selectedVoice = null;
    if (voiceType === 'male') {
      selectedVoice = englishVoices.find(v => 
        v.name.toLowerCase().includes('male') || 
        v.name.includes('Daniel') || 
        v.name.includes('David') ||
        v.name.includes('James') ||
        v.name.includes('Thomas')
      );
    } else {
      selectedVoice = englishVoices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.includes('Karen') || 
        v.name.includes('Moira') ||
        v.name.includes('Samantha')
      );
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else if (englishVoices.length > 0) {
      // Pick a random English voice for variety
      utterance.voice = englishVoices[Math.floor(Math.random() * englishVoices.length)];
    }

    utterance.rate = 0.95;
    utterance.pitch = voiceType === 'male' ? 0.9 : 1.1;
    utterance.volume = 1.0;

    utterance.onend = () => {
      logger.info('Groupmate speech finished');
      resolve();
    };

    utterance.onerror = (event) => {
      logger.error('Groupmate speech error', { error: event.error });
      reject(new Error(event.error));
    };

    window.speechSynthesis.speak(utterance);
  });
}

// Transcribe user audio using browser's Web Speech API
export function createSpeechRecognition(): any {
  const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognitionAPI) {
    logger.warn('Speech recognition not supported');
    return null;
  }

  const recognition = new SpeechRecognitionAPI();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  
  return recognition;
}

export const GROUPMATE_INFO = GROUPMATES;
