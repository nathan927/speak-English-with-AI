
// Conversation service for natural dialogue transitions
import { logger } from './logService';

export interface ConversationPhrase {
  opening: string[];
  closing: string[];
  encouragement: string[];
  transition: string[];
  greeting: string[];
  thinking: string[];
  casual: string[];
}

const conversationPhrases: ConversationPhrase = {
  opening: [
    "Alright, let's move on to the next question.",
    "Here's your next question.",
    "Now, let me ask you this.",
    "Okay, ready for the next one?",
    "Let's continue with this question.",
    "Here we go with another question.",
    "Now, I'd like to ask you about something.",
    "Let's try this next question together.",
    "So, here's what I want to know next.",
    "Moving forward, let me ask you about this.",
    "Now then, here's another question for you.",
    "Alright, let's see how you handle this one.",
    "Here comes the next question.",
    "Let me present you with this question.",
    "Now, I'm curious about this.",
    "Let's explore this topic together.",
    "Here's something interesting to consider.",
    "Time for our next question.",
    "So, let's dive into this next one.",
    "Now, here's what I'd like to hear about."
  ],
  closing: [
    "Great job on that one!",
    "Well done!",
    "Nice work!",
    "That was good!",
    "Excellent!",
    "Very good!",
    "Perfect, thank you!",
    "Thank you for your answer!",
    "That was a thoughtful response!",
    "I appreciate your answer.",
    "Thank you for sharing that.",
    "That was really well expressed!",
    "Nice job with that response!",
    "You handled that question well.",
    "That was a solid answer!",
    "Thank you, that was helpful.",
    "Good thinking on that one!",
    "I liked your approach to that question.",
    "That was very clear, thank you!",
    "Wonderful response!",
    "That was perfectly fine!",
    "You did great with that one!"
  ],
  encouragement: [
    "Take your time to think about it.",
    "There's no rush, just speak naturally.",
    "Feel free to take a moment to organize your thoughts.",
    "Remember, just speak as naturally as you can.",
    "Don't worry about making mistakes, just try your best.",
    "Take a deep breath and answer when you're ready.",
    "No pressure at all, just share what comes to mind.",
    "Think it through and answer in your own words.",
    "Just relax and speak from your heart.",
    "Take as much time as you need.",
    "Don't overthink it, just be yourself.",
    "There's no right or wrong answer here.",
    "Just express yourself naturally.",
    "Speak at your own pace.",
    "Remember, this is just a conversation.",
    "Feel comfortable and take your time.",
    "Just say whatever feels right to you."
  ],
  transition: [
    "Moving on to our next topic.",
    "Let's shift gears a little bit.",
    "Now let's talk about something different.",
    "Here's something else I'd like to know.",
    "Let's explore another area now.",
    "Time for a different kind of question.",
    "Now, let's change direction slightly.",
    "Here's a different angle to consider.",
    "Let's switch topics for a moment.",
    "Now, on a different note.",
    "Let's try something else now.",
    "Here's a fresh question for you.",
    "Time to explore something new.",
    "Let's pivot to another topic.",
    "Now, let's look at this from another perspective."
  ],
  greeting: [
    "Hi there!",
    "Hello!",
    "Good to meet you!",
    "Nice to see you!",
    "Welcome!",
    "Great to have you here!",
    "Hello, how are you doing?",
    "Hi, ready to get started?"
  ],
  thinking: [
    "Hmm, let me see.",
    "Interesting.",
    "I see.",
    "That's a good point.",
    "Right.",
    "Okay.",
    "I understand.",
    "Got it."
  ],
  casual: [
    "By the way,",
    "Actually,",
    "You know what,",
    "Speaking of which,",
    "Now that I think about it,",
    "Incidentally,",
    "Oh, and",
    "While we're at it,"
  ]
};

// Track last used phrases to prevent repetition
let lastUsedPhrases: { [key: string]: string } = {};

export const getRandomPhrase = (type: keyof ConversationPhrase): string => {
  const phrases = conversationPhrases[type];
  let selectedPhrase: string;
  
  logger.debug(`Getting random phrase for type: ${type}`, {
    totalPhrases: phrases.length,
    lastUsed: lastUsedPhrases[type]
  }, 'ConversationService', 'getRandomPhrase');
  
  // Filter out the last used phrase for this type
  const availablePhrases = phrases.filter(phrase => phrase !== lastUsedPhrases[type]);
  
  logger.debug(`Filtered phrases for ${type}`, {
    available: availablePhrases.length,
    filtered: phrases.length - availablePhrases.length,
    lastUsedPhrase: lastUsedPhrases[type]
  }, 'ConversationService', 'filterPhrases');
  
  // If all phrases have been used, reset and use all phrases
  if (availablePhrases.length === 0) {
    selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    logger.warn(`All ${type} phrases used, resetting selection`, {
      selectedPhrase,
      totalPhrases: phrases.length
    }, 'ConversationService', 'resetPhrases');
  } else {
    selectedPhrase = availablePhrases[Math.floor(Math.random() * availablePhrases.length)];
  }
  
  // Log the detailed selection process using the specialized method
  logger.conversationLog(type, selectedPhrase, availablePhrases, lastUsedPhrases[type]);
  
  // Store the selected phrase to avoid repetition
  const previousPhrase = lastUsedPhrases[type];
  lastUsedPhrases[type] = selectedPhrase;
  
  logger.debug(`Phrase selection completed for ${type}`, {
    selected: selectedPhrase,
    previous: previousPhrase,
    updated: lastUsedPhrases[type]
  }, 'ConversationService', 'phraseSelected');
  
  return selectedPhrase;
};

