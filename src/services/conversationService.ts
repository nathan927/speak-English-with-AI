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
  connectors: string[];
  agreement: string[];
  followUp: string[];
}

const conversationPhrases: ConversationPhrase = {
  opening: [
    "Next question.",
    "Here's the next one.",
    "Now this.",
    "Moving on.",
    "Let's continue.",
    "Another question.",
    "Here we go.",
    "Next one.",
    "Now then.",
    "Alright.",
    "So.",
    "Right.",
    "Okay.",
    "Now.",
    "Let me ask you this.",
    "Here's another one.",
    "Let's try this.",
    "Moving forward.",
    "Next up.",
    "Here's what I want to know."
  ],
  closing: [
    "Okay.",
    "Right.",
    "Got it.",
    "I see.",
    "Alright.",
    "Understood.",
    "Makes sense.",
    "Noted.",
    "Sounds good."
  ],
  encouragement: [
    "Take your time.",
    "No rush.",
    "When you're ready.",
    "Think about it.",
    "Just speak naturally.",
    "No pressure.",
    "Whenever you're ready.",
    "Take a moment.",
    "Just relax.",
    "In your own time.",
    "Feel free to think.",
    "No hurry.",
    "Just be yourself.",
    "Take it easy.",
    "Don't worry about it.",
    "Just answer naturally.",
    "At your own pace."
  ],
  transition: [
    "So.",
    "Now.",
    "Right.",
    "Okay.",
    "Well.",
    "Anyway.",
    "Moving on.",
    "Next.",
    "Alright then.",
    "Let's see.",
    "How about this.",
    "What about this.",
    "Here's something else.",
    "Another thing.",
    "Something different."
  ],
  greeting: [
    "Hi there.",
    "Hello.",
    "Hey.",
    "Hi.",
    "Good to see you.",
    "Nice to meet you.",
    "Welcome.",
    "Ready to start?"
  ],
  thinking: [
    "Right.",
    "Okay.",
    "I see.",
    "Sure.",
    "Got it.",
    "Makes sense."
  ],
  casual: [
    "So,",
    "Well,",
    "Now,",
    "Anyway,",
    "Right,",
    "Okay,"
  ],
  // New: Natural conversation connectors for primary and above
  connectors: [
    "That's interesting.",
    "I'd love to hear more.",
    "Tell me more about that.",
    "How fascinating.",
    "Really?",
    "Sounds wonderful.",
    "That's great to hear.",
    "Wonderful.",
    "Lovely.",
    "How nice.",
    "That sounds fun.",
    "Interesting point.",
    "Good thinking.",
    "Nice.",
    "Cool.",
    "Awesome.",
    "That's a good point.",
    "I like that.",
    "Fair enough.",
    "Makes sense to me.",
    "That's quite something.",
    "I can imagine.",
    "How exciting.",
    "That must be nice.",
    "Sounds like fun.",
    "What a great idea.",
    "That's a thoughtful answer.",
    "You've thought about this.",
    "That's well said.",
    "I appreciate your honesty.",
    "Thank you for sharing."
  ],
  agreement: [
    "I agree with that.",
    "Absolutely.",
    "That's exactly right.",
    "You make a good point.",
    "I think so too.",
    "That's true.",
    "Definitely.",
    "For sure.",
    "Without a doubt.",
    "I couldn't agree more."
  ],
  followUp: [
    "And then what happened?",
    "What do you think about that?",
    "How did that make you feel?",
    "Can you tell me more?",
    "What else?",
    "Anything else you'd like to add?",
    "Is there more to that?",
    "What about after that?",
    "And how does that work?",
    "Why do you think that is?"
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
  
  // Determine grade level
  const isKindergarten = grade?.startsWith('K') || false;
  const isPrimary = grade?.startsWith('P') || false;
  const isPrimaryUpper = ['P4', 'P5', 'P6'].includes(grade || '');
  const isSecondary = grade?.startsWith('S') || false;
  
  logger.debug(`Grade analysis`, {
    isKindergarten,
    isPrimary,
    isPrimaryUpper,
    isSecondary,
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
    // For P1+ students, add natural connectors more frequently
    if (isPrimary || isSecondary) {
      // Add conversation connectors for primary and above (60% chance)
      if (Math.random() < 0.6) {
        const connector = getRandomPhrase('connectors');
        naturalText += connector + ' ';
        buildSteps.push(`Added connector: "${connector}"`);
      }
    }
    
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
  
  // Add follow-up style phrases for upper primary and secondary (30% chance)
  if ((isPrimaryUpper || isSecondary) && !isFirst && Math.random() < 0.3) {
    const followUp = getRandomPhrase('followUp');
    naturalText += followUp + ' ';
    buildSteps.push(`Added followUp: "${followUp}"`);
  }
  
  // Reduce encouragement for younger students
  let encouragementChance = 0.25; // Default for secondary
  if (isKindergarten) {
    encouragementChance = 0.1; // Very low for kindergarten
  } else if (isPrimary) {
    encouragementChance = 0.2; // Slightly higher for primary
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
      isPrimary,
      isPrimaryUpper,
      isSecondary
    }
  }, 'ConversationService', 'questionBuilt');
  
  return naturalText;
};

// New function to get agreement phrases for AI groupmates
export const getAgreementPhrase = (): string => {
  return getRandomPhrase('agreement');
};

// New function to get disagreement phrases for AI groupmates
export const getDisagreementPhrases = (): string[] => {
  return [
    "I see your point, but I think...",
    "That's one way to look at it. However...",
    "I respectfully disagree because...",
    "While that's true, we should also consider...",
    "That's an interesting perspective, but...",
    "I understand what you're saying, though...",
    "You make a good point, but on the other hand...",
    "I have a different view on this...",
    "That's fair, but let me offer another perspective...",
    "I can see why you'd think that, but..."
  ];
};

export const getRandomDisagreementPhrase = (): string => {
  const phrases = getDisagreementPhrases();
  return phrases[Math.floor(Math.random() * phrases.length)];
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
