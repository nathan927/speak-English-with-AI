// AI Groupmate Service - Generate responses from AI discussion partners
import { logger } from './logService';

// Using the same API endpoint as aiApiService for consistency
const AI_API_URL = 'https://aiquiz.ycm927.workers.dev';
const MIMO_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MIMO_MODEL = 'Qwen/Qwen2.5-7B-Instruct';

// Get API key from environment
const MIMO_API_KEY = 'sk-sltxmvec3ikcp32e7yvgfwdwcvlrozyiqqpcvuvvtvfl8m4r';

interface GroupmateResponse {
  text: string;
  stance: 'support' | 'oppose';
  groupmateName: string;
  gender: 'male' | 'female';
  avatar: string;
}

// Random name pools for variety
const MALE_NAMES = ['Alex', 'Jordan', 'Chris', 'Sam', 'Max', 'Ryan', 'Tom', 'Jake'];
const FEMALE_NAMES = ['Emma', 'Lily', 'Sophie', 'Mia', 'Chloe', 'Zoe', 'Amy', 'Kate'];
const MALE_AVATARS = ['👨‍🎓', '🧑‍💼', '👦', '🙋‍♂️'];
const FEMALE_AVATARS = ['👩‍🎓', '👧', '🙋‍♀️', '💁‍♀️'];

// Generate random groupmate identity
export function generateRandomGroupmate(): { name: string; gender: 'male' | 'female'; avatar: string } {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const names = gender === 'male' ? MALE_NAMES : FEMALE_NAMES;
  const avatars = gender === 'male' ? MALE_AVATARS : FEMALE_AVATARS;
  
  return {
    name: names[Math.floor(Math.random() * names.length)],
    gender,
    avatar: avatars[Math.floor(Math.random() * avatars.length)]
  };
}

