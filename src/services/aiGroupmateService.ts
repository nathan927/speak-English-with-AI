// AI Groupmate Service - Generate responses from AI discussion partners
import { logger } from './logService';
import { generateDiscussionResponse } from './ai/aiApiService';

// Generate AI-powered natural discussion opening
export async function generateDiscussionOpening(
  topic: string,
  supporterName: string,
  opposerName: string,
  userName?: string,
  grade?: string,
  balancedThinkerName?: string
): Promise<string> {
  const allParticipants = balancedThinkerName 
    ? `${opposerName} and ${balancedThinkerName}${userName ? `, and welcome ${userName}` : ''}`
    : `${opposerName}${userName ? ` and welcome ${userName}` : ''}`;
    
  const systemPrompt = `You are ${supporterName}, a friendly and confident student about to lead a group discussion in a speaking exam.

YOUR TASK: Create a NATURAL, conversational opening that:
1. Briefly introduces yourself and ${allParticipants}
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
PARTNERS: ${opposerName}${balancedThinkerName ? ` and ${balancedThinkerName}` : ''}
${userName ? `PARTICIPANT: ${userName}` : ''}

Remember: Rephrase the topic naturally, don't quote it. Sound like a real student starting a conversation with friends. Make sure to mention ALL your partners by name in the introduction.`;

  try {
    const text = await generateDiscussionResponse(systemPrompt, userPrompt, { 
      maxTokens: 200, 
      temperature: 0.95 
    });
    
    const cleanedText = text.replace(/^["']|["']$/g, '').trim();
    
    if (!cleanedText) throw new Error('Empty response');
    
    logger.info('Generated AI discussion opening', { preview: cleanedText.substring(0, 50) });
    return cleanedText;
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

  const userPrompt = `TOPIC: "${topic}"\n\nSTUDENT SAID: "${userTranscript}"\n\nAnalyze and return JSON only.`;

  try {
    const text = await generateDiscussionResponse(systemPrompt, userPrompt, { 
      maxTokens: 200, 
      temperature: 0.3 
    });
    
    // Clean up potential markdown wrapping
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(cleanedText);
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

// Generate balanced thinker response - a third groupmate who balances support and critique, offers creative insights
export async function generateBalancedThinkerResponse(
  topic: string,
  conversationHistory: string[],
  thinkerInfo: { name: string; gender: 'male' | 'female'; avatar: string },
  userName?: string,
  shouldRespondToGroupmate: boolean = false,
  grade?: string
): Promise<GroupmateResponse> {
  const userAddress = userName?.trim() || '';
  const gradeLevelInstructions = getGradeLevelInstructions(grade);
  
  // Decide response style randomly - balanced, creative, or insightful
  const responseStyle = Math.random();
  let styleInstruction = '';
  
  if (responseStyle < 0.33) {
    // Balanced - acknowledge both sides
    styleInstruction = `BALANCED PERSPECTIVE:
- Acknowledge valid points from BOTH the supportive and critical viewpoints
- Find common ground between different opinions
- Suggest a middle-ground solution or compromise`;
  } else if (responseStyle < 0.66) {
    // Creative - new angle
    styleInstruction = `CREATIVE ANGLE:
- Introduce a NEW perspective no one has mentioned
- Think outside the box - what's being overlooked?
- Offer an innovative solution or unexpected insight`;
  } else {
    // Insightful conclusion
    styleInstruction = `INSIGHTFUL ANALYSIS:
- Synthesize what's been discussed into a deeper insight
- Connect this topic to broader implications
- Draw a thought-provoking conclusion`;
  }

  const targetInstruction = shouldRespondToGroupmate
    ? `RESPOND TO another groupmate's point (not the user). Challenge or build on what they said.`
    : `You may address ${userAddress || 'anyone'} or respond to another groupmate.`;

  const systemPrompt = `You are ${thinkerInfo.name}, a thoughtful and creative student in a group discussion.

${gradeLevelInstructions}

YOUR PERSONALITY: You are the "balanced thinker" - neither purely supportive nor purely critical. You:
- See value in DIFFERENT perspectives
- Often bring up angles others haven't considered
- Make creative connections between ideas
- Offer insightful summaries or conclusions

${styleInstruction}

${targetInstruction}

NATURAL CONVERSATION STYLE:
- "That's interesting, but have we considered...?"
- "I see what both of you mean, and actually..."
- "Building on everyone's points, what if we think about it this way..."
- "Here's something I haven't heard mentioned yet..."

Keep it 3-5 natural sentences. Be warm, curious, and thought-provoking.
RESPOND IN ENGLISH ONLY.`;

  const userPrompt = `TOPIC: "${topic}"

DISCUSSION SO FAR:
${conversationHistory.slice(-6).join('\n')}

YOUR TASK as ${thinkerInfo.name} (Balanced Thinker):
1. ${shouldRespondToGroupmate ? 'Respond directly to another groupmate\'s point' : 'Contribute your unique perspective'}
2. Bring something NEW to the discussion - a fresh angle, creative idea, or insightful observation
3. Keep it natural and engaging`;

  try {
    const text = await generateDiscussionResponse(systemPrompt, userPrompt, { 
      maxTokens: 250, 
      temperature: 0.9 
    });
    
    const cleanedText = text.replace(/^["']|["']$/g, '').trim();
    
    return {
      text: cleanedText || `That's a great discussion! I think there's actually a middle ground here - we don't have to choose one side completely. What if we considered both perspectives together?`,
      stance: 'mediator',  // Keep stance as mediator for backward compatibility
      groupmateName: thinkerInfo.name,
      gender: thinkerInfo.gender,
      avatar: thinkerInfo.avatar
    };
  } catch (error) {
    logger.error('Failed to generate balanced thinker response', { error });
    return {
      text: `Interesting points from everyone! I think there's value in both perspectives. What if we looked at this from a different angle - maybe there's a creative solution that combines the best of both ideas?`,
      stance: 'mediator',
      groupmateName: thinkerInfo.name,
      gender: thinkerInfo.gender,
      avatar: thinkerInfo.avatar
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

// Generate random balanced thinker identity (renamed from mediator)
export function generateRandomMediator(): { name: string; gender: 'male' | 'female'; avatar: string } {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const names = gender === 'male' ? MALE_NAMES : FEMALE_NAMES;
  const avatars = gender === 'male' ? MALE_AVATARS : FEMALE_AVATARS;
  return {
    name: names[Math.floor(Math.random() * names.length)],
    gender,
    avatar: avatars[Math.floor(Math.random() * avatars.length)]
  };
}

// Get grade-appropriate language level instructions
function getGradeLevelInstructions(grade?: string): string {
  if (!grade) return '';
  
  const gradeLevel = grade.toUpperCase();
  
  if (gradeLevel.startsWith('P4') || gradeLevel.startsWith('P5')) {
    return `
LANGUAGE LEVEL: Primary 4-5 (Ages 9-11)
- Use SIMPLE vocabulary and short sentences (8-12 words per sentence)
- Speak like a 10-year-old student
- Use basic connectors: "and", "but", "because", "so"
- Topics: daily life, school, hobbies, friends, family
- Avoid complex vocabulary or abstract concepts
- Examples should be from a child's perspective (playground, homework, games)`;
  }
  
  if (gradeLevel.startsWith('P6')) {
    return `
LANGUAGE LEVEL: Primary 6 (Ages 11-12)
- Use moderately simple vocabulary with some variety
- Sentences can be slightly longer (10-15 words)
- Use connectors: "because", "however", "for example", "also"
- Can discuss opinions but keep reasoning straightforward
- Examples from school life, local community, popular culture
- Avoid sophisticated vocabulary or complex arguments`;
  }
  
  if (gradeLevel.startsWith('S1') || gradeLevel.startsWith('S2')) {
    return `
LANGUAGE LEVEL: Secondary 1-2 (Ages 12-14)
- Use intermediate vocabulary appropriate for junior secondary
- Sentences can be more complex (12-18 words)
- Include connectors: "moreover", "on the other hand", "for instance"
- Can present simple arguments with one clear supporting point
- Examples from teenage life, social media, school activities
- Avoid overly academic or sophisticated language`;
  }
  
  if (gradeLevel.startsWith('S3') || gradeLevel.startsWith('S4')) {
    return `
LANGUAGE LEVEL: Secondary 3-4 (Ages 14-16)
- Use varied vocabulary with some academic terms
- Can use complex sentence structures
- Include discourse markers: "furthermore", "nevertheless", "consequently"
- Present structured arguments with evidence
- Examples can include current affairs and social issues
- Beginning to develop critical thinking skills`;
  }
  
  if (gradeLevel.startsWith('S5') || gradeLevel.startsWith('S6')) {
    return `
LANGUAGE LEVEL: Secondary 5-6 / DSE Level (Ages 16-18)
- Use sophisticated vocabulary and academic register
- Complex sentence structures with multiple clauses
- Advanced discourse markers and hedging language
- Present multi-layered arguments with nuanced reasoning
- Reference real-world examples, statistics, and current affairs
- Demonstrate critical analysis and evaluation skills`;
  }
  
  return '';
}

export async function generateGroupmateResponse(
  topic: string,
  userTranscript: string,
  stance: 'support' | 'oppose',
  conversationHistory: string[] = [],
  groupmateInfo?: { name: string; gender: 'male' | 'female'; avatar: string },
  userName?: string,
  shouldAskQuestion: boolean = false,
  grade?: string
): Promise<GroupmateResponse> {
  // Use provided info or generate random
  const groupmate = groupmateInfo || generateRandomGroupmate();
  
  // How to address the user
  const userAddress = userName?.trim() ? userName.trim() : '';
  const addressInstruction = userAddress 
    ? `IMPORTANT: The speaker's name is ${userAddress}. Naturally use their name occasionally (e.g., "I agree with ${userAddress}..." or "That's a great point, ${userAddress}...") but don't overuse it.`
    : '';
  
  // Classify the type of input - BE LIKE WATER, understand human conversation
  const classifyInput = (text: string): 'substantive' | 'social_cue' | 'testing' | 'brief' => {
    const lowerText = text.toLowerCase().trim();
    
    // Social cues - things people say in conversations that aren't arguments
    const socialCuePatterns = [
      /you first/i, /go ahead/i, /after you/i, /please start/i, /your turn/i,
      /what do you think/i, /any thoughts/i, /i('m| am) not sure/i,
      /that's (a )?good (point|question)/i, /interesting/i, /i agree/i, /i disagree/i,
      /let me think/i, /hmm/i, /well/i, /you know/i, /i mean/i,
      /can you explain/i, /what about/i, /how about/i
    ];
    
    // Testing/technical issues
    const testingPatterns = [
      /can you hear me/i, /testing/i, /is this working/i, /check.*mic/i,
      /hello.*hello/i, /one two three/i
    ];
    
    if (testingPatterns.some(p => p.test(lowerText))) return 'testing';
    if (socialCuePatterns.some(p => p.test(lowerText))) return 'social_cue';
    if (lowerText.split(' ').length < 5 && !/because|think|believe|should|would/i.test(lowerText)) return 'brief';
    return 'substantive';
  };

  const inputType = classifyInput(userTranscript);
  
  // BE LIKE WATER - adapt response strategy based on what the person ACTUALLY means
  const getFlexibleInstruction = () => {
    if (inputType === 'testing') {
      return `The speaker is testing their microphone or checking if things work ("${userTranscript}").
        - Respond warmly: "Yep, I can hear you perfectly!" or "All good here!"
        - Then naturally kick off the discussion by sharing YOUR OWN initial thoughts on the topic
        - Be friendly and get the conversation going`;
    }
    
    if (inputType === 'social_cue') {
      return `The speaker used a SOCIAL CUE ("${userTranscript}") - this is NOT an argument, it's conversational.
        - If they said "you first" / "go ahead" → They're politely asking you to start! So START the discussion with your opinion
        - If they said "what do you think" → Share your genuine thoughts
        - If they said "I agree/disagree" → Acknowledge briefly and expand with your own reasons
        - If they said "interesting" or similar → Build on the conversation naturally
        
        DO NOT treat this as a point to agree/disagree with. Respond like a REAL PERSON would in conversation.
        Share your OWN thoughts on the topic to move the discussion forward.`;
    }
    
    if (inputType === 'brief') {
      return `The speaker gave a brief response ("${userTranscript}").
        - Acknowledge what little they said naturally
        - Then share YOUR OWN substantial thoughts on the topic
        - Ask them a follow-up question to draw them out more`;
    }
    
    // Substantive input - use stance-based response
    return stance === 'support' 
      ? `You AGREE with and BUILD UPON the speaker's argument. You must:
         - First, acknowledge their KEY POINT by paraphrasing it
         - Provide 1-2 STRONG supporting reasons with logical explanation
         - Include a CONCRETE EXAMPLE (real-life scenario, statistics, personal experience)
         - End with an INSIGHT that extends their thinking`
      : `You are a CRITICAL THINKER who helps strengthen the discussion. You must:
         - First, SHOW you understand their argument genuinely
         - IDENTIFY what they might have OVERLOOKED (blind spots, exceptions, edge cases)
         - Present a POWERFUL counter-example that challenges their view
         - Offer a BROADER PERSPECTIVE that expands everyone's thinking
         - Your goal is to ELEVATE the discussion, not just disagree
         
         Be INCISIVE but RESPECTFUL. Challenge ideas, not the person.`;
  };

  const stanceInstruction = getFlexibleInstruction();

  // Question instruction if needed
  const questionInstruction = shouldAskQuestion
    ? `\n\nIMPORTANT: End your response with a QUESTION directed at ${userAddress || 'the speaker'} or another groupmate.`
    : '';

  const isNonSubstantive = inputType !== 'substantive';
  
  // Get grade-appropriate language instructions
  const gradeLevelInstructions = getGradeLevelInstructions(grade);

  const systemPrompt = `You are ${groupmate.name}, a ${grade || 'secondary'} school student in Hong Kong participating in a group discussion.

${gradeLevelInstructions}

BE LIKE WATER - Adapt naturally to whatever the speaker says:
- If they make an argument → respond to it thoughtfully
- If they say "you first" or "go ahead" → accept gracefully and START sharing your opinion
- If they're testing their mic → acknowledge warmly and get the discussion going
- If they're brief → draw them out with your own thoughts and a question

YOUR ROLE: ${stanceInstruction}

${addressInstruction}
${questionInstruction}

CRITICAL RULES:
1. NEVER pretend someone made a point when they didn't
2. If they said "you first" → Say something like "Sure, I'll start!" then share YOUR thoughts
3. If they're just greeting → Respond naturally and move into the topic
4. Be HUMAN - real conversations have small talk, pauses, and social cues
5. MATCH YOUR LANGUAGE to the grade level specified above

RESPONSE LENGTH: ${grade?.startsWith('P') ? '2-4' : '4-6'} natural sentences.
RESPOND IN ENGLISH ONLY.`;

  const userPrompt = `=== GROUP DISCUSSION ===

TOPIC: "${topic}"

${userAddress ? `SPEAKER'S NAME: ${userAddress}` : ''}

WHAT THE SPEAKER SAID: "${userTranscript}"

INPUT TYPE: ${inputType.toUpperCase()}
${inputType === 'social_cue' ? '→ This is a SOCIAL CUE, not an argument. Respond appropriately!' : ''}
${inputType === 'testing' ? '→ They are testing their mic. Confirm you hear them and start discussing!' : ''}
${inputType === 'brief' ? '→ Brief response. Acknowledge and share your own thoughts to get discussion flowing.' : ''}

${conversationHistory.length > 0 ? `DISCUSSION CONTEXT:\n${conversationHistory.slice(-4).join('\n')}\n` : ''}

YOUR TASK as ${groupmate.name}:
- Respond NATURALLY like a real person would
- ${inputType === 'substantive' 
    ? (stance === 'support' ? 'BUILD on their argument with your own ideas' : 'Offer a thoughtful counter-perspective')
    : 'Start or continue the discussion with your own thoughts on the topic'}
${userAddress ? `- Use their name "${userAddress}" naturally when appropriate` : ''}`;

  try {
    logger.info('Generating AI groupmate response', { 
      stance, 
      groupmateName: groupmate.name,
      userSaid: userTranscript.substring(0, 50),
      topic: topic.substring(0, 30)
    });

    const generatedText = await generateDiscussionResponse(systemPrompt, userPrompt, { 
      maxTokens: 350, 
      temperature: 0.85 
    });

    // Clean up the response - remove quotes if the AI wrapped it
    const cleanedText = generatedText.replace(/^["']|["']$/g, '').trim();

    logger.info('AI groupmate response generated', {
      groupmateName: groupmate.name,
      responsePreview: cleanedText.substring(0, 50)
    });

    return {
      text: cleanedText,
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

// Text-to-Speech for groupmate responses with natural speed and per-speaker variation
export async function speakGroupmateResponse(
  text: string, 
  gender: 'male' | 'female' = 'female',
  speakerVariation?: number  // -0.2 to +0.2 for per-speaker rate adjustment
): Promise<void> {
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

    // Natural speech settings with per-speaker variation
    // Base rate 0.85-1.0, then apply speaker-specific variation (±0.1)
    const baseRate = 0.85 + Math.random() * 0.15;
    const variation = speakerVariation ?? (Math.random() * 0.2 - 0.1); // -0.1 to +0.1
    utterance.rate = Math.max(0.7, Math.min(1.1, baseRate + variation));
    
    utterance.pitch = gender === 'male' ? 0.85 + Math.random() * 0.1 : 1.0 + Math.random() * 0.15;
    utterance.volume = 1.0;

    utterance.onend = () => {
      logger.info('Groupmate speech finished', { rate: utterance.rate.toFixed(2) });
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
