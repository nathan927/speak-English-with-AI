// AI Groupmate Service - Generate responses from AI discussion partners
import { logger } from './logService';

// API Configuration - Two providers for variety and reliability
const AI_PROVIDERS = [
  {
    name: 'SiliconFlow',
    url: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'Qwen/Qwen2.5-7B-Instruct',
    apiKey: 'sk-sltxmvec3ikcp32e7yvgfwdwcvlrozyiqqpcvuvvtvfl8m4r'
  },
  {
    name: 'OpenRouter',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'google/gemini-2.0-flash-exp:free',
    apiKey: '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'
  }
];

// Randomly select a provider
function getRandomProvider() {
  const provider = AI_PROVIDERS[Math.floor(Math.random() * AI_PROVIDERS.length)];
  logger.info('Selected AI provider', { name: provider.name, model: provider.model });
  return provider;
}

// Generate AI-powered natural discussion opening
export async function generateDiscussionOpening(
  topic: string,
  supporterName: string,
  opposerName: string,
  userName?: string,
  grade?: string
): Promise<string> {
  const provider = getRandomProvider();
  
  const systemPrompt = `You are ${supporterName}, a friendly and confident student about to lead a group discussion in a speaking exam.

YOUR TASK: Create a NATURAL, conversational opening that:
1. Briefly introduces yourself and ${opposerName}${userName ? ` and welcome ${userName}` : ''}
2. REPHRASE the topic in your own words - DO NOT quote it verbatim
3. Highlight the KEY QUESTION or dilemma in an engaging way
4. Invite everyone to share their views

STYLE REQUIREMENTS:
- Sound like a real student, NOT a robot or moderator
- Be warm, casual but appropriate for an exam setting
- Show genuine interest in the topic
- Use varied expressions - don't always start the same way
- Keep it 3-5 sentences, concise but inviting

NEVER:
- Read the topic word-for-word
- Sound scripted or formal like "Today's discussion topic is..."
- Use bullet points or numbered lists

Examples of good openers:
- "Hey everyone! I'm Alex, and this is Emma. So, we're here to talk about something pretty relevant to all of us..."
- "Hi! I'm Sophie, joined by Jake today. You know, I've been thinking a lot about this issue lately..."
- "What's up everyone! I'm Chris, and Emma's here too. So basically, we need to figure out..."`;

  const userPrompt = `Create a discussion opening for:

TOPIC: "${topic}"
GRADE LEVEL: ${grade || 'Secondary'}
YOUR NAME: ${supporterName}
PARTNER: ${opposerName}
${userName ? `PARTICIPANT: ${userName}` : ''}

Remember: Rephrase the topic naturally, don't quote it. Sound like a real student starting a conversation with friends.`;

  try {
    const response = await fetch(provider.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'English Speaking Practice'
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 200,
        temperature: 0.95 // Higher for more variety
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content?.trim() || '';
    text = text.replace(/^["']|["']$/g, '').trim();
    
    if (!text) throw new Error('Empty response');
    
    logger.info('Generated AI discussion opening', { preview: text.substring(0, 50) });
    return text;
  } catch (error) {
    logger.error('Failed to generate AI opening', { error });
    throw error;
  }
}

interface GroupmateResponse {
  text: string;
  stance: 'support' | 'oppose' | 'mediator';
  groupmateName: string;
  gender: 'male' | 'female';
  avatar: string;
}

// Argument feedback interface
export interface ArgumentFeedback {
  strength: 'weak' | 'moderate' | 'strong';
  score: number; // 1-10
  positives: string[];
  improvements: string[];
}

// Analyze user's argument and provide real-time feedback
export async function analyzeArgumentStrength(
  userTranscript: string,
  topic: string
): Promise<ArgumentFeedback> {
  const provider = getRandomProvider();
  
  const systemPrompt = `You are an expert speaking examiner. Analyze the student's argument and provide feedback in JSON format.

Evaluate based on:
1. RELEVANCE: Does it address the topic directly?
2. REASONING: Is the logic clear and sound?
3. EXAMPLES: Are there concrete examples or evidence?
4. VOCABULARY: Is the language appropriate and varied?
5. STRUCTURE: Is the argument well-organized?

Return ONLY valid JSON (no markdown):
{
  "strength": "weak" | "moderate" | "strong",
  "score": 1-10,
  "positives": ["1-2 specific things done well"],
  "improvements": ["1-2 specific actionable suggestions"]
}`;

  try {
    const response = await fetch(provider.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'English Speaking Practice'
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `TOPIC: "${topic}"\n\nSTUDENT SAID: "${userTranscript}"\n\nAnalyze and return JSON only.` }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });

    if (!response.ok) throw new Error('API failed');
    
    const data = await response.json();
    let text = data.choices?.[0]?.message?.content?.trim() || '';
    
    // Clean up potential markdown wrapping
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(text);
    return {
      strength: parsed.strength || 'moderate',
      score: Math.min(10, Math.max(1, parsed.score || 5)),
      positives: parsed.positives || ['Good attempt'],
      improvements: parsed.improvements || ['Try adding more examples']
    };
  } catch (error) {
    logger.error('Failed to analyze argument', { error });
    // Fallback analysis based on simple heuristics
    const wordCount = userTranscript.split(' ').length;
    const hasExample = /for example|for instance|such as|like when/i.test(userTranscript);
    const hasBecause = /because|since|therefore|so that/i.test(userTranscript);
    
    let score = 5;
    if (wordCount > 30) score += 1;
    if (wordCount > 50) score += 1;
    if (hasExample) score += 2;
    if (hasBecause) score += 1;
    
    return {
      strength: score >= 7 ? 'strong' : score >= 5 ? 'moderate' : 'weak',
      score: Math.min(10, score),
      positives: hasExample ? ['Good use of examples'] : ['You shared your opinion'],
      improvements: !hasExample ? ['Try adding a specific example'] : ['Consider addressing counter-arguments']
    };
  }
}

// Generate mediator response - summarizes and asks follow-up questions
export async function generateMediatorResponse(
  topic: string,
  conversationHistory: string[],
  mediatorInfo: { name: string; gender: 'male' | 'female'; avatar: string },
  userName?: string,
  shouldAskQuestion: boolean = true
): Promise<GroupmateResponse> {
  const provider = getRandomProvider();
  
  const userAddress = userName?.trim() || '';
  
  const systemPrompt = `You are ${mediatorInfo.name}, a thoughtful MEDIATOR in a group discussion exam.

YOUR ROLE:
- SUMMARIZE the key points from different speakers concisely
- CONNECT different viewpoints to show how they relate
- ASK thought-provoking FOLLOW-UP QUESTIONS to deepen discussion
- INVITE specific people to respond or share more

${userAddress ? `The main participant is ${userAddress}. Address them by name when asking questions.` : ''}

MEDIATOR TECHNIQUES:
- "So we've heard two interesting perspectives: [X] and [Y]. But I'm curious about..."
- "That's a great point, and it makes me wonder - what do you think about...?"
- "${userAddress || 'You'}, I'd love to hear your take on [specific aspect]..."
- "Building on what everyone said, let me ask: [deeper question]?"
- "It seems like we agree on X but differ on Y. ${userAddress || 'What'}'s your view?"

Keep it 3-4 sentences. Be warm, curious, and encouraging.`;

  const userPrompt = `TOPIC: "${topic}"

DISCUSSION SO FAR:
${conversationHistory.slice(-6).join('\n')}

YOUR TASK as ${mediatorInfo.name} (Mediator):
1. Briefly acknowledge or summarize what's been discussed
2. ${shouldAskQuestion ? `Ask a thought-provoking follow-up question to ${userAddress || 'the group'}` : 'Share an insight that connects different viewpoints'}
3. Keep it natural and conversational`;

  try {
    const response = await fetch(provider.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'English Speaking Practice'
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 200,
        temperature: 0.85
      })
    });

    if (!response.ok) throw new Error('API failed');
    
    const data = await response.json();
    let text = data.choices?.[0]?.message?.content?.trim() || '';
    text = text.replace(/^["']|["']$/g, '').trim();
    
    return {
      text: text || `That's interesting! ${userAddress ? `${userAddress}, what` : 'What'} do you think about the other side of this issue?`,
      stance: 'mediator',
      groupmateName: mediatorInfo.name,
      gender: mediatorInfo.gender,
      avatar: mediatorInfo.avatar
    };
  } catch (error) {
    logger.error('Failed to generate mediator response', { error });
    return {
      text: `Great points from everyone! ${userAddress ? `${userAddress}, I'm` : "I'm"} curious - can you give us a specific example from your own experience?`,
      stance: 'mediator',
      groupmateName: mediatorInfo.name,
      gender: mediatorInfo.gender,
      avatar: mediatorInfo.avatar
    };
  }
}

