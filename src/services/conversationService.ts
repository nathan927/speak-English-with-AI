
// Conversation service for natural dialogue transitions
export interface ConversationPhrase {
  opening: string[];
  closing: string[];
  encouragement: string[];
  transition: string[];
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
    "Let's try this next question together."
  ],
  closing: [
    "Great job on that one!",
    "Well done!",
    "Nice work!",
    "That was good!",
    "Excellent!",
    "Very good!",
    "Perfect, thank you!",
    "Thank you for your answer!"
  ],
  encouragement: [
    "Take your time to think about it.",
    "There's no rush, just speak naturally.",
    "Feel free to take a moment to organize your thoughts.",
    "Remember, just speak as naturally as you can.",
    "Don't worry about making mistakes, just try your best.",
    "Take a deep breath and answer when you're ready."
  ],
  transition: [
    "Moving on to our next topic.",
    "Let's shift gears a little bit.",
    "Now let's talk about something different.",
    "Here's something else I'd like to know.",
    "Let's explore another area now.",
    "Time for a different kind of question."
  ]
};

export const getRandomPhrase = (type: keyof ConversationPhrase): string => {
  const phrases = conversationPhrases[type];
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
};

export const buildNaturalQuestion = (questionText: string, isFirst: boolean = false, isLast: boolean = false): string => {
  let naturalText = '';
  
  // Add opening phrase (not for first question)
  if (!isFirst) {
    naturalText += getRandomPhrase('opening') + ' ';
  }
  
  // Add encouragement occasionally (30% chance)
  if (Math.random() < 0.3) {
    naturalText += getRandomPhrase('encouragement') + ' ';
  }
  
  // Add the actual question
  naturalText += questionText;
  
  // Add closing encouragement for last question
  if (isLast) {
    naturalText += ' This is our final question, so take your time.';
  }
  
  return naturalText;
};

export const getCompletionPhrase = (): string => {
  return getRandomPhrase('closing');
};