export async function generateGroupmateResponse(
  topic: string,
  userTranscript: string,
  stance: 'support' | 'oppose',
  conversationHistory: string[] = [],
  groupmateInfo?: { name: string; gender: 'male' | 'female'; avatar: string }
): Promise<GroupmateResponse> {
  // Use provided info or generate random
  const groupmate = groupmateInfo || generateRandomGroupmate();
  
  // More specific and contextual prompts
  const stanceInstruction = stance === 'support' 
    ? `You STRONGLY AGREE with what the speaker just said. You must:
       - DIRECTLY quote or paraphrase their EXACT words (e.g., "I totally agree that [what they said]...")
       - Add a specific supporting reason or example that relates to THEIR point
       - Show enthusiasm for their specific idea`
    : `You POLITELY DISAGREE with what the speaker just said. You must:
       - First acknowledge their SPECIFIC point (e.g., "You mentioned [their point], but...")  
       - Offer a concrete counter-argument or alternative view
       - Be respectful but challenge their reasoning`;

  const systemPrompt = `You are ${groupmate.name}, a ${groupmate.gender === 'male' ? 'male' : 'female'} secondary school student in Hong Kong having a casual group discussion.

CRITICAL RULES:
1. You MUST directly reference what the previous speaker ACTUALLY said - use their exact words or ideas
2. Your response must be SPECIFICALLY about what they talked about, not generic
3. Keep it short: 2-3 sentences maximum
4. Sound like a real teenager, use casual language
5. ${stanceInstruction}

Example of GOOD response if user said "I like pizza because it's cheesy":
- Support: "Oh I'm with you on the pizza thing! The cheesy part is the best, especially when it stretches. Have you tried stuffed crust?"
- Oppose: "Pizza's okay, but honestly I think the cheese makes it too heavy. I'd rather have something lighter like sushi."

Example of BAD response (too generic, doesn't reference what user said):
- "That's an interesting point. I think we should consider different perspectives."

RESPOND IN ENGLISH ONLY. Be natural and conversational.`;

  const userPrompt = `DISCUSSION TOPIC: "${topic}"

THE PREVIOUS SPEAKER JUST SAID (you MUST respond to THIS):
"${userTranscript}"

${conversationHistory.length > 0 ? `Earlier in the discussion:\n${conversationHistory.slice(-3).join('\n')}\n` : ''}

Now respond as ${groupmate.name}. Your response MUST:
1. Mention something specific from "${userTranscript}"
2. ${stance === 'support' ? 'Agree and build on their point' : 'Politely disagree with a reason'}
3. Be 2-3 sentences, casual and natural`;

  try {
    logger.info('Generating AI groupmate response', { 
      stance, 
      groupmateName: groupmate.name,
      userSaid: userTranscript.substring(0, 50),
      topic: topic.substring(0, 30)
    });

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
        max_tokens: 150,
        temperature: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    let generatedText = data.choices?.[0]?.message?.content?.trim() || '';

    if (!generatedText) {
      throw new Error('Empty response from AI');
    }

    // Clean up the response - remove quotes if the AI wrapped it
    generatedText = generatedText.replace(/^["']|["']$/g, '').trim();

    logger.info('AI groupmate response generated', {
      groupmateName: groupmate.name,
      responsePreview: generatedText.substring(0, 50)
    });

    return {
      text: generatedText,
      stance,
      groupmateName: groupmate.name,
      gender: groupmate.gender,
      avatar: groupmate.avatar
    };
  } catch (error) {
    logger.error('Failed to generate AI groupmate response', { error, stance });
    
    // Smart fallback that tries to reference the user's words
    const keywords = userTranscript.split(' ').filter(w => w.length > 3).slice(0, 3);
    const keywordPhrase = keywords.length > 0 ? keywords.join(' ') : 'that';
    
    const fallbackSupport = `Yeah, I totally get what you mean about ${keywordPhrase}. That's a really good point actually!`;
    const fallbackOppose = `Hmm, I see what you're saying about ${keywordPhrase}, but I'm not sure I agree. Maybe we should think about it differently?`;
    
    return {
      text: stance === 'support' ? fallbackSupport : fallbackOppose,
      stance,
      groupmateName: groupmate.name,
      gender: groupmate.gender,
      avatar: groupmate.avatar
    };
  }
}

// Text-to-Speech for groupmate responses with natural speed
export async function speakGroupmateResponse(text: string, gender: 'male' | 'female' = 'female'): Promise<void> {
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
    
    // Try to get appropriate voice by gender
    let selectedVoice = null;
    
    if (gender === 'male') {
      // Look for male voices
      selectedVoice = englishVoices.find(v => 
        v.name.includes('Daniel') || 
        v.name.includes('David') ||
        v.name.includes('James') ||
        v.name.includes('Thomas') ||
        v.name.includes('Alex') ||
        v.name.includes('Fred') ||
        v.name.toLowerCase().includes('male')
      );
    } else {
      // Look for female voices
      selectedVoice = englishVoices.find(v => 
        v.name.includes('Karen') || 
        v.name.includes('Moira') ||
        v.name.includes('Samantha') ||
        v.name.includes('Victoria') ||
        v.name.includes('Fiona') ||
        v.name.toLowerCase().includes('female')
      );
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else if (englishVoices.length > 0) {
      // Pick a random English voice
      utterance.voice = englishVoices[Math.floor(Math.random() * englishVoices.length)];
    }

    // Natural speech settings - slightly slower for clarity
    utterance.rate = 0.85 + Math.random() * 0.15; // 0.85-1.0 for variety
    utterance.pitch = gender === 'male' ? 0.85 + Math.random() * 0.1 : 1.0 + Math.random() * 0.15;
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

// Export for UI display
export const getGroupmateDisplay = (name: string, gender: 'male' | 'female', stance: 'support' | 'oppose', avatar: string) => {
  return {
    label: `${avatar} ${name} (${stance === 'support' ? 'Supportive' : 'Critical'})`,
    avatar,
    name,
    gender,
    stance
  };
};
