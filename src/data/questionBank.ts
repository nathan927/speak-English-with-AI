export interface Question {
  id: number;
  text: string;
  section: string;
  instruction?: string;
  grade: string;
  type: 'speaking' | 'reading' | 'personal' | 'dse_group' | 'dse_individual';
  readingPassage?: string;
  setGroup?: string; // For C section pairing (A1, B1, A2, B2, etc.)
}

export interface QuestionSet {
  id: string;
  theme: string;
  description: string;
  questions: Question[];
}

export interface GradeQuestionSets {
  [grade: string]: QuestionSet[];
}

export const questionSets: GradeQuestionSets = {
  // K1 Question Sets
  "K1": [
    {
      id: "k1_about_me",
      theme: "About Me",
      description: "Basic personal information and self-introduction",
      questions: [
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
          text: "Do you have any brothers or sisters?",
          section: "C. Personal",
          grade: "K1",
          type: "personal"
        }
      ]
    },
    {
      id: "k1_animals",
      theme: "Animals",
      description: "Simple questions about animals and sounds",
      questions: [
        {
          id: 4,
          text: "What animal says 'moo'?",
          section: "A. Speaking",
          grade: "K1",
          type: "speaking"
        },
        {
          id: 5,
          text: "What sound does a cat make?",
          section: "A. Speaking",
          grade: "K1",
          type: "speaking"
        },
        {
          id: 6,
          text: "Do you like dogs?",
          section: "A. Speaking",
          grade: "K1",
          type: "speaking"
        }
      ]
    },
    {
      id: "k1_colors_numbers",
      theme: "Colors and Numbers",
      description: "Basic colors and counting",
      questions: [
        {
          id: 7,
          text: "What color do you like?",
          section: "A. Speaking",
          grade: "K1",
          type: "speaking"
        },
        {
          id: 8,
          text: "Count from 1 to 5.",
          section: "B. Reading",
          grade: "K1",
          type: "reading"
        },
        {
          id: 9,
          text: "What color is the sun?",
          section: "A. Speaking",
          grade: "K1",
          type: "speaking"
        }
      ]
    }
  ],

  // K2 Question Sets
  "K2": [
    {
      id: "k2_daily_life",
      theme: "Daily Life",
      description: "Questions about daily routines and activities",
      questions: [
        {
          id: 10,
          text: "What do you like to eat?",
          section: "C. Personal",
          grade: "K2",
          type: "personal"
        },
        {
          id: 11,
          text: "What do you do when you wake up?",
          section: "A. Speaking",
          grade: "K2",
          type: "speaking"
        },
        {
          id: 12,
          text: "What day is today?",
          section: "C. Personal",
          grade: "K2",
          type: "personal"
        }
      ]
    },
    {
      id: "k2_animals_nature",
      theme: "Animals and Nature",
      description: "Questions about animals and the natural world",
      questions: [
        {
          id: 13,
          text: "Name three animals.",
          section: "A. Speaking",
          grade: "K2",
          type: "speaking"
        },
        {
          id: 14,
          text: "What animals live in the water?",
          section: "A. Speaking",
          grade: "K2",
          type: "speaking"
        },
        {
          id: 15,
          text: "Read these words: cat, dog, bird.",
          section: "B. Reading",
          grade: "K2",
          type: "reading"
        }
      ]
    }
  ],

  // K3 Question Sets
  "K3": [
    {
      id: "k3_family_home",
      theme: "Family and Home",
      description: "Questions about family members and home life",
      questions: [
        {
          id: 16,
          text: "Tell me about your family.",
          section: "C. Personal",
          grade: "K3",
          type: "personal"
        },
        {
          id: 17,
          text: "What do you do at home with your family?",
          section: "A. Speaking",
          grade: "K3",
          type: "speaking"
        },
        {
          id: 18,
          text: "Who lives in your house?",
          section: "C. Personal",
          grade: "K3",
          type: "personal"
        }
      ]
    },
    {
      id: "k3_toys_games",
      theme: "Toys and Games",
      description: "Questions about favorite toys and games",
      questions: [
        {
          id: 19,
          text: "What is your favorite toy?",
          section: "C. Personal",
          grade: "K3",
          type: "personal"
        },
        {
          id: 20,
          text: "What games do you like to play?",
          section: "A. Speaking",
          grade: "K3",
          type: "speaking"
        },
        {
          id: 21,
          text: "Do you like to play with friends?",
          section: "A. Speaking",
          grade: "K3",
          type: "speaking"
        }
      ]
    },
    {
      id: "k3_reading",
      theme: "Reading Practice",
      description: "Simple reading exercises",
      questions: [
        {
          id: 22,
          text: "Read this sentence: The sun is bright today.",
          section: "B. Reading",
          grade: "K3",
          type: "reading"
        },
        {
          id: 23,
          text: "Describe what you see in this picture.",
          section: "A. Speaking",
          grade: "K3",
          type: "speaking"
        }
      ]
    }
  ],

  // P1 Question Sets
  "P1": [
    {
      id: "p1_school_life",
      theme: "School Life",
      description: "Questions about school experiences and subjects",
      questions: [
        {
          id: 24,
          text: "What is your favorite subject in school?",
          section: "C. Personal",
          grade: "P1",
          type: "personal"
        },
        {
          id: 25,
          text: "Tell me about your school day.",
          section: "A. Speaking",
          grade: "P1",
          type: "speaking"
        },
        {
          id: 26,
          text: "What do you like most about your school?",
          section: "C. Personal",
          grade: "P1",
          type: "personal"
        }
      ]
    },
    {
      id: "p1_friends_social",
      theme: "Friends and Social Life",
      description: "Questions about friendships and social interactions",
      questions: [
        {
          id: 27,
          text: "Tell me about your best friend.",
          section: "A. Speaking",
          grade: "P1",
          type: "speaking"
        },
        {
          id: 28,
          text: "What do you like to do with your friends?",
          section: "A. Speaking",
          grade: "P1",
          type: "speaking"
        },
        {
          id: 29,
          text: "How do you make new friends?",
          section: "A. Speaking",
          grade: "P1",
          type: "speaking"
        }
      ]
    },
    {
      id: "p1_future_dreams",
      theme: "Future and Dreams",
      description: "Questions about aspirations and future plans",
      questions: [
        {
          id: 30,
          text: "What do you want to be when you grow up?",
          section: "C. Personal",
          grade: "P1",
          type: "personal"
        },
        {
          id: 31,
          text: "Describe your daily routine.",
          section: "A. Speaking",
          grade: "P1",
          type: "speaking"
        },
        {
          id: 32,
          text: "Read this passage about animals.",
          section: "B. Reading",
          grade: "P1",
          type: "reading"
        }
      ]
    }
  ],

  // P2 Question Sets
  "P2": [
    {
      id: "p2_food_preferences",
      theme: "Food and Preferences",
      description: "Questions about food, likes and dislikes",
      questions: [
        {
          id: 33,
          text: "What is your favorite food and why?",
          section: "C. Personal",
          grade: "P2",
          type: "personal"
        },
        {
          id: 34,
          text: "What food do you not like?",
          section: "C. Personal",
          grade: "P2",
          type: "personal"
        },
        {
          id: 35,
          text: "Tell me about a special meal you remember.",
          section: "A. Speaking",
          grade: "P2",
          type: "speaking"
        }
      ]
    },
    {
      id: "p2_activities_sports",
      theme: "Activities and Sports",
      description: "Questions about physical activities and sports",
      questions: [
        {
          id: 36,
          text: "What sports do you like to play?",
          section: "C. Personal",
          grade: "P2",
          type: "personal"
        },
        {
          id: 37,
          text: "Tell me about your favorite activity.",
          section: "A. Speaking",
          grade: "P2",
          type: "speaking"
        },
        {
          id: 38,
          text: "Do you prefer indoor or outdoor activities?",
          section: "A. Speaking",
          grade: "P2",
          type: "speaking"
        }
      ]
    },
    {
      id: "p2_places_memories",
      theme: "Places and Memories",
      description: "Questions about special places and memories",
      questions: [
        {
          id: 39,
          text: "Tell me about a special day you remember.",
          section: "A. Speaking",
          grade: "P2",
          type: "speaking"
        },
        {
          id: 40,
          text: "Describe your favorite place to visit.",
          section: "A. Speaking",
          grade: "P2",
          type: "speaking"
        },
        {
          id: 41,
          text: "Read this story about friendship.",
          section: "B. Reading",
          grade: "P2",
          type: "reading"
        }
      ]
    }
  ],

  // P3 Question Sets - Updated to match the exact content from the attachment
  "P3": [
    {
      id: "p3_assessment_1",
      theme: "Primary 3 Speaking Assessment 1",
      description: "Complete P3 speaking assessment with all sections",
      questions: [
        // A. Spontaneous Language Use
        {
          id: 300,
          text: "Good morning. / Good afternoon.",
          section: "A. Spontaneous Language Use",
          grade: "P3",
          type: "speaking"
        },
        {
          id: 301,
          text: "How old are you?",
          section: "A. Spontaneous Language Use",
          grade: "P3",
          type: "speaking"
        },
        {
          id: 302,
          text: "How are you?",
          section: "A. Spontaneous Language Use",
          grade: "P3",
          type: "speaking"
        },
        {
          id: 303,
          text: "What class are you in?",
          section: "A. Spontaneous Language Use",
          grade: "P3",
          type: "speaking"
        },
        {
          id: 304,
          text: "What's the weather like today?",
          section: "A. Spontaneous Language Use",
          grade: "P3",
          type: "speaking"
        },

        // B. Reading Aloud - Updated with exact content from attachment
        {
          id: 305,
          text: "Please read aloud the passage.",
          section: "B. Reading Aloud",
          grade: "P3",
          type: "reading",
          readingPassage: "The School Picnic\n\nThe school picnic is coming. May and Tom are going to a country park with their classmates. May asks: 'When's the school picnic?' 'It's on the twentieth of January.' says Tom. Then they think about the activities they can do on that day. Tom is interested in sports. He can play football. May can't play football but she can play the guitar. She is interested in music."
        },

        // C. Expression of Personal Experiences - Set A
        {
          id: 306,
          text: "Are you interested in ball games?",
          section: "C. Expression of Personal Experiences",
          grade: "P3",
          type: "personal",
          setGroup: "A1"
        },
        {
          id: 307,
          text: "What do you like doing at the beach?",
          section: "C. Expression of Personal Experiences",
          grade: "P3",
          type: "personal",
          setGroup: "A2"
        },
        {
          id: 308,
          text: "What food do you want on your birthday?",
          section: "C. Expression of Personal Experiences",
          grade: "P3",
          type: "personal",
          setGroup: "A3"
        },

        // C. Expression of Personal Experiences - Set B
        {
          id: 309,
          text: "Are you interested in board games?",
          section: "C. Expression of Personal Experiences",
          grade: "P3",
          type: "personal",
          setGroup: "B1"
        },
        {
          id: 310,
          text: "What do you like doing at the farm?",
          section: "C. Expression of Personal Experiences",
          grade: "P3",
          type: "personal",
          setGroup: "B2"
        },
        {
          id: 311,
          text: "What drinks do you want on your birthday?",
          section: "C. Expression of Personal Experiences",
          grade: "P3",
          type: "personal",
          setGroup: "B3"
        }
      ]
    },
    {
      id: "p3_assessment_2",
      theme: "Primary 3 Speaking Assessment 2",
      description: "Alternative P3 speaking assessment with different topics",
      questions: [
        // A. Spontaneous Language Use
        {
          id: 312,
          text: "Good morning. / Good afternoon.",
          section: "A. Spontaneous Language Use",
          grade: "P3",
          type: "speaking"
        },
        {
          id: 313,
          text: "What's your name?",
          section: "A. Spontaneous Language Use",
          grade: "P3",
          type: "speaking"
        },
        {
          id: 314,
          text: "How do you come to school?",
          section: "A. Spontaneous Language Use",
          grade: "P3",
          type: "speaking"
        },
        {
          id: 315,
          text: "What's your favourite subject?",
          section: "A. Spontaneous Language Use",
          grade: "P3",
          type: "speaking"
        },
        {
          id: 316,
          text: "Do you have any pets?",
          section: "A. Spontaneous Language Use",
          grade: "P3",
          type: "speaking"
        },

        // B. Reading Aloud
        {
          id: 317,
          text: "Please read aloud the passage.",
          section: "B. Reading Aloud",
          grade: "P3",
          type: "reading",
          readingPassage: "My Weekend\n\nLast weekend, I went to the park with my family. We had a picnic under a big tree. My mother made sandwiches and my father brought juice. My little brother played with his toy car. I flew a kite with my sister. The weather was sunny and warm. We had a wonderful time together. I love spending time with my family."
        },

        // C. Expression of Personal Experiences - Set A
        {
          id: 318,
          text: "Do you like playing computer games?",
          section: "C. Expression of Personal Experiences",
          grade: "P3",
          type: "personal",
          setGroup: "A1"
        },
        {
          id: 319,
          text: "What do you usually do after school?",
          section: "C. Expression of Personal Experiences",
          grade: "P3",
          type: "personal",
          setGroup: "A2"
        },
        {
          id: 320,
          text: "Where do you like to go on holidays?",
          section: "C. Expression of Personal Experiences",
          grade: "P3",
          type: "personal",
          setGroup: "A3"
        },

        // C. Expression of Personal Experiences - Set B
        {
          id: 321,
          text: "Do you like reading books?",
          section: "C. Expression of Personal Experiences",
          grade: "P3",
          type: "personal",
          setGroup: "B1"
        },
        {
          id: 322,
          text: "What do you usually do on weekends?",
          section: "C. Expression of Personal Experiences",
          grade: "P3",
          type: "personal",
          setGroup: "B2"
        },
        {
          id: 323,
          text: "What places do you like to visit with your family?",
          section: "C. Expression of Personal Experiences",
          grade: "P3",
          type: "personal",
          setGroup: "B3"
        }
      ]
    }
  ],

  // P4 Question Sets - Created following the same pattern
  "P4": [
    {
      id: "p4_assessment_1",
      theme: "Primary 4 Speaking Assessment 1",
      description: "Complete P4 speaking assessment with all sections",
      questions: [
        // A. Spontaneous Language Use
        {
          id: 400,
          text: "Good morning. / Good afternoon.",
          section: "A. Spontaneous Language Use",
          grade: "P4",
          type: "speaking"
        },
        {
          id: 401,
          text: "What did you do yesterday?",
          section: "A. Spontaneous Language Use",
          grade: "P4",
          type: "speaking"
        },
        {
          id: 402,
          text: "What's your favourite season and why?",
          section: "A. Spontaneous Language Use",
          grade: "P4",
          type: "speaking"
        },
        {
          id: 403,
          text: "How do you usually spend your weekends?",
          section: "A. Spontaneous Language Use",
          grade: "P4",
          type: "speaking"
        },
        {
          id: 404,
          text: "What would you like to be when you grow up?",
          section: "A. Spontaneous Language Use",
          grade: "P4",
          type: "speaking"
        },

        // B. Reading Aloud
        {
          id: 405,
          text: "Please read aloud the passage.",
          section: "B. Reading Aloud",
          grade: "P4",
          type: "reading",
          readingPassage: "A Trip to the Zoo\n\nLast Sunday, our class went to the zoo for a field trip. We saw many different animals. The lions were sleeping under the trees. The monkeys were jumping and playing with each other. The elephants were having a bath in the water. My favourite animals were the pandas. They were eating bamboo and looked very cute. Our teacher told us many interesting facts about the animals. It was an educational and fun day."
        },

        // C. Expression of Personal Experiences - Set A
        {
          id: 406,
          text: "What's your favourite school subject and why?",
          section: "C. Expression of Personal Experiences",
          grade: "P4",
          type: "personal",
          setGroup: "A1"
        },
        {
          id: 407,
          text: "Describe your best friend.",
          section: "C. Expression of Personal Experiences",
          grade: "P4",
          type: "personal",
          setGroup: "A2"
        },
        {
          id: 408,
          text: "What do you like to do during summer holidays?",
          section: "C. Expression of Personal Experiences",
          grade: "P4",
          type: "personal",
          setGroup: "A3"
        },

        // C. Expression of Personal Experiences - Set B
        {
          id: 409,
          text: "What's the most difficult subject for you and why?",
          section: "C. Expression of Personal Experiences",
          grade: "P4",
          type: "personal",
          setGroup: "B1"
        },
        {
          id: 410,
          text: "Tell me about your family members.",
          section: "C. Expression of Personal Experiences",
          grade: "P4",
          type: "personal",
          setGroup: "B2"
        },
        {
          id: 411,
          text: "What do you like to do during winter holidays?",
          section: "C. Expression of Personal Experiences",
          grade: "P4",
          type: "personal",
          setGroup: "B3"
        }
      ]
    },
    {
      id: "p4_assessment_2",
      theme: "Primary 4 Speaking Assessment 2",
      description: "Alternative P4 speaking assessment with different topics",
      questions: [
        // A. Spontaneous Language Use
        {
          id: 412,
          text: "Good morning. / Good afternoon.",
          section: "A. Spontaneous Language Use",
          grade: "P4",
          type: "speaking"
        },
        {
          id: 413,
          text: "What time do you usually go to bed?",
          section: "A. Spontaneous Language Use",
          grade: "P4",
          type: "speaking"
        },
        {
          id: 414,
          text: "What's your favourite food and why?",
          section: "A. Spontaneous Language Use",
          grade: "P4",
          type: "speaking"
        },
        {
          id: 415,
          text: "Do you prefer indoor or outdoor activities?",
          section: "A. Spontaneous Language Use",
          grade: "P4",
          type: "speaking"
        },
        {
          id: 416,
          text: "What makes you happy?",
          section: "A. Spontaneous Language Use",
          grade: "P4",
          type: "speaking"
        },

        // B. Reading Aloud
        {
          id: 417,
          text: "Please read aloud the passage.",
          section: "B. Reading Aloud",
          grade: "P4",
          type: "reading",
          readingPassage: "My School Library\n\nOur school library is a quiet and comfortable place. There are many books on the shelves. Students can borrow story books, picture books, and reference books. The librarian, Mrs. Wong, is very helpful. She helps us find the books we need. There are also computers where we can search for information. Many students like to read there during lunch time. Reading helps us learn new things and improves our English."
        },

        // C. Expression of Personal Experiences - Set A
        {
          id: 418,
          text: "What kind of books do you like to read?",
          section: "C. Expression of Personal Experiences",
          grade: "P4",
          type: "personal",
          setGroup: "A1"
        },
        {
          id: 419,
          text: "Describe your bedroom.",
          section: "C. Expression of Personal Experiences",
          grade: "P4",
          type: "personal",
          setGroup: "A2"
        },
        {
          id: 420,
          text: "What's your favourite festival and why?",
          section: "C. Expression of Personal Experiences",
          grade: "P4",
          type: "personal",
          setGroup: "A3"
        },

        // C. Expression of Personal Experiences - Set B
        {
          id: 421,
          text: "What kind of movies do you like to watch?",
          section: "C. Expression of Personal Experiences",
          grade: "P4",
          type: "personal",
          setGroup: "B1"
        },
        {
          id: 422,
          text: "Describe your school.",
          section: "C. Expression of Personal Experiences",
          grade: "P4",
          type: "personal",
          setGroup: "B2"
        },
        {
          id: 423,
          text: "What's your favourite game and why?",
          section: "C. Expression of Personal Experiences",
          grade: "P4",
          type: "personal",
          setGroup: "B3"
        }
      ]
    }
  ],

  // P5 Question Sets
  "P5": [
    {
      id: "p5_education_opinions",
      theme: "Education and Learning Opinions",
      description: "Questions about educational topics and personal opinions",
      questions: [
        {
          id: 60,
          text: "Do you think homework is necessary? Why?",
          section: "A. Speaking",
          grade: "P5",
          type: "speaking"
        },
        {
          id: 61,
          text: "What subject would you like to learn more about?",
          section: "C. Personal",
          grade: "P5",
          type: "personal"
        },
        {
          id: 62,
          text: "How has your learning style changed over the years?",
          section: "A. Speaking",
          grade: "P5",
          type: "speaking"
        }
      ]
    },
    {
      id: "p5_travel_experiences",
      theme: "Travel and Experiences",
      description: "Questions about travel, vacations and life experiences",
      questions: [
        {
          id: 63,
          text: "Describe your ideal vacation.",
          section: "C. Personal",
          grade: "P5",
          type: "personal"
        },
        {
          id: 64,
          text: "Tell me about an interesting place you have visited.",
          section: "A. Speaking",
          grade: "P5",
          type: "speaking"
        },
        {
          id: 65,
          text: "Would you prefer to travel alone or with family?",
          section: "A. Speaking",
          grade: "P5",
          type: "speaking"
        }
      ]
    },
    {
      id: "p5_covid_impact",
      theme: "Life Changes and Adaptation",
      description: "Questions about adapting to changes and challenges",
      questions: [
        {
          id: 66,
          text: "How has COVID-19 affected your school life?",
          section: "A. Speaking",
          grade: "P5",
          type: "speaking"
        },
        {
          id: 67,
          text: "What positive changes have you made recently?",
          section: "A. Speaking",
          grade: "P5",
          type: "speaking"
        },
        {
          id: 68,
          text: "Read this story about perseverance.",
          section: "B. Reading",
          grade: "P5",
          type: "reading"
        }
      ]
    }
  ],

  // P6 Question Sets
  "P6": [
    {
      id: "p6_social_media",
      theme: "Social Media and Technology",
      description: "Questions about social media impact and digital life",
      questions: [
        {
          id: 69,
          text: "What are the benefits and drawbacks of social media?",
          section: "A. Speaking",
          grade: "P6",
          type: "speaking"
        },
        {
          id: 70,
          text: "How do you use technology responsibly?",
          section: "A. Speaking",
          grade: "P6",
          type: "speaking"
        },
        {
          id: 71,
          text: "Do you think young people spend too much time online?",
          section: "A. Speaking",
          grade: "P6",
          type: "speaking"
        }
      ]
    },
    {
      id: "p6_future_secondary",
      theme: "Future and Secondary School",
      description: "Questions about transition to secondary school and future plans",
      questions: [
        {
          id: 72,
          text: "Describe your plans after primary school.",
          section: "C. Personal",
          grade: "P6",
          type: "personal"
        },
        {
          id: 73,
          text: "What are you most excited about in secondary school?",
          section: "C. Personal",
          grade: "P6",
          type: "personal"
        },
        {
          id: 74,
          text: "What challenges do you expect in secondary school?",
          section: "A. Speaking",
          grade: "P6",
          type: "speaking"
        }
      ]
    },
    {
      id: "p6_environment_responsibility",
      theme: "Environment and Social Responsibility",
      description: "Questions about environmental protection and social awareness",
      questions: [
        {
          id: 75,
          text: "How can young people help protect the environment?",
          section: "A. Speaking",
          grade: "P6",
          type: "speaking"
        },
        {
          id: 76,
          text: "What life skills do you think are most important?",
          section: "A. Speaking",
          grade: "P6",
          type: "speaking"
        },
        {
          id: 77,
          text: "Read this article about renewable energy.",
          section: "B. Reading",
          grade: "P6",
          type: "reading"
        }
      ]
    }
  ],

  // S1 Question Sets
  "S1": [
    {
      id: "s1_adaptation",
      theme: "Adaptation and Change",
      description: "Questions about adapting to secondary school and life changes",
      questions: [
        {
          id: 78,
          text: "How do you adapt to changes in your life?",
          section: "A. Speaking",
          grade: "S1",
          type: "speaking"
        },
        {
          id: 79,
          text: "What are your expectations for secondary school?",
          section: "C. Personal",
          grade: "S1",
          type: "personal"
        },
        {
          id: 80,
          text: "How is secondary school different from primary school?",
          section: "A. Speaking",
          grade: "S1",
          type: "speaking"
        }
      ]
    },
    {
      id: "s1_teenage_issues",
      theme: "Teenage Life and Responsibilities",
      description: "Questions about teenage responsibilities and part-time work",
      questions: [
        {
          id: 81,
          text: "Should students have part-time jobs? Discuss.",
          section: "A. Speaking",
          grade: "S1",
          type: "speaking"
        },
        {
          id: 82,
          text: "How do you maintain friendships as you grow older?",
          section: "C. Personal",
          grade: "S1",
          type: "personal"
        },
        {
          id: 83,
          text: "Read this passage about teenage stress.",
          section: "B. Reading",
          grade: "S1",
          type: "reading"
        }
      ]
    },
    {
      id: "s1_online_shopping",
      theme: "Consumer Awareness",
      description: "Questions about shopping and consumer decisions",
      questions: [
        {
          id: 84,
          text: "What are the pros and cons of online shopping?",
          section: "A. Speaking",
          grade: "S1",
          type: "speaking"
        },
        {
          id: 85,
          text: "How do you make wise purchasing decisions?",
          section: "A. Speaking",
          grade: "S1",
          type: "speaking"
        },
        {
          id: 86,
          text: "Do you prefer shopping online or in stores?",
          section: "A. Speaking",
          grade: "S1",
          type: "speaking"
        }
      ]
    }
  ],

  // S2 Question Sets
  "S2": [
    {
      id: "s2_education_technology",
      theme: "Education and Technology",
      description: "Questions about technology's role in modern education",
      questions: [
        {
          id: 87,
          text: "What role does technology play in education?",
          section: "A. Speaking",
          grade: "S2",
          type: "speaking"
        },
        {
          id: 88,
          text: "How can schools better prepare students for the future?",
          section: "A. Speaking",
          grade: "S2",
          type: "speaking"
        },
        {
          id: 89,
          text: "Should schools provide more technology training?",
          section: "A. Speaking",
          grade: "S2",
          type: "speaking"
        }
      ]
    },
    {
      id: "s2_personal_influence",
      theme: "Personal Growth and Influence",
      description: "Questions about personal development and role models",
      questions: [
        {
          id: 90,
          text: "Describe a person who has influenced you greatly.",
          section: "C. Personal",
          grade: "S2",
          type: "personal"
        },
        {
          id: 91,
          text: "What qualities make a good role model?",
          section: "A. Speaking",
          grade: "S2",
          type: "speaking"
        },
        {
          id: 92,
          text: "How do you influence others positively?",
          section: "A. Speaking",
          grade: "S2",
          type: "speaking"
        }
      ]
    },
    {
      id: "s2_stress_management",
      theme: "Mental Health and Well-being",
      description: "Questions about stress management and mental health",
      questions: [
        {
          id: 93,
          text: "What are your strategies for managing stress?",
          section: "C. Personal",
          grade: "S2",
          type: "personal"
        },
        {
          id: 94,
          text: "How important are extracurricular activities?",
          section: "A. Speaking",
          grade: "S2",
          type: "speaking"
        },
        {
          id: 95,
          text: "Read this article about mental health awareness.",
          section: "B. Reading",
          grade: "S2",
          type: "reading"
        }
      ]
    }
  ],

  // S3-S6 Question Sets (DSE Format)
  "S3": [
    {
      id: "s3_urban_development",
      theme: "Urban Development",
      description: "DSE format questions about urban planning and community impact",
      questions: [
        {
          id: 96,
          text: "Discuss the impact of urban development on local communities",
          section: "DSE Group Discussion",
          grade: "S3",
          type: "dse_group"
        },
        {
          id: 97,
          text: "What benefits does redevelopment bring to a neighborhood?",
          section: "DSE Individual Response",
          grade: "S3",
          type: "dse_individual"
        },
        {
          id: 98,
          text: "What advice would you give to someone starting their career?",
          section: "DSE Individual Response",
          grade: "S3",
          type: "dse_individual"
        }
      ]
    },
    {
      id: "s3_online_learning",
      theme: "Online Learning",
      description: "DSE format questions about digital education challenges",
      questions: [
        {
          id: 99,
          text: "Discuss the challenges of online learning for students",
          section: "DSE Group Discussion",
          grade: "S3",
          type: "dse_group"
        },
        {
          id: 100,
          text: "How can schools make online learning more effective?",
          section: "DSE Individual Response",
          grade: "S3",
          type: "dse_individual"
        }
      ]
    },
    {
      id: "s3_career_pressure",
      theme: "Career Planning",
      description: "DSE format questions about career choices and pressure",
      questions: [
        {
          id: 101,
          text: "Discuss the pressure young people face in choosing careers",
          section: "DSE Group Discussion",
          grade: "S3",
          type: "dse_group"
        }
      ]
    }
  ],

  "S4": [
    {
      id: "s4_social_media",
      theme: "Social Media Impact",
      description: "DSE format questions about social media and teenagers",
      questions: [
        {
          id: 102,
          text: "Discuss the effects of social media on teenagers",
          section: "DSE Group Discussion",
          grade: "S4",
          type: "dse_group"
        },
        {
          id: 103,
          text: "Should schools ban mobile phones? Give your opinion.",
          section: "DSE Individual Response",
          grade: "S4",
          type: "dse_individual"
        },
        {
          id: 104,
          text: "How can we encourage more young people to vote?",
          section: "DSE Individual Response",
          grade: "S4",
          type: "dse_individual"
        }
      ]
    },
    {
      id: "s4_environmental_action",
      theme: "Environmental Protection",
      description: "DSE format questions about environmental responsibility",
      questions: [
        {
          id: 105,
          text: "Discuss ways to reduce plastic waste in daily life",
          section: "DSE Group Discussion",
          grade: "S4",
          type: "dse_group"
        },
        {
          id: 106,
          text: "What can young people do to help the environment?",
          section: "DSE Individual Response",
          grade: "S4",
          type: "dse_individual"
        }
      ]
    },
    {
      id: "s4_work_life_balance",
      theme: "Work-Life Balance",
      description: "DSE format questions about balancing work and personal life",
      questions: [
        {
          id: 107,
          text: "Discuss the importance of work-life balance",
          section: "DSE Group Discussion",
          grade: "S4",
          type: "dse_group"
        }
      ]
    }
  ],

  "S5": [
    {
      id: "s5_artificial_intelligence",
      theme: "Artificial Intelligence",
      description: "DSE format questions about AI and employment",
      questions: [
        {
          id: 108,
          text: "Discuss the impact of artificial intelligence on employment",
          section: "DSE Group Discussion",
          grade: "S5",
          type: "dse_group"
        },
        {
          id: 109,
          text: "How will AI change the job market in the future?",
          section: "DSE Individual Response",
          grade: "S5",
          type: "dse_individual"
        },
        {
          id: 110,
          text: "What skills will be most important in the future workplace?",
          section: "DSE Individual Response",
          grade: "S5",
          type: "dse_individual"
        }
      ]
    },
    {
      id: "s5_remote_work",
      theme: "Remote Work",
      description: "DSE format questions about working from home",
      questions: [
        {
          id: 111,
          text: "Discuss the benefits and drawbacks of remote work",
          section: "DSE Group Discussion",
          grade: "S5",
          type: "dse_group"
        },
        {
          id: 112,
          text: "Would you prefer to work from home or in an office?",
          section: "DSE Individual Response",
          grade: "S5",
          type: "dse_individual"
        }
      ]
    },
    {
      id: "s5_mental_health",
      theme: "Mental Health in Schools",
      description: "DSE format questions about promoting mental wellness",
      questions: [
        {
          id: 113,
          text: "Discuss ways to promote mental health in schools",
          section: "DSE Group Discussion",
          grade: "S5",
          type: "dse_group"
        }
      ]
    }
  ],

  "S6": [
    {
      id: "s6_university_preparation",
      theme: "University and Career Preparation",
      description: "DSE format questions about higher education choices",
      questions: [
        {
          id: 114,
          text: "Discuss the challenges facing young people entering university",
          section: "DSE Group Discussion",
          grade: "S6",
          type: "dse_group"
        },
        {
          id: 115,
          text: "What factors should students consider when choosing a university course?",
          section: "DSE Individual Response",
          grade: "S6",
          type: "dse_individual"
        },
        {
          id: 116,
          text: "How can Hong Kong maintain its competitive advantage?",
          section: "DSE Individual Response",
          grade: "S6",
          type: "dse_individual"
        }
      ]
    },
    {
      id: "s6_international_exchange",
      theme: "International Exchange",
      description: "DSE format questions about studying abroad",
      questions: [
        {
          id: 117,
          text: "Discuss the role of international exchange programs",
          section: "DSE Group Discussion",
          grade: "S6",
          type: "dse_group"
        },
        {
          id: 118,
          text: "Would you like to study abroad? Why or why not?",
          section: "DSE Individual Response",
          grade: "S6",
          type: "dse_individual"
        }
      ]
    },
    {
      id: "s6_generation_gap",
      theme: "Generation Gap",
      description: "DSE format questions about bridging generational differences",
      questions: [
        {
          id: 119,
          text: "Discuss ways to bridge the generation gap",
          section: "DSE Group Discussion",
          grade: "S6",
          type: "dse_group"
        }
      ]
    }
  ]
};

