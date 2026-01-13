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
  // K1 Question Sets - Expanded with more variety
  "K1": [
    {
      id: "k1_about_me",
      theme: "About Me",
      description: "Basic personal information and self-introduction",
      questions: [
        { id: 1, text: "What is your name?", section: "C. Personal", grade: "K1", type: "personal" },
        { id: 2, text: "How old are you?", section: "C. Personal", grade: "K1", type: "personal" },
        { id: 3, text: "Do you have any brothers or sisters?", section: "C. Personal", grade: "K1", type: "personal" },
        { id: 1001, text: "What is your favorite color?", section: "C. Personal", grade: "K1", type: "personal" },
        { id: 1002, text: "Who is in your family?", section: "C. Personal", grade: "K1", type: "personal" },
        { id: 1003, text: "What is your favorite toy?", section: "C. Personal", grade: "K1", type: "personal" }
      ]
    },
    {
      id: "k1_animals",
      theme: "Animals",
      description: "Simple questions about animals and sounds",
      questions: [
        { id: 4, text: "What animal says 'moo'?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 5, text: "What sound does a cat make?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 6, text: "Do you like dogs?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1004, text: "What sound does a duck make?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1005, text: "Can you name a big animal?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1006, text: "What animal has a long neck?", section: "A. Speaking", grade: "K1", type: "speaking" }
      ]
    },
    {
      id: "k1_colors_numbers",
      theme: "Colors and Numbers",
      description: "Basic colors and counting",
      questions: [
        { id: 7, text: "What color do you like?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 8, text: "Count from 1 to 5.", section: "B. Reading", grade: "K1", type: "reading" },
        { id: 9, text: "What color is the sun?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1007, text: "What color is the sky?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1008, text: "How many fingers do you have?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1009, text: "What color is grass?", section: "A. Speaking", grade: "K1", type: "speaking" }
      ]
    },
    {
      id: "k1_food_drinks",
      theme: "Food and Drinks",
      description: "Simple questions about food preferences",
      questions: [
        { id: 1010, text: "Do you like apples?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1011, text: "What do you drink in the morning?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1012, text: "Do you like ice cream?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1013, text: "What is your favorite fruit?", section: "C. Personal", grade: "K1", type: "personal" },
        { id: 1014, text: "Do you like cookies?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1015, text: "What do you eat for breakfast?", section: "C. Personal", grade: "K1", type: "personal" }
      ]
    },
    {
      id: "k1_body_parts",
      theme: "Body Parts",
      description: "Learning about body parts",
      questions: [
        { id: 1016, text: "Where are your eyes?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1017, text: "How many ears do you have?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1018, text: "What do you do with your hands?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1019, text: "What color is your hair?", section: "C. Personal", grade: "K1", type: "personal" },
        { id: 1020, text: "Can you clap your hands?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1021, text: "What do you do with your feet?", section: "A. Speaking", grade: "K1", type: "speaking" }
      ]
    },
    {
      id: "k1_weather",
      theme: "Weather",
      description: "Simple weather questions",
      questions: [
        { id: 1022, text: "Is it sunny today?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1023, text: "Do you like rain?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1024, text: "What do you wear when it's cold?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1025, text: "What is the weather like today?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1026, text: "Do you like snow?", section: "A. Speaking", grade: "K1", type: "speaking" },
        { id: 1027, text: "What do you do on a rainy day?", section: "A. Speaking", grade: "K1", type: "speaking" }
      ]
    }
  ],

  // K2 Question Sets - Expanded
  "K2": [
    {
      id: "k2_daily_life",
      theme: "Daily Life",
      description: "Questions about daily routines and activities",
      questions: [
        { id: 10, text: "What do you like to eat?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 11, text: "What do you do when you wake up?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 12, text: "What day is today?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 2001, text: "What time do you go to bed?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 2002, text: "Do you brush your teeth every day?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 2003, text: "What do you do after school?", section: "A. Speaking", grade: "K2", type: "speaking" }
      ]
    },
    {
      id: "k2_animals_nature",
      theme: "Animals and Nature",
      description: "Questions about animals and the natural world",
      questions: [
        { id: 13, text: "Name three animals.", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 14, text: "What animals live in the water?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 15, text: "Read these words: cat, dog, bird.", section: "B. Reading", grade: "K2", type: "reading" },
        { id: 2004, text: "What animals fly in the sky?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 2005, text: "Do you have a pet?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 2006, text: "What is your favorite animal?", section: "C. Personal", grade: "K2", type: "personal" }
      ]
    },
    {
      id: "k2_family_friends",
      theme: "Family and Friends",
      description: "Questions about family members and friends",
      questions: [
        { id: 2007, text: "Who do you play with?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 2008, text: "Do you have a best friend?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 2009, text: "What does your mommy do?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 2010, text: "What does your daddy do?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 2011, text: "How many people are in your family?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 2012, text: "Do you like to play with friends?", section: "A. Speaking", grade: "K2", type: "speaking" }
      ]
    },
    {
      id: "k2_school",
      theme: "School",
      description: "Questions about school experience",
      questions: [
        { id: 2013, text: "What is your teacher's name?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 2014, text: "Do you like school?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 2015, text: "What do you learn at school?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 2016, text: "What do you do at playtime?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 2017, text: "Who is your best friend at school?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 2018, text: "What is your favorite thing at school?", section: "C. Personal", grade: "K2", type: "personal" }
      ]
    },
    {
      id: "k2_toys_play",
      theme: "Toys and Play",
      description: "Questions about toys and playing",
      questions: [
        { id: 2019, text: "What toys do you have?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 2020, text: "Do you like to play outside?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 2021, text: "What games do you like?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 2022, text: "Do you like to draw?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 2023, text: "What is your favorite game?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 2024, text: "Do you like to sing songs?", section: "A. Speaking", grade: "K2", type: "speaking" }
      ]
    },
    {
      id: "k2_seasons",
      theme: "Seasons",
      description: "Questions about seasons and weather",
      questions: [
        { id: 2025, text: "What do you wear in summer?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 2026, text: "What do you do in winter?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 2027, text: "Do you like hot weather or cold weather?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 2028, text: "What is your favorite season?", section: "C. Personal", grade: "K2", type: "personal" },
        { id: 2029, text: "What do you do when it rains?", section: "A. Speaking", grade: "K2", type: "speaking" },
        { id: 2030, text: "Do you like to play in the snow?", section: "A. Speaking", grade: "K2", type: "speaking" }
      ]
    }
  ],

  // K3 Question Sets - Expanded
  "K3": [
    {
      id: "k3_family_home",
      theme: "Family and Home",
      description: "Questions about family members and home life",
      questions: [
        { id: 16, text: "Tell me about your family.", section: "C. Personal", grade: "K3", type: "personal" },
        { id: 17, text: "What do you do at home with your family?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 18, text: "Who lives in your house?", section: "C. Personal", grade: "K3", type: "personal" },
        { id: 3001, text: "What room in your house do you like best?", section: "C. Personal", grade: "K3", type: "personal" },
        { id: 3002, text: "What do you do with your grandparents?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 3003, text: "Do you help with chores at home?", section: "A. Speaking", grade: "K3", type: "speaking" }
      ]
    },
    {
      id: "k3_toys_games",
      theme: "Toys and Games",
      description: "Questions about favorite toys and games",
      questions: [
        { id: 19, text: "What is your favorite toy?", section: "C. Personal", grade: "K3", type: "personal" },
        { id: 20, text: "What games do you like to play?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 21, text: "Do you like to play with friends?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 3004, text: "Do you like playing board games?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 3005, text: "What is the best toy you have ever had?", section: "C. Personal", grade: "K3", type: "personal" },
        { id: 3006, text: "Do you like playing inside or outside?", section: "A. Speaking", grade: "K3", type: "speaking" }
      ]
    },
    {
      id: "k3_reading",
      theme: "Reading Practice",
      description: "Simple reading exercises",
      questions: [
        { id: 22, text: "Read this sentence: The sun is bright today.", section: "B. Reading", grade: "K3", type: "reading" },
        { id: 23, text: "Describe what you see in this picture.", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 3007, text: "Read this sentence: I like to play with my friends.", section: "B. Reading", grade: "K3", type: "reading" },
        { id: 3008, text: "Read this sentence: My dog is very cute.", section: "B. Reading", grade: "K3", type: "reading" }
      ]
    },
    {
      id: "k3_food_meals",
      theme: "Food and Meals",
      description: "Questions about food and eating habits",
      questions: [
        { id: 3009, text: "What did you eat for lunch today?", section: "C. Personal", grade: "K3", type: "personal" },
        { id: 3010, text: "What is your favorite snack?", section: "C. Personal", grade: "K3", type: "personal" },
        { id: 3011, text: "Do you like vegetables?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 3012, text: "What do you like to drink?", section: "C. Personal", grade: "K3", type: "personal" },
        { id: 3013, text: "Who cooks dinner at your home?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 3014, text: "Do you help set the table?", section: "A. Speaking", grade: "K3", type: "speaking" }
      ]
    },
    {
      id: "k3_school_activities",
      theme: "School Activities",
      description: "Questions about school and learning",
      questions: [
        { id: 3015, text: "What do you like about kindergarten?", section: "C. Personal", grade: "K3", type: "personal" },
        { id: 3016, text: "What did you learn today?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 3017, text: "Do you like art class?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 3018, text: "Do you like music class?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 3019, text: "What is your favorite story?", section: "C. Personal", grade: "K3", type: "personal" },
        { id: 3020, text: "Do you like story time?", section: "A. Speaking", grade: "K3", type: "speaking" }
      ]
    },
    {
      id: "k3_holidays",
      theme: "Holidays and Celebrations",
      description: "Questions about special days",
      questions: [
        { id: 3021, text: "What is your favorite holiday?", section: "C. Personal", grade: "K3", type: "personal" },
        { id: 3022, text: "What do you do on your birthday?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 3023, text: "Do you like Christmas?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 3024, text: "What do you do during Chinese New Year?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 3025, text: "Do you get presents on your birthday?", section: "A. Speaking", grade: "K3", type: "speaking" },
        { id: 3026, text: "What is the best present you ever got?", section: "C. Personal", grade: "K3", type: "personal" }
      ]
    }
  ],

  // P1 Question Sets - Expanded
  "P1": [
    {
      id: "p1_school_life",
      theme: "School Life",
      description: "Questions about school experiences and subjects",
      questions: [
        { id: 24, text: "What is your favorite subject in school?", section: "C. Personal", grade: "P1", type: "personal" },
        { id: 25, text: "Tell me about your school day.", section: "A. Speaking", grade: "P1", type: "speaking" },
        { id: 26, text: "What do you like most about your school?", section: "C. Personal", grade: "P1", type: "personal" },
        { id: 4001, text: "What time does your school start?", section: "A. Speaking", grade: "P1", type: "speaking" },
        { id: 4002, text: "How do you get to school?", section: "A. Speaking", grade: "P1", type: "speaking" },
        { id: 4003, text: "What do you do during recess?", section: "A. Speaking", grade: "P1", type: "speaking" }
      ]
    },
    {
      id: "p1_friends_social",
      theme: "Friends and Social Life",
      description: "Questions about friendships and social interactions",
      questions: [
        { id: 27, text: "Tell me about your best friend.", section: "A. Speaking", grade: "P1", type: "speaking" },
        { id: 28, text: "What do you like to do with your friends?", section: "A. Speaking", grade: "P1", type: "speaking" },
        { id: 29, text: "How do you make new friends?", section: "A. Speaking", grade: "P1", type: "speaking" },
        { id: 4004, text: "What games do you play with your friends?", section: "A. Speaking", grade: "P1", type: "speaking" },
        { id: 4005, text: "Do you have any classmates who are your neighbors?", section: "C. Personal", grade: "P1", type: "personal" },
        { id: 4006, text: "What makes a good friend?", section: "A. Speaking", grade: "P1", type: "speaking" }
      ]
    },
    {
      id: "p1_future_dreams",
      theme: "Future and Dreams",
      description: "Questions about aspirations and future plans",
      questions: [
        { id: 30, text: "What do you want to be when you grow up?", section: "C. Personal", grade: "P1", type: "personal" },
        { id: 31, text: "Describe your daily routine.", section: "A. Speaking", grade: "P1", type: "speaking" },
        { id: 32, text: "Read this passage about animals.", section: "B. Reading", grade: "P1", type: "reading" },
        { id: 4007, text: "What is your dream job?", section: "C. Personal", grade: "P1", type: "personal" },
        { id: 4008, text: "Why do you want that job?", section: "A. Speaking", grade: "P1", type: "speaking" },
        { id: 4009, text: "What do you want to learn more about?", section: "C. Personal", grade: "P1", type: "personal" }
      ]
    },
    {
      id: "p1_hobbies",
      theme: "Hobbies and Interests",
      description: "Questions about hobbies and free time",
      questions: [
        { id: 4010, text: "What do you like to do on weekends?", section: "C. Personal", grade: "P1", type: "personal" },
        { id: 4011, text: "Do you like to read books?", section: "A. Speaking", grade: "P1", type: "speaking" },
        { id: 4012, text: "What is your favorite book?", section: "C. Personal", grade: "P1", type: "personal" },
        { id: 4013, text: "Do you like to draw pictures?", section: "A. Speaking", grade: "P1", type: "speaking" },
        { id: 4014, text: "What do you like to watch on TV?", section: "C. Personal", grade: "P1", type: "personal" },
        { id: 4015, text: "Do you play any sports?", section: "A. Speaking", grade: "P1", type: "speaking" }
      ]
    },
    {
      id: "p1_family_routines",
      theme: "Family Routines",
      description: "Questions about family life and daily routines",
      questions: [
        { id: 4016, text: "What do you do with your family on weekends?", section: "A. Speaking", grade: "P1", type: "speaking" },
        { id: 4017, text: "Who helps you with homework?", section: "C. Personal", grade: "P1", type: "personal" },
        { id: 4018, text: "What time do you wake up in the morning?", section: "A. Speaking", grade: "P1", type: "speaking" },
        { id: 4019, text: "What do you eat for breakfast?", section: "C. Personal", grade: "P1", type: "personal" },
        { id: 4020, text: "Do you have any pets at home?", section: "C. Personal", grade: "P1", type: "personal" },
        { id: 4021, text: "What chores do you do at home?", section: "A. Speaking", grade: "P1", type: "speaking" }
      ]
    },
    {
      id: "p1_reading_practice",
      theme: "Reading Practice",
      description: "Simple reading exercises for P1",
      questions: [
        { id: 4022, text: "Read this sentence: I go to school every day.", section: "B. Reading", grade: "P1", type: "reading" },
        { id: 4023, text: "Read this sentence: My family is very kind.", section: "B. Reading", grade: "P1", type: "reading" },
        { id: 4024, text: "Read this sentence: I like to play in the park.", section: "B. Reading", grade: "P1", type: "reading" },
        { id: 4025, text: "Read this sentence: The cat sleeps on the sofa.", section: "B. Reading", grade: "P1", type: "reading" }
      ]
    }
  ],

  // P2 Question Sets - Expanded
  "P2": [
    {
      id: "p2_food_preferences",
      theme: "Food and Preferences",
      description: "Questions about food, likes and dislikes",
      questions: [
        { id: 33, text: "What is your favorite food and why?", section: "C. Personal", grade: "P2", type: "personal" },
        { id: 34, text: "What food do you not like?", section: "C. Personal", grade: "P2", type: "personal" },
        { id: 35, text: "Tell me about a special meal you remember.", section: "A. Speaking", grade: "P2", type: "speaking" },
        { id: 5001, text: "Do you like Chinese food or Western food better?", section: "C. Personal", grade: "P2", type: "personal" },
        { id: 5002, text: "What is your favorite dessert?", section: "C. Personal", grade: "P2", type: "personal" },
        { id: 5003, text: "Can you cook anything?", section: "A. Speaking", grade: "P2", type: "speaking" }
      ]
    },
    {
      id: "p2_activities_sports",
      theme: "Activities and Sports",
      description: "Questions about physical activities and sports",
      questions: [
        { id: 36, text: "What sports do you like to play?", section: "C. Personal", grade: "P2", type: "personal" },
        { id: 37, text: "Tell me about your favorite activity.", section: "A. Speaking", grade: "P2", type: "speaking" },
        { id: 38, text: "Do you prefer indoor or outdoor activities?", section: "A. Speaking", grade: "P2", type: "speaking" },
        { id: 5004, text: "Do you like swimming?", section: "A. Speaking", grade: "P2", type: "speaking" },
        { id: 5005, text: "Have you ever won a prize in sports?", section: "C. Personal", grade: "P2", type: "personal" },
        { id: 5006, text: "What sport do you want to try?", section: "C. Personal", grade: "P2", type: "personal" }
      ]
    },
    {
      id: "p2_places_memories",
      theme: "Places and Memories",
      description: "Questions about special places and memories",
      questions: [
        { id: 39, text: "Tell me about a special day you remember.", section: "A. Speaking", grade: "P2", type: "speaking" },
        { id: 40, text: "Describe your favorite place to visit.", section: "A. Speaking", grade: "P2", type: "speaking" },
        { id: 41, text: "Read this story about friendship.", section: "B. Reading", grade: "P2", type: "reading" },
        { id: 5007, text: "Have you been to Ocean Park?", section: "C. Personal", grade: "P2", type: "personal" },
        { id: 5008, text: "Where do you like to go on holidays?", section: "C. Personal", grade: "P2", type: "personal" },
        { id: 5009, text: "What is the best trip you have ever taken?", section: "C. Personal", grade: "P2", type: "personal" }
      ]
    },
    {
      id: "p2_school_subjects",
      theme: "School Subjects",
      description: "Questions about school subjects and learning",
      questions: [
        { id: 5010, text: "What subject are you best at?", section: "C. Personal", grade: "P2", type: "personal" },
        { id: 5011, text: "What subject do you find difficult?", section: "C. Personal", grade: "P2", type: "personal" },
        { id: 5012, text: "Do you like English class?", section: "A. Speaking", grade: "P2", type: "speaking" },
        { id: 5013, text: "What do you like about Math class?", section: "A. Speaking", grade: "P2", type: "speaking" },
        { id: 5014, text: "Do you have any after-school activities?", section: "C. Personal", grade: "P2", type: "personal" },
        { id: 5015, text: "What club would you like to join?", section: "C. Personal", grade: "P2", type: "personal" }
      ]
    },
    {
      id: "p2_animals_pets",
      theme: "Animals and Pets",
      description: "Questions about animals and pets",
      questions: [
        { id: 5016, text: "Do you have a pet? Tell me about it.", section: "C. Personal", grade: "P2", type: "personal" },
        { id: 5017, text: "What pet would you like to have?", section: "C. Personal", grade: "P2", type: "personal" },
        { id: 5018, text: "Have you ever been to the zoo?", section: "A. Speaking", grade: "P2", type: "speaking" },
        { id: 5019, text: "What is the most interesting animal you have seen?", section: "A. Speaking", grade: "P2", type: "speaking" },
        { id: 5020, text: "Why do you think pets are important?", section: "A. Speaking", grade: "P2", type: "speaking" },
        { id: 5021, text: "How do you take care of a pet?", section: "A. Speaking", grade: "P2", type: "speaking" }
      ]
    },
    {
      id: "p2_reading_practice",
      theme: "Reading Practice",
      description: "Reading exercises for P2",
      questions: [
        { id: 5022, text: "Read this sentence: My friend and I like to play together.", section: "B. Reading", grade: "P2", type: "reading" },
        { id: 5023, text: "Read this sentence: We went to the beach last summer.", section: "B. Reading", grade: "P2", type: "reading" },
        { id: 5024, text: "Read this sentence: The flowers in the garden are beautiful.", section: "B. Reading", grade: "P2", type: "reading" },
        { id: 5025, text: "Read this sentence: I help my mother cook dinner.", section: "B. Reading", grade: "P2", type: "reading" }
      ]
    }
  ],

  // P3 Question Sets - Completely redesigned based on provided sample
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

        // B. Reading Aloud
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

  // P5 Question Sets - Expanded
  "P5": [
    {
      id: "p5_education_opinions",
      theme: "Education and Learning Opinions",
      description: "Questions about educational topics and personal opinions",
      questions: [
        { id: 60, text: "Do you think homework is necessary? Why?", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 61, text: "What subject would you like to learn more about?", section: "C. Personal", grade: "P5", type: "personal" },
        { id: 62, text: "How has your learning style changed over the years?", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 6001, text: "What makes a good teacher?", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 6002, text: "Do you prefer studying alone or in groups?", section: "C. Personal", grade: "P5", type: "personal" },
        { id: 6003, text: "How do you prepare for exams?", section: "A. Speaking", grade: "P5", type: "speaking" }
      ]
    },
    {
      id: "p5_travel_experiences",
      theme: "Travel and Experiences",
      description: "Questions about travel, vacations and life experiences",
      questions: [
        { id: 63, text: "Describe your ideal vacation.", section: "C. Personal", grade: "P5", type: "personal" },
        { id: 64, text: "Tell me about an interesting place you have visited.", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 65, text: "Would you prefer to travel alone or with family?", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 6004, text: "What country would you like to visit? Why?", section: "C. Personal", grade: "P5", type: "personal" },
        { id: 6005, text: "What is the most memorable trip you have taken?", section: "C. Personal", grade: "P5", type: "personal" },
        { id: 6006, text: "Do you prefer beach holidays or city holidays?", section: "A. Speaking", grade: "P5", type: "speaking" }
      ]
    },
    {
      id: "p5_life_changes",
      theme: "Life Changes and Adaptation",
      description: "Questions about adapting to changes and challenges",
      questions: [
        { id: 66, text: "How has technology affected your school life?", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 67, text: "What positive changes have you made recently?", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 68, text: "Read this story about perseverance.", section: "B. Reading", grade: "P5", type: "reading" },
        { id: 6007, text: "How do you handle challenges?", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 6008, text: "Tell me about a time you had to adapt to something new.", section: "C. Personal", grade: "P5", type: "personal" },
        { id: 6009, text: "What is the biggest change you have experienced?", section: "C. Personal", grade: "P5", type: "personal" }
      ]
    },
    {
      id: "p5_hobbies_interests",
      theme: "Hobbies and Interests",
      description: "Questions about hobbies and personal interests",
      questions: [
        { id: 6010, text: "What are your hobbies?", section: "C. Personal", grade: "P5", type: "personal" },
        { id: 6011, text: "How did you develop your interests?", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 6012, text: "Do you have any unusual hobbies?", section: "C. Personal", grade: "P5", type: "personal" },
        { id: 6013, text: "What hobby would you like to try?", section: "C. Personal", grade: "P5", type: "personal" },
        { id: 6014, text: "How do you spend your free time?", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 6015, text: "Do you collect anything? Tell me about it.", section: "C. Personal", grade: "P5", type: "personal" }
      ]
    },
    {
      id: "p5_reading_current_events",
      theme: "Reading and Current Events",
      description: "Reading practice and discussion of current events",
      questions: [
        { id: 6016, text: "Read this passage about environmental protection.", section: "B. Reading", grade: "P5", type: "reading", readingPassage: "Protecting Our Environment\n\nOur planet is facing many environmental challenges. Pollution, deforestation, and climate change are serious problems that affect everyone. However, there are many things we can do to help. We can reduce waste by using reusable bags and bottles. We can save energy by turning off lights when we leave a room. Planting trees and protecting wildlife are also important. Every small action counts. If everyone does their part, we can make a big difference for our planet and future generations." },
        { id: 6017, text: "What do you know about recycling?", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 6018, text: "What news topics interest you?", section: "C. Personal", grade: "P5", type: "personal" },
        { id: 6019, text: "Why is it important to stay informed about current events?", section: "A. Speaking", grade: "P5", type: "speaking" }
      ]
    },
    {
      id: "p5_family_relationships",
      theme: "Family and Relationships",
      description: "Questions about family dynamics and relationships",
      questions: [
        { id: 6020, text: "Describe a family member you admire.", section: "C. Personal", grade: "P5", type: "personal" },
        { id: 6021, text: "What do you like to do with your family?", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 6022, text: "How do you help at home?", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 6023, text: "What family traditions do you have?", section: "C. Personal", grade: "P5", type: "personal" },
        { id: 6024, text: "What makes a happy family?", section: "A. Speaking", grade: "P5", type: "speaking" },
        { id: 6025, text: "How do you solve disagreements with family members?", section: "A. Speaking", grade: "P5", type: "speaking" }
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