export const buildNaturalQuestion = (questionText: string, isFirst: boolean = false, isLast: boolean = false, grade?: string): string => {
  logger.info(`Building natural question`, {
    isFirst,
    isLast,
    grade,
    questionLength: questionText.length,
    questionPreview: questionText.substring(0, 30) + '...'
  }, 'ConversationService', 'buildQuestion');

  let naturalText = '';
  const buildSteps: string[] = [];
  
  // Determine if this is a kindergarten or primary grade
  const isKindergarten = grade?.startsWith('K') || false;
  const isPrimary = grade?.startsWith('P') || false;
  
  logger.debug(`Grade analysis`, {
    isKindergarten,
    isPrimary,
    grade
  }, 'ConversationService', 'gradeAnalysis');
  
  // Add greeting for first question
  if (isFirst) {
    if (Math.random() < 0.7) { // 70% chance
      const greeting = getRandomPhrase('greeting');
      naturalText += greeting + ' ';
      buildSteps.push(`Added greeting: "${greeting}"`);
    }
  } else if (!isKindergarten) { // Skip transition phrases for kindergarten
    // Reduce opening phrases for primary students (50% instead of 80%)
    const openingChance = isPrimary ? 0.5 : 0.8;
    const random = Math.random();
    
    logger.debug(`Opening phrase decision`, {
      openingChance,
      randomValue: random,
      willUseOpening: random < openingChance,
      isPrimary,
      isKindergarten
    }, 'ConversationService', 'openingDecision');
    
    if (random < openingChance) {
      const opening = getRandomPhrase('opening');
      naturalText += opening + ' ';
      buildSteps.push(`Added opening: "${opening}"`);
    } else if (!isPrimary) { // Only use transition/casual for secondary students
      // Sometimes use transition or casual phrases instead
      if (Math.random() < 0.5) {
        const transition = getRandomPhrase('transition');
        naturalText += transition + ' ';
        buildSteps.push(`Added transition: "${transition}"`);
      } else {
        const casual = getRandomPhrase('casual');
        naturalText += casual + ' ';
        buildSteps.push(`Added casual: "${casual}"`);
      }
    }
  }
  
  // Reduce encouragement for younger students
  let encouragementChance = 0.25; // Default for secondary
  if (isKindergarten) {
    encouragementChance = 0.1; // Very low for kindergarten
  } else if (isPrimary) {
    encouragementChance = 0.15; // Reduced for primary
  }
  
  if (Math.random() < encouragementChance) {
    const encouragement = getRandomPhrase('encouragement');
    naturalText += encouragement + ' ';
    buildSteps.push(`Added encouragement: "${encouragement}"`);
  }
  
  // Skip thinking phrases for kindergarten, reduce for primary
  let thinkingChance = 0.15; // Default for secondary
  if (isKindergarten) {
    thinkingChance = 0; // No thinking phrases for kindergarten
  } else if (isPrimary) {
    thinkingChance = 0.08; // Reduced for primary
  }
  
  if (Math.random() < thinkingChance) {
    const thinking = getRandomPhrase('thinking');
    naturalText += thinking + ' ';
    buildSteps.push(`Added thinking: "${thinking}"`);
  }
  
  // Add the actual question
  naturalText += questionText;
  buildSteps.push(`Added main question: "${questionText.substring(0, 30)}..."`);
  
  // Add closing encouragement for last question (simplified for younger students)
  if (isLast) {
    const lastQuestionPhrases = isKindergarten ? [
      ' This is our last question.',
      ' Here\'s our final question.',
      ' One more question for you.'
    ] : isPrimary ? [
      ' This is our final question, take your time.',
      ' Here\'s our last question for today.',
      ' Final question now, no rush.'
    ] : [
      ' This is our final question, so take your time.',
      ' We\'re at the last question now, no rush.',
      ' Here\'s our final question for today.',
      ' This is the last one, so feel free to take your time.',
      ' Alright, this is our final question together.'
    ];
    const lastPhrase = lastQuestionPhrases[Math.floor(Math.random() * lastQuestionPhrases.length)];
    naturalText += lastPhrase;
    buildSteps.push(`Added last question phrase: "${lastPhrase}"`);
  }
  
  logger.info(`Natural question built`, {
    finalText: naturalText,
    textLength: naturalText.length,
    buildSteps,
    components: {
      isFirst,
      isLast,
      grade,
      isKindergarten,
      isPrimary
    }
  }, 'ConversationService', 'questionBuilt');
  
  return naturalText;
};

export const getCompletionPhrase = (): string => {
  // Mix different types of completion phrases for more variety
  const phraseTypes = ['closing', 'thinking', 'casual'];
  const randomType = phraseTypes[Math.floor(Math.random() * phraseTypes.length)];
  
  if (randomType === 'closing') {
    return getRandomPhrase('closing');
  } else if (randomType === 'thinking') {
    return getRandomPhrase('thinking') + ' ' + getRandomPhrase('closing');
  } else {
    return getRandomPhrase('casual') + ' ' + getRandomPhrase('closing');
  }
};

// New function for more varied conversation flow
export const getRandomConversationFlow = (): string => {
  const flows = [
    getRandomPhrase('thinking') + ' ' + getRandomPhrase('transition'),
    getRandomPhrase('casual') + ' ' + getRandomPhrase('opening'),
    getRandomPhrase('encouragement'),
    getRandomPhrase('closing') + ' ' + getRandomPhrase('transition'),
  ];
  
  return flows[Math.floor(Math.random() * flows.length)];
};
