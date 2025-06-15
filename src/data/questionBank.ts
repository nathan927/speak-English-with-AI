
export interface Question {
  id: number;
  text: string;
  section: string;
  instruction?: string;
  grade: string;
  type: 'speaking' | 'reading' | 'personal' | 'dse_group' | 'dse_individual';
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

  // P3 Question Sets
  "P3": [
    {
      id: "p3_school_books",
      theme: "School and Reading",
      description: "Questions about school life and reading habits",
      questions: [
        {
          id: 42,
          text: "What do you like most about your school?",
          section: "C. Personal",
          grade: "P3",
          type: "personal"
        },
        {
          id: 43,
          text: "Tell me about a book you have read recently.",
          section: "A. Speaking",
          grade: "P3",
          type: "speaking"
        },
        {
          id: 44,
          text: "Do you prefer reading books or watching TV?",
          section: "A. Speaking",
          grade: "P3",
          type: "speaking"
        }
      ]
    },
    {
      id: "p3_hobbies_activities",
      theme: "Hobbies and Weekend Activities",
      description: "Questions about personal interests and weekend activities",
      questions: [
        {
          id: 45,
          text: "What are your hobbies?",
          section: "C. Personal",
          grade: "P3",
          type: "personal"
        },
        {
          id: 46,
          text: "Describe what you did last weekend.",
          section: "A. Speaking",
          grade: "P3",
          type: "speaking"
        },
        {
          id: 47,
          text: "What do you like to do in your free time?",
          section: "A. Speaking",
          grade: "P3",
          type: "speaking"
        }
      ]
    },
    {
      id: "p3_environment",
      theme: "Environment and Nature",
      description: "Questions about environmental awareness",
      questions: [
        {
          id: 48,
          text: "Read this article about the environment.",
          section: "B. Reading",
          grade: "P3",
          type: "reading"
        },
        {
          id: 49,
          text: "How can we protect the environment?",
          section: "A. Speaking",
          grade: "P3",
          type: "speaking"
        },
        {
          id: 50,
          text: "What do you do to help the environment?",
          section: "A. Speaking",
          grade: "P3",
          type: "speaking"
        }
      ]
    }
  ],

  // P4 Question Sets
  "P4": [
    {
      id: "p4_school_challenges",
      theme: "School Life and Challenges",
      description: "Questions about school experiences and academic challenges",
      questions: [
        {
          id: 51,
          text: "What challenges do students face in school today?",
          section: "A. Speaking",
          grade: "P4",
          type: "speaking"
        },
        {
          id: 52,
          text: "Tell me about your favorite teacher and why.",
          section: "C. Personal",
          grade: "P4",
          type: "personal"
        },
        {
          id: 53,
          text: "How do you handle difficult subjects in school?",
          section: "A. Speaking",
          grade: "P4",
          type: "speaking"
        }
      ]
    },
    {
      id: "p4_technology_learning",
      theme: "Technology and Learning",
      description: "Questions about technology's role in education",
      questions: [
        {
          id: 54,
          text: "How do you think technology affects learning?",
          section: "A. Speaking",
          grade: "P4",
          type: "speaking"
        },
        {
          id: 55,
          text: "What technology do you use for studying?",
          section: "A. Speaking",
          grade: "P4",
          type: "speaking"
        },
        {
          id: 56,
          text: "Read this passage about climate change.",
          section: "B. Reading",
          grade: "P4",
          type: "reading"
        }
      ]
    },
    {
      id: "p4_goals_future",
      theme: "Goals and Future Planning",
      description: "Questions about personal goals and future aspirations",
      questions: [
        {
          id: 57,
          text: "What are your goals for this school year?",
          section: "C. Personal",
          grade: "P4",
          type: "personal"
        },
        {
          id: 58,
          text: "How do you plan to achieve your goals?",
          section: "A. Speaking",
          grade: "P4",
          type: "speaking"
        },
        {
          id: 59,
          text: "What skills do you want to improve?",
          section: "C. Personal",
          grade: "P4",
          type: "personal"
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

