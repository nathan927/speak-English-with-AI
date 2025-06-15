
export interface Question {
  id: number;
  text: string;
  section: string;
  instruction?: string;
  grade: string;
  type: 'speaking' | 'reading' | 'personal' | 'dse_group' | 'dse_individual';
}

export const questionBank: Question[] = [
  // K1 Questions
  {
    id: 1,
    text: "What is your name?",
    section: "C. Personal",
    grade: "K1",
    type: "personal"
  },
  {
    id: 2,
    text: "How old are you?",
    section: "C. Personal", 
    grade: "K1",
    type: "personal"
  },
  {
    id: 3,
    text: "What color do you like?",
    section: "A. Speaking",
    grade: "K1",
    type: "speaking"
  },
  {
    id: 4,
    text: "Count from 1 to 5.",
    section: "B. Reading",
    grade: "K1",
    type: "reading"
  },
  {
    id: 5,
    text: "What animal says 'moo'?",
    section: "A. Speaking",
    grade: "K1",
    type: "speaking"
  },

  // K2 Questions
  {
    id: 6,
    text: "What do you like to eat?",
    section: "C. Personal",
    grade: "K2",
    type: "personal"
  },
  {
    id: 7,
    text: "Name three animals.",
    section: "A. Speaking",
    grade: "K2",
    type: "speaking"
  },
  {
    id: 8,
    text: "What day is today?",
    section: "C. Personal",
    grade: "K2",
    type: "personal"
  },
  {
    id: 9,
    text: "Read these words: cat, dog, bird.",
    section: "B. Reading",
    grade: "K2",
    type: "reading"
  },
  {
    id: 10,
    text: "What do you do when you wake up?",
    section: "A. Speaking",
    grade: "K2",
    type: "speaking"
  },

  // K3 Questions
  {
    id: 11,
    text: "Tell me about your family.",
    section: "C. Personal",
    grade: "K3",
    type: "personal"
  },
  {
    id: 12,
    text: "What is your favorite toy?",
    section: "C. Personal",
    grade: "K3",
    type: "personal"
  },
  {
    id: 13,
    text: "Describe what you see in this picture.",
    section: "A. Speaking",
    grade: "K3",
    type: "speaking"
  },
  {
    id: 14,
    text: "Read this sentence: The sun is bright today.",
    section: "B. Reading",
    grade: "K3",
    type: "reading"
  },
  {
    id: 15,
    text: "What games do you like to play?",
    section: "A. Speaking",
    grade: "K3",
    type: "speaking"
  },

  // P1 Questions
  {
    id: 16,
    text: "What is your favorite subject in school?",
    section: "C. Personal",
    grade: "P1",
    type: "personal"
  },
  {
    id: 17,
    text: "Tell me about your best friend.",
    section: "A. Speaking",
    grade: "P1",
    type: "speaking"
  },
  {
    id: 18,
    text: "What do you want to be when you grow up?",
    section: "C. Personal",
    grade: "P1",
    type: "personal"
  },
  {
    id: 19,
    text: "Read this passage about animals.",
    section: "B. Reading",
    grade: "P1",
    type: "reading"
  },
  {
    id: 20,
    text: "Describe your daily routine.",
    section: "A. Speaking",
    grade: "P1",
    type: "speaking"
  },

  // P2 Questions
  {
    id: 21,
    text: "What is your favorite food and why?",
    section: "C. Personal",
    grade: "P2",
    type: "personal"
  },
  {
    id: 22,
    text: "Tell me about a special day you remember.",
    section: "A. Speaking",
    grade: "P2",
    type: "speaking"
  },
  {
    id: 23,
    text: "What sports do you like to play?",
    section: "C. Personal",
    grade: "P2",
    type: "personal"
  },
  {
    id: 24,
    text: "Read this story about friendship.",
    section: "B. Reading",
    grade: "P2",
    type: "reading"
  },
  {
    id: 25,
    text: "Describe your favorite place to visit.",
    section: "A. Speaking",
    grade: "P2",
    type: "speaking"
  },

  // P3 Questions
  {
    id: 26,
    text: "What do you like most about your school?",
    section: "C. Personal",
    grade: "P3",
    type: "personal"
  },
  {
    id: 27,
    text: "Tell me about a book you have read recently.",
    section: "A. Speaking",
    grade: "P3",
    type: "speaking"
  },
  {
    id: 28,
    text: "What are your hobbies?",
    section: "C. Personal",
    grade: "P3",
    type: "personal"
  },
  {
    id: 29,
    text: "Read this article about the environment.",
    section: "B. Reading",
    grade: "P3",
    type: "reading"
  },
  {
    id: 30,
    text: "Describe what you did last weekend.",
    section: "A. Speaking",
    grade: "P3",
    type: "speaking"
  },

  // P4 Questions
  {
    id: 31,
    text: "What challenges do students face in school today?",
    section: "A. Speaking",
    grade: "P4",
    type: "speaking"
  },
  {
    id: 32,
    text: "Tell me about your favorite teacher and why.",
    section: "C. Personal",
    grade: "P4",
    type: "personal"
  },
  {
    id: 33,
    text: "How do you think technology affects learning?",
    section: "A. Speaking",
    grade: "P4",
    type: "speaking"
  },
  {
    id: 34,
    text: "Read this passage about climate change.",
    section: "B. Reading",
    grade: "P4",
    type: "reading"
  },
  {
    id: 35,
    text: "What are your goals for this school year?",
    section: "C. Personal",
    grade: "P4",
    type: "personal"
  },

  // P5 Questions
  {
    id: 36,
    text: "Do you think homework is necessary? Why?",
    section: "A. Speaking",
    grade: "P5",
    type: "speaking"
  },
  {
    id: 37,
    text: "Describe your ideal vacation.",
    section: "C. Personal",
    grade: "P5",
    type: "personal"
  },
  {
    id: 38,
    text: "How has COVID-19 affected your school life?",
    section: "A. Speaking",
    grade: "P5",
    type: "speaking"
  },
  {
    id: 39,
    text: "Read this story about perseverance.",
    section: "B. Reading",
    grade: "P5",
    type: "reading"
  },
  {
    id: 40,
    text: "What subject would you like to learn more about?",
    section: "C. Personal",
    grade: "P5",
    type: "personal"
  },

  // P6 Questions
  {
    id: 41,
    text: "What are the benefits and drawbacks of social media?",
    section: "A. Speaking",
    grade: "P6",
    type: "speaking"
  },
  {
    id: 42,
    text: "Describe your plans after primary school.",
    section: "C. Personal",
    grade: "P6",
    type: "personal"
  },
  {
    id: 43,
    text: "How can young people help protect the environment?",
    section: "A. Speaking",
    grade: "P6",
    type: "speaking"
  },
  {
    id: 44,
    text: "Read this article about renewable energy.",
    section: "B. Reading",
    grade: "P6",
    type: "reading"
  },
  {
    id: 45,
    text: "What life skills do you think are most important?",
    section: "A. Speaking",
    grade: "P6",
    type: "speaking"
  },

  // S1 Questions
  {
    id: 46,
    text: "How do you adapt to changes in your life?",
    section: "A. Speaking",
    grade: "S1",
    type: "speaking"
  },
  {
    id: 47,
    text: "What are your expectations for secondary school?",
    section: "C. Personal",
    grade: "S1",
    type: "personal"
  },
  {
    id: 48,
    text: "Should students have part-time jobs? Discuss.",
    section: "A. Speaking",
    grade: "S1",
    type: "speaking"
  },
  {
    id: 49,
    text: "Read this passage about teenage stress.",
    section: "B. Reading",
    grade: "S1",
    type: "reading"
  },
  {
    id: 50,
    text: "How do you maintain friendships as you grow older?",
    section: "C. Personal",
    grade: "S1",
    type: "personal"
  },

  // S2 Questions
  {
    id: 51,
    text: "What role does technology play in education?",
    section: "A. Speaking",
    grade: "S2",
    type: "speaking"
  },
  {
    id: 52,
    text: "Describe a person who has influenced you greatly.",
    section: "C. Personal",
    grade: "S2",
    type: "personal"
  },
  {
    id: 53,
    text: "How can schools better prepare students for the future?",
    section: "A. Speaking",
    grade: "S2",
    type: "speaking"
  },
  {
    id: 54,
    text: "Read this article about mental health awareness.",
    section: "B. Reading",
    grade: "S2",
    type: "reading"
  },
  {
    id: 55,
    text: "What are your strategies for managing stress?",
    section: "C. Personal",
    grade: "S2",
    type: "personal"
  },

  // S3 Questions - DSE Format
  {
    id: 56,
    text: "Discuss the impact of urban development on local communities",
    section: "DSE Group Discussion",
    grade: "S3",
    type: "dse_group"
  },
  {
    id: 57,
    text: "What benefits does redevelopment bring to a neighborhood?",
    section: "DSE Individual Response",
    grade: "S3",
    type: "dse_individual"
  },
  {
    id: 58,
    text: "Discuss the challenges of online learning for students",
    section: "DSE Group Discussion",
    grade: "S3",
    type: "dse_group"
  },
  {
    id: 59,
    text: "How can schools make online learning more effective?",
    section: "DSE Individual Response",
    grade: "S3",
    type: "dse_individual"
  },
  {
    id: 60,
    text: "Discuss the pressure young people face in choosing careers",
    section: "DSE Group Discussion",
    grade: "S3",
    type: "dse_group"
  },

  // S4 Questions - DSE Format
  {
    id: 61,
    text: "Discuss the effects of social media on teenagers",
    section: "DSE Group Discussion",
    grade: "S4",
    type: "dse_group"
  },
  {
    id: 62,
    text: "Should schools ban mobile phones? Give your opinion.",
    section: "DSE Individual Response",
    grade: "S4",
    type: "dse_individual"
  },
  {
    id: 63,
    text: "Discuss ways to reduce plastic waste in daily life",
    section: "DSE Group Discussion",
    grade: "S4",
    type: "dse_group"
  },
  {
    id: 64,
    text: "What can young people do to help the environment?",
    section: "DSE Individual Response",
    grade: "S4",
    type: "dse_individual"
  },
  {
    id: 65,
    text: "Discuss the importance of work-life balance",
    section: "DSE Group Discussion",
    grade: "S4",
    type: "dse_group"
  },

  // S5 Questions - DSE Format
  {
    id: 66,
    text: "Discuss the impact of artificial intelligence on employment",
    section: "DSE Group Discussion",
    grade: "S5",
    type: "dse_group"
  },
  {
    id: 67,
    text: "How will AI change the job market in the future?",
    section: "DSE Individual Response",
    grade: "S5",
    type: "dse_individual"
  },
  {
    id: 68,
    text: "Discuss the benefits and drawbacks of remote work",
    section: "DSE Group Discussion",
    grade: "S5",
    type: "dse_group"
  },
  {
    id: 69,
    text: "Would you prefer to work from home or in an office?",
    section: "DSE Individual Response",
    grade: "S5",
    type: "dse_individual"
  },
  {
    id: 70,
    text: "Discuss ways to promote mental health in schools",
    section: "DSE Group Discussion",
    grade: "S5",
    type: "dse_group"
  },

  // S6 Questions - DSE Format
  {
    id: 71,
    text: "Discuss the challenges facing young people entering university",
    section: "DSE Group Discussion",
    grade: "S6",
    type: "dse_group"
  },
  {
    id: 72,
    text: "What factors should students consider when choosing a university course?",
    section: "DSE Individual Response",
    grade: "S6",
    type: "dse_individual"
  },
  {
    id: 73,
    text: "Discuss the role of international exchange programs",
    section: "DSE Group Discussion",
    grade: "S6",
    type: "dse_group"
  },
  {
    id: 74,
    text: "Would you like to study abroad? Why or why not?",
    section: "DSE Individual Response",
    grade: "S6",
    type: "dse_individual"
  },
  {
    id: 75,
    text: "Discuss ways to bridge the generation gap",
    section: "DSE Group Discussion",
    grade: "S6",
    type: "dse_group"
  },

  // Additional questions to ensure at least 5 per grade
  {
    id: 76,
    text: "What makes you happy?",
    section: "A. Speaking",
    grade: "K1",
    type: "speaking"
  },
  {
    id: 77,
    text: "Tell me about your pets.",
    section: "A. Speaking",
    grade: "K2",
    type: "speaking"
  },
  {
    id: 78,
    text: "What is your favorite season?",
    section: "A. Speaking",
    grade: "K3",
    type: "speaking"
  },
  {
    id: 79,
    text: "How do you help at home?",
    section: "A. Speaking",
    grade: "P1",
    type: "speaking"
  },
  {
    id: 80,
    text: "What makes a good friend?",
    section: "A. Speaking",
    grade: "P2",
    type: "speaking"
  },
  {
    id: 81,
    text: "Describe your dream house.",
    section: "A. Speaking",
    grade: "P3",
    type: "speaking"
  },
  {
    id: 82,
    text: "How can we make our school better?",
    section: "A. Speaking",
    grade: "P4",
    type: "speaking"
  },
  {
    id: 83,
    text: "What would you do with one million dollars?",
    section: "A. Speaking",
    grade: "P5",
    type: "speaking"
  },
  {
    id: 84,
    text: "How will the world change in the next 10 years?",
    section: "A. Speaking",
    grade: "P6",
    type: "speaking"
  },
  {
    id: 85,
    text: "What are the pros and cons of online shopping?",
    section: "A. Speaking",
    grade: "S1",
    type: "speaking"
  },
  {
    id: 86,
    text: "How important are extracurricular activities?",
    section: "A. Speaking",
    grade: "S2",
    type: "speaking"
  },
  {
    id: 87,
    text: "What advice would you give to someone starting their career?",
    section: "DSE Individual Response",
    grade: "S3",
    type: "dse_individual"
  },
  {
    id: 88,
    text: "How can we encourage more young people to vote?",
    section: "DSE Individual Response",
    grade: "S4",
    type: "dse_individual"
  },
  {
    id: 89,
    text: "What skills will be most important in the future workplace?",
    section: "DSE Individual Response",
    grade: "S5",
    type: "dse_individual"
  },
  {
    id: 90,
    text: "How can Hong Kong maintain its competitive advantage?",
    section: "DSE Individual Response",
    grade: "S6",
    type: "dse_individual"
  }
];

// Function to get random questions for a specific grade
export const getRandomQuestionSet = (grade: string): Question[] => {
  const gradeQuestions = questionBank.filter(q => q.grade === grade);
  
  // For DSE grades (S3-S6), return all questions as they follow a different format
  if (['S3', 'S4', 'S5', 'S6'].includes(grade)) {
    return gradeQuestions;
  }
  
  // For other grades, shuffle and return 3-5 questions
  const shuffled = [...gradeQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(5, shuffled.length));
};

// Function to get all questions for a specific grade
export const getQuestionsByGrade = (grade: string): Question[] => {
  return questionBank.filter(q => q.grade === grade);
};

// Function to get a random question by type
export const getRandomQuestionByType = (grade: string, type: Question['type']): Question | null => {
  const questions = questionBank.filter(q => q.grade === grade && q.type === type);
  if (questions.length === 0) return null;
  return questions[Math.floor(Math.random() * questions.length)];
};
