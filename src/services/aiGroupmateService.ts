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
  groupmateInfo?: { name: string; gender: 'male' | 'female'; avatar: string },
  userName?: string
): Promise<GroupmateResponse> {
  // Use provided info or generate random
  const groupmate = groupmateInfo || generateRandomGroupmate();
  
  // How to address the user
  const userAddress = userName?.trim() ? userName.trim() : '';
  const addressInstruction = userAddress 
    ? `IMPORTANT: The speaker's name is ${userAddress}. Naturally use their name occasionally (e.g., "I agree with ${userAddress}..." or "That's a great point, ${userAddress}...") but don't overuse it.`
    : '';
  
  // Detailed exam-style prompts with reasoning and examples
  const stanceInstruction = stance === 'support' 
    ? `You AGREE with and BUILD UPON the speaker's argument. You must:
       - First, explicitly acknowledge their KEY POINT by paraphrasing it
       - Then provide 1-2 STRONG supporting reasons with logical explanation
       - Include a CONCRETE EXAMPLE (real-life scenario, statistics, or personal experience)
       - End with an INSIGHT that extends or deepens their thinking`
    : `You RESPECTFULLY CHALLENGE the speaker's viewpoint. You must:
       - First, acknowledge what they said fairly ("You raise a good point about X, however...")
       - Then present 1-2 COUNTER-ARGUMENTS with clear reasoning
       - Include a CONCRETE EXAMPLE that supports YOUR alternative view
       - Offer a different perspective or INSIGHT they may not have considered`;

  const systemPrompt = `You are ${groupmate.name}, a highly articulate secondary school student in Hong Kong participating in a FORMAL DSE English Speaking Examination group discussion.

THIS IS AN EXAM SETTING - You must demonstrate:
✓ Critical thinking with logical reasoning
✓ Use of concrete examples (real cases, statistics, scenarios)
✓ Insightful analysis that shows depth of thought
✓ Natural conversation flow with proper discourse markers
✓ Academic vocabulary appropriate for exam

YOUR ROLE: ${stanceInstruction}

${addressInstruction}

RESPONSE STRUCTURE (4-6 sentences):
1. ACKNOWLEDGE: Reference the speaker's specific point
2. RESPOND: State your position with clear reasoning  
3. EXAMPLE: Give a concrete, relevant example
4. INSIGHT: Add depth with further analysis or implications

DISCOURSE MARKERS TO USE:
- Agreement: "I completely agree with your point about...", "Building on what you said...", "That's exactly what I was thinking..."
- Disagreement: "While I understand your perspective on...", "That's a fair point, but we should also consider...", "I see where you're coming from, however..."
- Adding examples: "For instance...", "Take for example...", "A good case in point would be..."
- Showing insight: "What's interesting is...", "This also relates to...", "Looking at the bigger picture..."

SPEAK NATURALLY but SUBSTANTIVELY. Show you are actively listening and THINKING CRITICALLY.

RESPOND IN ENGLISH ONLY.`;

  const userPrompt = `=== DSE GROUP DISCUSSION ===

TOPIC: "${topic}"

${userAddress ? `SPEAKER'S NAME: ${userAddress}` : ''}

WHAT THE PREVIOUS SPEAKER SAID (you MUST respond directly to THIS):
"${userTranscript}"

${conversationHistory.length > 0 ? `DISCUSSION CONTEXT:\n${conversationHistory.slice(-4).join('\n')}\n` : ''}

YOUR TASK as ${groupmate.name}:
1. DIRECTLY reference and respond to: "${userTranscript}"
2. ${stance === 'support' ? 'AGREE and strengthen their argument with your own reasoning and example' : 'POLITELY DISAGREE and offer counter-arguments with your own example'}
3. Show INSIGHT and critical thinking
4. Keep response 4-6 sentences, exam-appropriate but natural
${userAddress ? `5. Naturally use the speaker's name "${userAddress}" once or twice in your response` : ''}

Remember: This is a REAL exam. Show the examiner you can think critically, use examples, and engage meaningfully with others' ideas.`;

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
        max_tokens: 300, // Increased for more detailed responses
        temperature: 0.85 // Slightly lower for more coherent reasoning
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
    
    // Improved fallback with exam-style response
    const keywords = userTranscript.split(' ').filter(w => w.length > 3).slice(0, 4);
    const keywordPhrase = keywords.length > 0 ? keywords.join(' ') : 'this topic';
    
    const fallbackSupport = `I completely agree with your point about ${keywordPhrase}. Building on what you said, I think this is particularly important because it affects many students in Hong Kong. For example, in my own experience, I've seen how this issue impacts daily life. What's interesting is that this connects to broader social trends we're seeing today.`;
    
    const fallbackOppose = `That's a fair point about ${keywordPhrase}, but I'd like to offer a different perspective. While I understand where you're coming from, we should also consider that there are alternative viewpoints. For instance, some people might argue that the opposite is true in certain situations. Looking at the bigger picture, I think we need to weigh both sides carefully.`;
    
    return {
      text: stance === 'support' ? fallbackSupport : fallbackOppose,
      stance,
      groupmateName: groupmate.name,
      gender: groupmate.gender,
      avatar: groupmate.avatar
    };
  }
}

// Stop any ongoing speech
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
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