// Random name pools for variety
const MALE_NAMES = ['Alex', 'Jordan', 'Chris', 'Sam', 'Max', 'Ryan', 'Tom', 'Jake'];
const FEMALE_NAMES = ['Emma', 'Lily', 'Sophie', 'Mia', 'Chloe', 'Zoe', 'Amy', 'Kate'];
const MEDIATOR_NAMES = ['Jamie', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn'];
const MALE_AVATARS = ['👨‍🎓', '🧑‍💼', '👦', '🙋‍♂️'];
const FEMALE_AVATARS = ['👩‍🎓', '👧', '🙋‍♀️', '💁‍♀️'];
const MEDIATOR_AVATARS = ['🎯', '💡', '🤔', '📝'];

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

// Generate random mediator identity
export function generateRandomMediator(): { name: string; gender: 'male' | 'female'; avatar: string } {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  return {
    name: MEDIATOR_NAMES[Math.floor(Math.random() * MEDIATOR_NAMES.length)],
    gender,
    avatar: MEDIATOR_AVATARS[Math.floor(Math.random() * MEDIATOR_AVATARS.length)]
  };
}

export async function generateGroupmateResponse(
  topic: string,
  userTranscript: string,
  stance: 'support' | 'oppose',
  conversationHistory: string[] = [],
  groupmateInfo?: { name: string; gender: 'male' | 'female'; avatar: string },
  userName?: string,
  shouldAskQuestion: boolean = false
): Promise<GroupmateResponse> {
  // Use provided info or generate random
  const groupmate = groupmateInfo || generateRandomGroupmate();
  
  // How to address the user
  const userAddress = userName?.trim() ? userName.trim() : '';
  const addressInstruction = userAddress 
    ? `IMPORTANT: The speaker's name is ${userAddress}. Naturally use their name occasionally (e.g., "I agree with ${userAddress}..." or "That's a great point, ${userAddress}...") but don't overuse it.`
    : '';
  
  // Detect if user input is off-topic, testing, or irrelevant
  const isIrrelevantInput = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();
    const irrelevantPatterns = [
      /^(hello|hi|hey|yo)\b/,
      /can you hear me/,
      /testing/,
      /is this working/,
      /check.*mic/,
      /^(yes|no|ok|okay|um|uh|hmm|huh)\s*$/,
      /^[^a-zA-Z]*$/, // Only punctuation/numbers
      /^.{1,10}$/ // Very short responses
    ];
    return irrelevantPatterns.some(pattern => pattern.test(lowerText)) || lowerText.split(' ').length < 4;
  };

  const inputIsIrrelevant = isIrrelevantInput(userTranscript);
  
  // Dynamic response strategy based on input relevance
  const stanceInstruction = inputIsIrrelevant
    ? `The previous speaker said something brief or off-topic ("${userTranscript}"). You should:
       - Respond NATURALLY and warmly, like a real person would
       - Gently acknowledge what they said without being condescending
       - Then smoothly steer the conversation back to the topic
       - Share YOUR OWN opinion on the topic to get discussion going
       DO NOT pretend they made a substantive point. Be genuine and helpful.`
    : stance === 'support' 
    ? `You AGREE with and BUILD UPON the speaker's argument. You must:
       - First, explicitly acknowledge their KEY POINT by paraphrasing it
       - Then provide 1-2 STRONG supporting reasons with logical explanation
       - Include a CONCRETE EXAMPLE (real-life scenario, statistics, or personal experience)
       - End with an INSIGHT that extends or deepens their thinking`
    : `You are a CRITICAL THINKER who helps strengthen the discussion. You must:
       - First, SHOW you genuinely understand their argument ("I see your point that X because Y...")
       - Then, IDENTIFY what they might have OVERLOOKED or not considered (blind spots, exceptions, edge cases)
       - Present a POWERFUL counter-example or scenario that challenges their view
       - Offer a BROADER PERSPECTIVE that expands everyone's thinking
       - Your goal is NOT just to disagree, but to ELEVATE the discussion to a deeper level
       
       CRITICAL THINKING TECHNIQUES:
       - "That's a valid point, but have you considered what happens when...?"
       - "While that works in most cases, there's an exception worth noting..."
       - "I understand your reasoning, but let me play devil's advocate here..."
       - "Your argument assumes X, but what if Y were true instead?"
       - "That's one way to look at it, but from another angle..."
       
       Be INCISIVE but RESPECTFUL. Challenge ideas, not the person.`;

  // Question instruction if needed
  const questionInstruction = shouldAskQuestion
    ? `\n\nIMPORTANT: End your response with a QUESTION directed at ${userAddress || 'the speaker'} or another groupmate. Examples:
       - "${userAddress || 'What'}, do you think that would also apply in [specific situation]?"
       - "But what if we look at it from [different perspective]? ${userAddress ? userAddress + ', do' : 'Do'} you agree?"
       - "I'm curious - ${userAddress || 'do you'} have any personal experience with this?"`
    : '';

  const systemPrompt = `You are ${groupmate.name}, a highly articulate secondary school student in Hong Kong participating in a FORMAL DSE English Speaking Examination group discussion.

THIS IS AN EXAM SETTING - You must demonstrate:
✓ Critical thinking with logical reasoning
✓ Use of concrete examples (real cases, statistics, scenarios)
✓ Insightful analysis that shows depth of thought
✓ Natural conversation flow with proper discourse markers
✓ Academic vocabulary appropriate for exam

YOUR ROLE: ${stanceInstruction}

${addressInstruction}
${questionInstruction}

CRITICAL: Be HUMAN and NATURAL. If someone says something off-topic like "hello can you hear me", DON'T pretend they made a point about the topic. Instead, acknowledge warmly and redirect.

RESPONSE STRUCTURE (4-6 sentences):
${inputIsIrrelevant 
  ? `1. ACKNOWLEDGE: Respond naturally to what they said (e.g., "Yes, I can hear you perfectly!" or "Hey there!")
2. REDIRECT: Smoothly transition to the topic
3. OPINION: Share your own view on the topic with a reason
4. INVITE: Ask a follow-up question or invite their thoughts`
  : `1. ACKNOWLEDGE: Reference the speaker's specific point
2. RESPOND: State your position with clear reasoning  
3. EXAMPLE: Give a concrete, relevant example
4. INSIGHT: Add depth with further analysis or implications${shouldAskQuestion ? '\n5. QUESTION: End with a thought-provoking question' : ''}`}

SPEAK NATURALLY but SUBSTANTIVELY. Show you are actively listening and THINKING CRITICALLY.

RESPOND IN ENGLISH ONLY.`;

  const userPrompt = inputIsIrrelevant
    ? `=== DSE GROUP DISCUSSION ===

TOPIC: "${topic}"

${userAddress ? `SPEAKER'S NAME: ${userAddress}` : ''}

THE PREVIOUS SPEAKER SAID (off-topic or brief): "${userTranscript}"

YOUR TASK as ${groupmate.name}:
1. Respond naturally and warmly - don't pretend this was a topic-related point
2. Smoothly redirect to the discussion topic
3. Share YOUR OWN initial thoughts on the topic to get discussion going
4. Keep it natural, 4-5 sentences
${userAddress ? `5. Use their name "${userAddress}" naturally` : ''}`
    : `=== DSE GROUP DISCUSSION ===

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
    // Randomly select AI provider for variety
    const provider = getRandomProvider();
    
    logger.info('Generating AI groupmate response', { 
      stance, 
      groupmateName: groupmate.name,
      userSaid: userTranscript.substring(0, 50),
      topic: topic.substring(0, 30),
      provider: provider.name
    });

    const response = await fetch(provider.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'English Speaking Practice'
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 350,
        temperature: 0.85
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