// Legacy function to maintain compatibility - now returns all questions from all sets
export const questionBank: Question[] = Object.values(questionSets)
  .flat()
  .flatMap(set => set.questions);

// Updated function to get a random question set (theme-based) for a specific grade
export const getRandomQuestionSet = (grade: string): Question[] => {
  const gradeQuestionSets = questionSets[grade] || [];
  
  if (gradeQuestionSets.length === 0) {
    console.warn(`No question sets found for grade ${grade}`);
    return [];
  }
  
  // For DSE grades (S3-S6), return all questions from all sets
  if (['S3', 'S4', 'S5', 'S6'].includes(grade)) {
    return gradeQuestionSets.flatMap(set => set.questions);
  }
  
  // For other grades, randomly select one complete question set (theme)
  const randomIndex = Math.floor(Math.random() * gradeQuestionSets.length);
  const selectedSet = gradeQuestionSets[randomIndex];
  
  console.log(`Selected question set for ${grade}: "${selectedSet.theme}" (${selectedSet.questions.length} questions)`);
  
  return selectedSet.questions;
};

// Function to get all available question sets for a specific grade
export const getQuestionSetsByGrade = (grade: string): QuestionSet[] => {
  return questionSets[grade] || [];
};

// Function to get questions from a specific question set
export const getQuestionsBySetId = (grade: string, setId: string): Question[] => {
  const gradeQuestionSets = questionSets[grade] || [];
  const questionSet = gradeQuestionSets.find(set => set.id === setId);
  return questionSet ? questionSet.questions : [];
};

// Function to get all questions for a specific grade (from all sets)
export const getQuestionsByGrade = (grade: string): Question[] => {
  const gradeQuestionSets = questionSets[grade] || [];
  return gradeQuestionSets.flatMap(set => set.questions);
};

// Function to get a random question by type from a specific grade
export const getRandomQuestionByType = (grade: string, type: Question['type']): Question | null => {
  const allGradeQuestions = getQuestionsByGrade(grade);
  const questions = allGradeQuestions.filter(q => q.type === type);
  if (questions.length === 0) return null;
  return questions[Math.floor(Math.random() * questions.length)];
};
