// Discussion Variations Service - Natural, varied openings and endings

// Opening variations - humanized and natural
export const openingVariations = [
  (supporter: string, opposer: string, topic: string, userName?: string) => 
    `Good afternoon everyone! ${userName ? `Hi ${userName}, ` : ''}I'm ${supporter}, and this is ${opposer}. Today we'll be discussing: "${topic}". This is quite an interesting topic, isn't it? I'm curious to hear what everyone thinks. ${userName ? `${userName}, would you like to kick things off?` : 'Would someone like to start us off?'}`,
  
  (supporter: string, opposer: string, topic: string, userName?: string) => 
    `Hey everyone, welcome to our group discussion! I'm ${supporter}, and joining us is ${opposer}. ${userName ? `And of course, ${userName} - ` : ''}So our topic today is: "${topic}". There's a lot to unpack here, so let's dive right in! Who wants to share their initial thoughts?`,
  
  (supporter: string, opposer: string, topic: string, userName?: string) => 
    `Hello! Great to be here with you all. My name's ${supporter}, and that's ${opposer} over there. ${userName ? `Nice to meet you, ${userName}! ` : ''}Today's discussion topic is: "${topic}". I've been thinking about this, and I'm really interested to hear different perspectives. Shall we begin?`,
  
  (supporter: string, opposer: string, topic: string, userName?: string) => 
    `Welcome everyone! Before we start, let me introduce ourselves - I'm ${supporter}, ${opposer} is here with us${userName ? `, and we have ${userName} joining` : ''}. Our topic for discussion is: "${topic}". This is something that affects all of us, so let's have an open and honest conversation about it.`,
  
  (supporter: string, opposer: string, topic: string, userName?: string) => 
    `Good day! So excited for today's discussion. I'm ${supporter}, and my friend ${opposer} is also here. ${userName ? `${userName}, thanks for joining us! ` : ''}We'll be talking about: "${topic}". It's quite a thought-provoking subject. I'd love to hear everyone's views - who'd like to go first?`,
  
  (supporter: string, opposer: string, topic: string, userName?: string) => 
    `Hi everyone! Let's get started. I'm ${supporter}, and ${opposer} is my discussion partner today. ${userName ? `Welcome, ${userName}! ` : ''}Our topic is: "${topic}". Now, this is something people have strong opinions about, so let's explore it together. Feel free to share your honest thoughts!`,
  
  (supporter: string, opposer: string, topic: string, userName?: string) => 
    `Alright, let's begin! I'm ${supporter}, nice to meet you all, and here's ${opposer}. ${userName ? `${userName}, glad you could join us. ` : ''}Today we're discussing: "${topic}". I know we might have different views on this, and that's totally fine - that's what makes discussions interesting! So, who has something to say?`,
  
  (supporter: string, opposer: string, topic: string, userName?: string) => 
    `Hello and welcome to our speaking practice session! My name is ${supporter}, and I'm joined by ${opposer}${userName ? ` and ${userName}` : ''}. We'll be discussing: "${topic}". Remember, there are no wrong answers here - just share your genuine thoughts and reasons. Ready to start?`
];

// Closing variations - humanized and encouraging
export const closingVariations = [
  (userName?: string) => 
    `Wow, that was a fantastic discussion! ${userName ? `${userName}, you made some really thoughtful points. ` : ''}I learned a lot from hearing everyone's perspectives. Great job everyone!`,
  
  (userName?: string) => 
    `And that brings us to the end of our discussion. ${userName ? `${userName}, ` : ''}I really enjoyed hearing your ideas - there were some excellent arguments made today. Well done, all of you!`,
  
  (userName?: string) => 
    `What a great conversation! ${userName ? `${userName}, your contributions were really valuable. ` : ''}It's amazing how we can see the same topic from so many different angles. Thanks everyone for sharing!`,
  
  (userName?: string) => 
    `Time flies when you're having a good discussion! ${userName ? `${userName}, you brought up some interesting points that made me think. ` : ''}I think we all did a brilliant job exploring this topic together.`,
  
  (userName?: string) => 
    `Alright, that's a wrap! ${userName ? `${userName}, I appreciate your active participation. ` : ''}Everyone showed great critical thinking skills today. Keep practicing, and you'll do wonderfully in your speaking exams!`,
  
  (userName?: string) => 
    `What an engaging discussion! ${userName ? `${userName}, your examples were particularly relevant. ` : ''}We covered so many aspects of this topic. Great teamwork, everyone - this is exactly what a good discussion looks like!`,
  
  (userName?: string) => 
    `And we're done! ${userName ? `${userName}, you should be proud of your contributions today. ` : ''}It's clear that everyone put thought into their responses. Remember, practice makes perfect - keep up the great work!`,
  
  (userName?: string) => 
    `That was wonderful! ${userName ? `${userName}, you showed great confidence in sharing your views. ` : ''}Discussions like this really help improve our speaking skills. Thank you all for such a productive session!`,
  
  (userName?: string) => 
    `Brilliant discussion, everyone! ${userName ? `${userName}, I noticed you used some excellent vocabulary and reasoning. ` : ''}Keep practicing expressing your ideas clearly - you're all doing great!`,
  
  (userName?: string) => 
    `We've had a really productive discussion today. ${userName ? `${userName}, your willingness to engage with different viewpoints was impressive. ` : ''}Remember, the key is to listen, think, and respond thoughtfully - just like you did today!`
];

// Get a random opening
export function getRandomOpening(
  supporterName: string,
  opposerName: string,
  topic: string,
  userName?: string
): string {
  const randomIndex = Math.floor(Math.random() * openingVariations.length);
  return openingVariations[randomIndex](supporterName, opposerName, topic, userName);
}

// Get a random closing
export function getRandomClosing(userName?: string): string {
  const randomIndex = Math.floor(Math.random() * closingVariations.length);
  return closingVariations[randomIndex](userName);
}
