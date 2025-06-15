
// Conversation service for natural dialogue transitions
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

export const getRandomPhrase = (type: keyof ConversationPhrase): string => {
  const phrases = conversationPhrases[type];
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
};

export const buildNaturalQuestion = (questionText: string, isFirst: boolean = false, isLast: boolean = false): string => {
  let naturalText = '';
  
  // Add greeting for first question
  if (isFirst) {
    if (Math.random() < 0.7) { // 70% chance
      naturalText += getRandomPhrase('greeting') + ' ';
    }
  } else {
    // Add opening phrase for non-first questions
    if (Math.random() < 0.8) { // 80% chance
      naturalText += getRandomPhrase('opening') + ' ';
    } else {
      // Sometimes use transition or casual phrases instead
      if (Math.random() < 0.5) {
        naturalText += getRandomPhrase('transition') + ' ';
      } else {
        naturalText += getRandomPhrase('casual') + ' ';
      }
    }
  }
  
  // Add encouragement occasionally (25% chance, reduced from 30%)
  if (Math.random() < 0.25) {
    naturalText += getRandomPhrase('encouragement') + ' ';
  }
  
  // Sometimes add thinking phrases before the question (15% chance)
  if (Math.random() < 0.15) {
    naturalText += getRandomPhrase('thinking') + ' ';
  }
  
  // Add the actual question
  naturalText += questionText;
  
  // Add closing encouragement for last question
  if (isLast) {
    const lastQuestionPhrases = [
      ' This is our final question, so take your time.',
      ' We\'re at the last question now, no rush.',
      ' Here\'s our final question for today.',
      ' This is the last one, so feel free to take your time.',
      ' Alright, this is our final question together.'
    ];
    naturalText += lastQuestionPhrases[Math.floor(Math.random() * lastQuestionPhrases.length)];
  }
  
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
