// Discussion Topics for AI Group Discussion - Comprehensive Topic Bank
// Organized by grade level with age-appropriate content and complexity

export interface DiscussionTopic {
  id: string;
  text: string;
  category: string;
}

export const primaryDiscussionTopics: Record<string, DiscussionTopic[]> = {
  'P4': [
    // Food & Eating (10 topics)
    { id: 'p4_food_1', text: 'What is your favourite food? Why do you like it?', category: 'Food' },
    { id: 'p4_food_2', text: 'Do you prefer eating at home or at a restaurant? Why?', category: 'Food' },
    { id: 'p4_food_3', text: 'What food do you want to try? Why?', category: 'Food' },
    { id: 'p4_food_4', text: 'Do you like sweet food or salty food more? Why?', category: 'Food' },
    { id: 'p4_food_5', text: 'What is the yummiest thing you have ever eaten?', category: 'Food' },
    { id: 'p4_food_6', text: 'Do you like fruits or vegetables more? Why?', category: 'Food' },
    { id: 'p4_food_7', text: 'What do you like to eat for breakfast?', category: 'Food' },
    { id: 'p4_food_8', text: 'Should children eat less candy? Why or why not?', category: 'Food' },
    { id: 'p4_food_9', text: 'What is your favourite drink? Why?', category: 'Food' },
    { id: 'p4_food_10', text: 'Do you like to help cook at home? Why or why not?', category: 'Food' },
    
    // Activities & Hobbies (10 topics)
    { id: 'p4_hobby_1', text: 'What do you like to do after school?', category: 'Hobbies' },
    { id: 'p4_hobby_2', text: 'Do you like going to the park? What do you do there?', category: 'Hobbies' },
    { id: 'p4_hobby_3', text: 'What is your favourite game to play?', category: 'Hobbies' },
    { id: 'p4_hobby_4', text: 'Do you like drawing or colouring? Why?', category: 'Hobbies' },
    { id: 'p4_hobby_5', text: 'What do you like to do on weekends?', category: 'Hobbies' },
    { id: 'p4_hobby_6', text: 'Do you like playing outside or inside? Why?', category: 'Hobbies' },
    { id: 'p4_hobby_7', text: 'What is your favourite sport? Why do you like it?', category: 'Hobbies' },
    { id: 'p4_hobby_8', text: 'Do you like watching cartoons? Which one is your favourite?', category: 'Hobbies' },
    { id: 'p4_hobby_9', text: 'What do you like to do with your family?', category: 'Hobbies' },
    { id: 'p4_hobby_10', text: 'Do you like reading books or playing games more?', category: 'Hobbies' },
    
    // Animals & Pets (8 topics)
    { id: 'p4_animal_1', text: 'What pet would you like to have? Why?', category: 'Animals' },
    { id: 'p4_animal_2', text: 'What is your favourite animal? Why?', category: 'Animals' },
    { id: 'p4_animal_3', text: 'Do you like cats or dogs more? Why?', category: 'Animals' },
    { id: 'p4_animal_4', text: 'Have you been to the zoo? What animals did you see?', category: 'Animals' },
    { id: 'p4_animal_5', text: 'If you could be any animal, what would you be? Why?', category: 'Animals' },
    { id: 'p4_animal_6', text: 'Do you think keeping pets is fun? Why or why not?', category: 'Animals' },
    { id: 'p4_animal_7', text: 'What animal do you think is the cutest?', category: 'Animals' },
    { id: 'p4_animal_8', text: 'Would you like to have a fish as a pet? Why or why not?', category: 'Animals' },
    
    // Weather & Nature (7 topics)
    { id: 'p4_weather_1', text: 'Do you like rainy days or sunny days? Why?', category: 'Weather' },
    { id: 'p4_weather_2', text: 'What do you like to do when it is hot?', category: 'Weather' },
    { id: 'p4_weather_3', text: 'What is your favourite season? Why?', category: 'Weather' },
    { id: 'p4_weather_4', text: 'Do you like going to the beach? What do you do there?', category: 'Weather' },
    { id: 'p4_weather_5', text: 'What do you do when it rains?', category: 'Weather' },
    { id: 'p4_weather_6', text: 'Do you like looking at flowers and trees? Why?', category: 'Weather' },
    { id: 'p4_weather_7', text: 'What do you like about summer?', category: 'Weather' },
    
    // School (8 topics)
    { id: 'p4_school_1', text: 'What is your favourite class at school? Why?', category: 'School' },
    { id: 'p4_school_2', text: 'Do you like recess time? What do you do?', category: 'School' },
    { id: 'p4_school_3', text: 'What do you like about your school?', category: 'School' },
    { id: 'p4_school_4', text: 'Do you like doing homework? Why or why not?', category: 'School' },
    { id: 'p4_school_5', text: 'What makes a good teacher?', category: 'School' },
    { id: 'p4_school_6', text: 'Do you like music class or art class more?', category: 'School' },
    { id: 'p4_school_7', text: 'What is the most fun thing at school?', category: 'School' },
    { id: 'p4_school_8', text: 'Do you like PE class? Why or why not?', category: 'School' },
    
    // Friends & Family (7 topics)
    { id: 'p4_friends_1', text: 'What do you like to do with your friends?', category: 'Friends' },
    { id: 'p4_friends_2', text: 'What makes someone a good friend?', category: 'Friends' },
    { id: 'p4_friends_3', text: 'Do you like playing with many friends or one friend? Why?', category: 'Friends' },
    { id: 'p4_friends_4', text: 'What do you like to do with your grandparents?', category: 'Family' },
    { id: 'p4_friends_5', text: 'Do you have brothers or sisters? What do you do together?', category: 'Family' },
    { id: 'p4_friends_6', text: 'What is the best thing about your family?', category: 'Family' },
    { id: 'p4_friends_7', text: 'Where does your family like to go on weekends?', category: 'Family' }
  ],

  'P5': [
    // School & Learning (12 topics)
    { id: 'p5_school_1', text: 'What is your favourite subject at school? Why?', category: 'School' },
    { id: 'p5_school_2', text: 'Do you think homework is important? Why or why not?', category: 'School' },
    { id: 'p5_school_3', text: 'Should students have more art and music classes?', category: 'School' },
    { id: 'p5_school_4', text: 'What makes a lesson interesting?', category: 'School' },
    { id: 'p5_school_5', text: 'Do you like group work or working alone? Why?', category: 'School' },
    { id: 'p5_school_6', text: 'Should schools have longer recess time?', category: 'School' },
    { id: 'p5_school_7', text: 'What is the hardest thing about school?', category: 'School' },
    { id: 'p5_school_8', text: 'Do you think tests are fair? Why or why not?', category: 'School' },
    { id: 'p5_school_9', text: 'What would make school more fun?', category: 'School' },
    { id: 'p5_school_10', text: 'Should students wear school uniforms? Why or why not?', category: 'School' },
    { id: 'p5_school_11', text: 'Is it better to learn from books or from computers?', category: 'School' },
    { id: 'p5_school_12', text: 'What is the best way to study for a test?', category: 'School' },
    
    // Friends & Social (10 topics)
    { id: 'p5_friend_1', text: 'Do you like playing with friends or playing alone? Why?', category: 'Friends' },
    { id: 'p5_friend_2', text: 'What makes a good friend?', category: 'Friends' },
    { id: 'p5_friend_3', text: 'How do you make new friends?', category: 'Friends' },
    { id: 'p5_friend_4', text: 'What should you do if your friend is sad?', category: 'Friends' },
    { id: 'p5_friend_5', text: 'Is it okay to have just one best friend? Why or why not?', category: 'Friends' },
    { id: 'p5_friend_6', text: 'What do you do when you and your friend disagree?', category: 'Friends' },
    { id: 'p5_friend_7', text: 'Should friends always share everything?', category: 'Friends' },
    { id: 'p5_friend_8', text: 'Is it easier to make friends online or in person?', category: 'Friends' },
    { id: 'p5_friend_9', text: 'What is the nicest thing a friend has done for you?', category: 'Friends' },
    { id: 'p5_friend_10', text: 'Should you invite everyone in your class to your birthday party?', category: 'Friends' },
    
    // Home & Family (8 topics)
    { id: 'p5_home_1', text: 'Should children help with housework? Why or why not?', category: 'Home' },
    { id: 'p5_home_2', text: 'What is your favourite thing to do at home?', category: 'Home' },
    { id: 'p5_home_3', text: 'Do you think children should have a bedtime? Why?', category: 'Home' },
    { id: 'p5_home_4', text: 'What chores do you do at home?', category: 'Home' },
    { id: 'p5_home_5', text: 'Is it important to eat dinner together as a family?', category: 'Home' },
    { id: 'p5_home_6', text: 'Should parents give children pocket money? Why or why not?', category: 'Home' },
    { id: 'p5_home_7', text: 'What is the best thing about weekends?', category: 'Home' },
    { id: 'p5_home_8', text: 'Do you like staying at home or going out? Why?', category: 'Home' },
    
    // Media & Entertainment (8 topics)
    { id: 'p5_media_1', text: 'Do you like reading books or watching TV? Why?', category: 'Media' },
    { id: 'p5_media_2', text: 'What is your favourite TV show? Why do you like it?', category: 'Media' },
    { id: 'p5_media_3', text: 'Should children watch less TV? Why or why not?', category: 'Media' },
    { id: 'p5_media_4', text: 'Do you like playing video games? Why or why not?', category: 'Media' },
    { id: 'p5_media_5', text: 'What is your favourite book? Why?', category: 'Media' },
    { id: 'p5_media_6', text: 'Is it better to watch movies at home or in the cinema?', category: 'Media' },
    { id: 'p5_media_7', text: 'Should children use tablets for learning?', category: 'Media' },
    { id: 'p5_media_8', text: 'What kind of stories do you like best?', category: 'Media' },
    
    // Health & Sports (8 topics)
    { id: 'p5_health_1', text: 'Do you think playing sports is important? Why?', category: 'Health' },
    { id: 'p5_health_2', text: 'What is your favourite sport to play?', category: 'Health' },
    { id: 'p5_health_3', text: 'Should children eat more vegetables?', category: 'Health' },
    { id: 'p5_health_4', text: 'How much sleep do children need?', category: 'Health' },
    { id: 'p5_health_5', text: 'Is it important to drink water? Why?', category: 'Health' },
    { id: 'p5_health_6', text: 'Do you like swimming? Why or why not?', category: 'Health' },
    { id: 'p5_health_7', text: 'What exercise do you like doing?', category: 'Health' },
    { id: 'p5_health_8', text: 'Should schools have more PE time?', category: 'Health' },
    
    // Environment & Animals (6 topics)
    { id: 'p5_env_1', text: 'Should we recycle more? Why?', category: 'Environment' },
    { id: 'p5_env_2', text: 'Why is it important to save water?', category: 'Environment' },
    { id: 'p5_env_3', text: 'Should people use fewer plastic bags?', category: 'Environment' },
    { id: 'p5_env_4', text: 'Is it important to protect animals? Why?', category: 'Environment' },
    { id: 'p5_env_5', text: 'What can children do to help the Earth?', category: 'Environment' },
    { id: 'p5_env_6', text: 'Why should we plant more trees?', category: 'Environment' }
  ],

  'P6': [
    // School & Education (12 topics)
    { id: 'p6_school_1', text: 'Should students have less homework? Why or why not?', category: 'School' },
    { id: 'p6_school_2', text: 'Is learning English important? Why?', category: 'School' },
    { id: 'p6_school_3', text: 'Should schools teach more practical skills like cooking?', category: 'School' },
    { id: 'p6_school_4', text: 'Are exams the best way to test students? Why or why not?', category: 'School' },
    { id: 'p6_school_5', text: 'Should students be allowed to use calculators in maths class?', category: 'School' },
    { id: 'p6_school_6', text: 'Is it better to study in the morning or at night?', category: 'School' },
    { id: 'p6_school_7', text: 'Should all schools have a library?', category: 'School' },
    { id: 'p6_school_8', text: 'Do students learn better in big or small classes?', category: 'School' },
    { id: 'p6_school_9', text: 'Should students choose their own classes?', category: 'School' },
    { id: 'p6_school_10', text: 'Is it important to learn about history? Why?', category: 'School' },
    { id: 'p6_school_11', text: 'Should schools have longer summer holidays?', category: 'School' },
    { id: 'p6_school_12', text: 'What makes someone a good student?', category: 'School' },
    
    // Technology (10 topics)
    { id: 'p6_tech_1', text: 'Is it good to have a mobile phone? Why?', category: 'Technology' },
    { id: 'p6_tech_2', text: 'Should children have their own tablet or computer?', category: 'Technology' },
    { id: 'p6_tech_3', text: 'Are video games good or bad for children?', category: 'Technology' },
    { id: 'p6_tech_4', text: 'Should students use computers for homework?', category: 'Technology' },
    { id: 'p6_tech_5', text: 'Is the internet good for learning?', category: 'Technology' },
    { id: 'p6_tech_6', text: 'Should there be rules about how long children can use phones?', category: 'Technology' },
    { id: 'p6_tech_7', text: 'Is watching YouTube educational?', category: 'Technology' },
    { id: 'p6_tech_8', text: 'Should robots help us at home?', category: 'Technology' },
    { id: 'p6_tech_9', text: 'Is it safer to read news online or in newspapers?', category: 'Technology' },
    { id: 'p6_tech_10', text: 'Should schools allow students to bring phones?', category: 'Technology' },
    
    // Health & Lifestyle (10 topics)
    { id: 'p6_health_1', text: 'Should children eat more vegetables? Why?', category: 'Health' },
    { id: 'p6_health_2', text: 'Do you think playing sports is important? Why?', category: 'Health' },
    { id: 'p6_health_3', text: 'Is fast food bad for you? Why or why not?', category: 'Health' },
    { id: 'p6_health_4', text: 'Should children have a set bedtime?', category: 'Health' },
    { id: 'p6_health_5', text: 'How can children stay healthy?', category: 'Health' },
    { id: 'p6_health_6', text: 'Should schools sell only healthy snacks?', category: 'Health' },
    { id: 'p6_health_7', text: 'Is it important to exercise every day?', category: 'Health' },
    { id: 'p6_health_8', text: 'Why is breakfast the most important meal?', category: 'Health' },
    { id: 'p6_health_9', text: 'Should soft drinks be allowed in schools?', category: 'Health' },
    { id: 'p6_health_10', text: 'Is too much screen time bad for your eyes?', category: 'Health' },
    
    // Future & Aspirations (8 topics)
    { id: 'p6_future_1', text: 'What do you want to be when you grow up? Why?', category: 'Future' },
    { id: 'p6_future_2', text: 'Is going to university important? Why or why not?', category: 'Future' },
    { id: 'p6_future_3', text: 'What skills are important for the future?', category: 'Future' },
    { id: 'p6_future_4', text: 'Would you like to work in Hong Kong or another country?', category: 'Future' },
    { id: 'p6_future_5', text: 'What makes someone successful?', category: 'Future' },
    { id: 'p6_future_6', text: 'Is it better to work in an office or at home?', category: 'Future' },
    { id: 'p6_future_7', text: 'What job do you think is the most important?', category: 'Future' },
    { id: 'p6_future_8', text: 'Do you need to be good at English to get a good job?', category: 'Future' },
    
    // Environment & Society (10 topics)
    { id: 'p6_env_1', text: 'Should people use fewer plastic bags? Why?', category: 'Environment' },
    { id: 'p6_env_2', text: 'Is recycling important? Why?', category: 'Environment' },
    { id: 'p6_env_3', text: 'Should Hong Kong have more parks?', category: 'Environment' },
    { id: 'p6_env_4', text: 'Is air pollution a big problem? What can we do?', category: 'Environment' },
    { id: 'p6_env_5', text: 'Should we protect endangered animals? How?', category: 'Environment' },
    { id: 'p6_env_6', text: 'Is it better to take the MTR or drive a car? Why?', category: 'Environment' },
    { id: 'p6_env_7', text: 'Should people eat less meat to help the environment?', category: 'Environment' },
    { id: 'p6_env_8', text: 'Is Hong Kong a clean city? Why or why not?', category: 'Environment' },
    { id: 'p6_env_9', text: 'Should all buildings have gardens on the roof?', category: 'Environment' },
    { id: 'p6_env_10', text: 'What can families do to save energy?', category: 'Environment' }
  ]
};

export const secondaryDiscussionTopics: Record<string, DiscussionTopic[]> = {
  'S1': [
    // School Life (10 topics)
    { id: 's1_school_1', text: 'Social media has both positive and negative effects on teenagers. Discuss how young people can use social media responsibly while avoiding its potential harms.', category: 'Technology' },
    { id: 's1_school_2', text: 'Some people believe that students should focus only on academic subjects, while others think arts and sports are equally important. What is your view?', category: 'Education' },
    { id: 's1_school_3', text: 'With the increasing use of smartphones, some worry that young people are losing important social skills. Do you agree with this concern?', category: 'Technology' },
    { id: 's1_school_4', text: 'Should schools start later in the morning to let students get more sleep? Discuss the pros and cons.', category: 'Education' },
    { id: 's1_school_5', text: 'Is it fair for teachers to give homework during holidays? Share your thoughts.', category: 'Education' },
    { id: 's1_school_6', text: 'Should students be allowed to choose which subjects they want to study?', category: 'Education' },
    { id: 's1_school_7', text: 'How can schools better support students who are struggling with their studies?', category: 'Education' },
    { id: 's1_school_8', text: 'Is it better to learn online or in a classroom? Discuss the advantages and disadvantages.', category: 'Education' },
    { id: 's1_school_9', text: 'Should schools have stricter rules about bullying? What should the consequences be?', category: 'Social' },
    { id: 's1_school_10', text: 'Are extracurricular activities important for students? Why or why not?', category: 'Education' },
    
    // Social & Relationships (10 topics)
    { id: 's1_social_1', text: 'Is peer pressure always negative, or can it sometimes be positive?', category: 'Social' },
    { id: 's1_social_2', text: 'What qualities make someone a good leader?', category: 'Social' },
    { id: 's1_social_3', text: 'Should teenagers have part-time jobs? Discuss the benefits and drawbacks.', category: 'Social' },
    { id: 's1_social_4', text: 'How can students balance schoolwork with spending time with friends and family?', category: 'Social' },
    { id: 's1_social_5', text: 'Is it important to follow fashion trends? Why or why not?', category: 'Social' },
    { id: 's1_social_6', text: 'Should parents monitor their children\'s internet use? Discuss.', category: 'Technology' },
    { id: 's1_social_7', text: 'How has technology changed the way young people make friends?', category: 'Technology' },
    { id: 's1_social_8', text: 'Is it better to have many friends or a few close friends?', category: 'Social' },
    { id: 's1_social_9', text: 'What should you do if you see someone being bullied online?', category: 'Social' },
    { id: 's1_social_10', text: 'Should teenagers be allowed to have social media accounts? At what age?', category: 'Technology' },
    
    // Health & Lifestyle (8 topics)
    { id: 's1_health_1', text: 'How can young people develop healthy eating habits?', category: 'Health' },
    { id: 's1_health_2', text: 'Is it important for teenagers to exercise regularly? Why?', category: 'Health' },
    { id: 's1_health_3', text: 'How much sleep do teenagers need? Is getting enough sleep difficult?', category: 'Health' },
    { id: 's1_health_4', text: 'Should schools do more to teach students about mental health?', category: 'Health' },
    { id: 's1_health_5', text: 'Is competitive sports good or bad for young people\'s development?', category: 'Health' },
    { id: 's1_health_6', text: 'What are the dangers of spending too much time on screens?', category: 'Health' },
    { id: 's1_health_7', text: 'Should energy drinks be banned for teenagers? Why or why not?', category: 'Health' },
    { id: 's1_health_8', text: 'How can students deal with exam stress in healthy ways?', category: 'Health' },
    
    // Environment (7 topics)
    { id: 's1_env_1', text: 'What can teenagers do to help protect the environment?', category: 'Environment' },
    { id: 's1_env_2', text: 'Should Hong Kong ban single-use plastics? Discuss.', category: 'Environment' },
    { id: 's1_env_3', text: 'Is climate change something young people should worry about? Why?', category: 'Environment' },
    { id: 's1_env_4', text: 'Should schools teach more about environmental issues?', category: 'Environment' },
    { id: 's1_env_5', text: 'Is it important to save water and electricity at home? How can families do this?', category: 'Environment' },
    { id: 's1_env_6', text: 'Should people use public transport instead of private cars? Why?', category: 'Environment' },
    { id: 's1_env_7', text: 'What would happen if we didn\'t recycle? Discuss the consequences.', category: 'Environment' }
  ],

  'S2': [
    // Education & School (12 topics)
    { id: 's2_edu_1', text: 'The government is considering extending school hours to improve student performance. Discuss whether you think this would be beneficial for students.', category: 'Education' },
    { id: 's2_edu_2', text: 'Some educators believe that competitive sports in schools teach valuable life skills, while others argue they put too much pressure on students. What are your thoughts?', category: 'Education' },
    { id: 's2_edu_3', text: 'Should coding and computer science be compulsory subjects in all schools?', category: 'Education' },
    { id: 's2_edu_4', text: 'Is homework necessary, or should learning only happen during school hours?', category: 'Education' },
    { id: 's2_edu_5', text: 'Should students be ranked by their exam results? Discuss the pros and cons.', category: 'Education' },
    { id: 's2_edu_6', text: 'How can teachers make lessons more engaging and interesting?', category: 'Education' },
    { id: 's2_edu_7', text: 'Should schools focus more on preparing students for jobs or developing them as individuals?', category: 'Education' },
    { id: 's2_edu_8', text: 'Is it fair that some students have private tutors while others do not?', category: 'Education' },
    { id: 's2_edu_9', text: 'Should students be able to retake exams if they fail?', category: 'Education' },
    { id: 's2_edu_10', text: 'How important is learning a second language?', category: 'Education' },
    { id: 's2_edu_11', text: 'Should schools teach financial literacy to students?', category: 'Education' },
    { id: 's2_edu_12', text: 'Are traditional textbooks still useful, or should everything be digital?', category: 'Education' },
    
    // Technology & Society (10 topics)
    { id: 's2_tech_1', text: 'Are smartphones making young people less able to concentrate? Discuss.', category: 'Technology' },
    { id: 's2_tech_2', text: 'Should there be age restrictions on certain video games? Why or why not?', category: 'Technology' },
    { id: 's2_tech_3', text: 'How has online shopping changed the way we buy things? Is this good or bad?', category: 'Technology' },
    { id: 's2_tech_4', text: 'Should schools ban mobile phones completely during school hours?', category: 'Technology' },
    { id: 's2_tech_5', text: 'Is artificial intelligence a threat or an opportunity for young people?', category: 'Technology' },
    { id: 's2_tech_6', text: 'How can we protect our privacy online?', category: 'Technology' },
    { id: 's2_tech_7', text: 'Are social media influencers good role models for teenagers?', category: 'Technology' },
    { id: 's2_tech_8', text: 'Should parents limit their children\'s screen time? How much is too much?', category: 'Technology' },
    { id: 's2_tech_9', text: 'Is it possible to be addicted to the internet? What are the signs?', category: 'Technology' },
    { id: 's2_tech_10', text: 'Will robots eventually replace human workers? Should we be worried?', category: 'Technology' },
    
    // Health & Wellbeing (10 topics)
    { id: 's2_health_1', text: 'Fast food restaurants are popular among teenagers. Should schools do more to promote healthy eating habits?', category: 'Health' },
    { id: 's2_health_2', text: 'What causes stress among secondary school students, and how can it be reduced?', category: 'Health' },
    { id: 's2_health_3', text: 'Should PE lessons focus more on fitness or team sports?', category: 'Health' },
    { id: 's2_health_4', text: 'Is it important for teenagers to have hobbies outside of studying? Why?', category: 'Health' },
    { id: 's2_health_5', text: 'How can young people improve their mental health?', category: 'Health' },
    { id: 's2_health_6', text: 'Should sugary drinks be banned in school canteens?', category: 'Health' },
    { id: 's2_health_7', text: 'Is there too much pressure on young people to look a certain way?', category: 'Health' },
    { id: 's2_health_8', text: 'What are the benefits of meditation and mindfulness for students?', category: 'Health' },
    { id: 's2_health_9', text: 'Should schools provide free mental health counselling for students?', category: 'Health' },
    { id: 's2_health_10', text: 'How can students balance academics, extracurricular activities, and rest?', category: 'Health' },
    
    // Environment & Community (8 topics)
    { id: 's2_env_1', text: 'What can Hong Kong do to reduce air pollution?', category: 'Environment' },
    { id: 's2_env_2', text: 'Should there be stricter laws against littering? Discuss.', category: 'Environment' },
    { id: 's2_env_3', text: 'Is it the responsibility of individuals or governments to tackle climate change?', category: 'Environment' },
    { id: 's2_env_4', text: 'Should young people be required to do community service?', category: 'Community' },
    { id: 's2_env_5', text: 'How can we encourage more people to use public transport?', category: 'Environment' },
    { id: 's2_env_6', text: 'Should Hong Kong build more country parks or more housing?', category: 'Community' },
    { id: 's2_env_7', text: 'What are the benefits of living in a city versus living in the countryside?', category: 'Community' },
    { id: 's2_env_8', text: 'Is it important to preserve old buildings and traditions in Hong Kong?', category: 'Community' }
  ],

  'S3': [
    // Education & Society (15 topics)
    { id: 's3_edu_1', text: 'In recent years, there has been debate about whether students should be required to take part in community service. Consider the benefits and drawbacks, and share your opinion on whether it should be mandatory.', category: 'Education' },
    { id: 's3_edu_2', text: 'Some argue that traditional examinations are outdated and should be replaced with alternative assessment methods. Evaluate this viewpoint and discuss what changes, if any, should be made to the current system.', category: 'Education' },
    { id: 's3_edu_3', text: 'With the advancement of AI technology, some predict that many jobs will be replaced by machines. How should young people prepare for this changing job market?', category: 'Career' },
    { id: 's3_edu_4', text: 'Should students have the freedom to choose all their subjects, or should some be compulsory?', category: 'Education' },
    { id: 's3_edu_5', text: 'Is the pressure to succeed academically too great in Hong Kong? What are the effects?', category: 'Education' },
    { id: 's3_edu_6', text: 'Should schools place more emphasis on developing students\' creativity rather than memorization?', category: 'Education' },
    { id: 's3_edu_7', text: 'Are internships and work experience more valuable than academic qualifications?', category: 'Career' },
    { id: 's3_edu_8', text: 'Should universities consider factors other than exam results when selecting students?', category: 'Education' },
    { id: 's3_edu_9', text: 'Is a gap year before university beneficial or a waste of time?', category: 'Education' },
    { id: 's3_edu_10', text: 'How can schools better prepare students for real-world challenges?', category: 'Education' },
    { id: 's3_edu_11', text: 'Should students be taught about politics and current affairs in school?', category: 'Education' },
    { id: 's3_edu_12', text: 'Is private tutoring fair to students who cannot afford it?', category: 'Education' },
    { id: 's3_edu_13', text: 'Should students be allowed to evaluate their teachers? Discuss the implications.', category: 'Education' },
    { id: 's3_edu_14', text: 'How important is English proficiency for success in Hong Kong?', category: 'Education' },
    { id: 's3_edu_15', text: 'Should schools focus on teaching students how to think rather than what to think?', category: 'Education' },
    
    // Technology & Future (12 topics)
    { id: 's3_tech_1', text: 'Is social media doing more harm than good to society? Discuss.', category: 'Technology' },
    { id: 's3_tech_2', text: 'Should governments regulate big technology companies more strictly?', category: 'Technology' },
    { id: 's3_tech_3', text: 'Will virtual reality change the way we learn and work in the future?', category: 'Technology' },
    { id: 's3_tech_4', text: 'Is it ethical to use animals for scientific experiments? What are the alternatives?', category: 'Ethics' },
    { id: 's3_tech_5', text: 'Should there be laws limiting how much data companies can collect about individuals?', category: 'Technology' },
    { id: 's3_tech_6', text: 'Are we becoming too dependent on technology? What are the risks?', category: 'Technology' },
    { id: 's3_tech_7', text: 'How will electric and self-driving cars change our cities?', category: 'Technology' },
    { id: 's3_tech_8', text: 'Should online anonymity be protected or restricted?', category: 'Technology' },
    { id: 's3_tech_9', text: 'Is the rise of e-sports a positive development for young people?', category: 'Technology' },
    { id: 's3_tech_10', text: 'How can we combat the spread of fake news on social media?', category: 'Technology' },
    { id: 's3_tech_11', text: 'Should coding be taught as early as primary school?', category: 'Technology' },
    { id: 's3_tech_12', text: 'Will humans ever live on other planets? Should we invest in space exploration?', category: 'Technology' },
    
    // Health & Society (10 topics)
    { id: 's3_health_1', text: 'What are the main causes of mental health problems among young people, and how can they be addressed?', category: 'Health' },
    { id: 's3_health_2', text: 'Should junk food advertising be banned? Discuss the arguments for and against.', category: 'Health' },
    { id: 's3_health_3', text: 'Is work-life balance achievable in Hong Kong? What changes are needed?', category: 'Health' },
    { id: 's3_health_4', text: 'Should sports stars be considered role models? Why or why not?', category: 'Health' },
    { id: 's3_health_5', text: 'How can we reduce the stigma around mental health in Hong Kong?', category: 'Health' },
    { id: 's3_health_6', text: 'Should the legal age for drinking alcohol be raised or lowered? Discuss.', category: 'Health' },
    { id: 's3_health_7', text: 'Is Hong Kong doing enough to support the elderly population?', category: 'Society' },
    { id: 's3_health_8', text: 'Should healthcare be completely free for everyone?', category: 'Health' },
    { id: 's3_health_9', text: 'How can we encourage young people to volunteer more in their communities?', category: 'Society' },
    { id: 's3_health_10', text: 'Should smoking be completely banned in all public places?', category: 'Health' },
    
    // Environment & Sustainability (8 topics)
    { id: 's3_env_1', text: 'Is individual action or government policy more effective in tackling climate change?', category: 'Environment' },
    { id: 's3_env_2', text: 'Should Hong Kong invest more in renewable energy sources?', category: 'Environment' },
    { id: 's3_env_3', text: 'Is fast fashion harmful to the environment? What alternatives exist?', category: 'Environment' },
    { id: 's3_env_4', text: 'Should there be a tax on single-use plastics?', category: 'Environment' },
    { id: 's3_env_5', text: 'How can we balance economic development with environmental protection?', category: 'Environment' },
    { id: 's3_env_6', text: 'Should eating meat be discouraged to help the environment?', category: 'Environment' },
    { id: 's3_env_7', text: 'Is Hong Kong doing enough to prepare for the effects of climate change?', category: 'Environment' },
    { id: 's3_env_8', text: 'Should there be stricter penalties for companies that pollute?', category: 'Environment' }
  ],

  'S4': [
    // Economy & Employment (15 topics)
    { id: 's4_eco_1', text: 'The Hong Kong government has proposed various measures to tackle youth unemployment. Evaluate the effectiveness of these initiatives and suggest additional strategies that could help young people enter the workforce.', category: 'Economy' },
    { id: 's4_eco_2', text: 'There is ongoing debate about the balance between economic development and environmental protection in Hong Kong. Discuss how the city can achieve sustainable development while maintaining its competitive edge.', category: 'Economy' },
    { id: 's4_eco_3', text: 'Mental health issues among teenagers have become increasingly prevalent. Analyze the contributing factors and propose comprehensive solutions involving schools, families, and the government.', category: 'Health' },
    { id: 's4_eco_4', text: 'Should Hong Kong implement a universal basic income? Discuss the potential benefits and challenges.', category: 'Economy' },
    { id: 's4_eco_5', text: 'Is the gig economy beneficial or harmful for young workers? Examine both perspectives.', category: 'Economy' },
    { id: 's4_eco_6', text: 'How can Hong Kong remain competitive as a global financial centre in the coming decades?', category: 'Economy' },
    { id: 's4_eco_7', text: 'Should there be a minimum wage increase? Analyze the economic implications.', category: 'Economy' },
    { id: 's4_eco_8', text: 'Is entrepreneurship a viable career path for young people in Hong Kong? What support is needed?', category: 'Economy' },
    { id: 's4_eco_9', text: 'How will automation and AI affect job opportunities for the next generation?', category: 'Economy' },
    { id: 's4_eco_10', text: 'Should the government provide more subsidies for small and medium enterprises?', category: 'Economy' },
    { id: 's4_eco_11', text: 'Is working from home the future of employment? Discuss the long-term implications.', category: 'Economy' },
    { id: 's4_eco_12', text: 'Should Hong Kong develop more industries beyond finance and property?', category: 'Economy' },
    { id: 's4_eco_13', text: 'How can we address the wealth gap in Hong Kong?', category: 'Economy' },
    { id: 's4_eco_14', text: 'Is a university degree still necessary for career success?', category: 'Career' },
    { id: 's4_eco_15', text: 'Should young people prioritize salary or job satisfaction when choosing a career?', category: 'Career' },
    
    // Social Issues (12 topics)
    { id: 's4_social_1', text: 'Is social mobility declining in Hong Kong? What can be done to improve it?', category: 'Society' },
    { id: 's4_social_2', text: 'Should the government do more to address the aging population problem?', category: 'Society' },
    { id: 's4_social_3', text: 'How can we promote greater diversity and inclusion in Hong Kong?', category: 'Society' },
    { id: 's4_social_4', text: 'Is the pursuit of material wealth negatively affecting society?', category: 'Society' },
    { id: 's4_social_5', text: 'Should celebrities be held to higher moral standards than ordinary people?', category: 'Society' },
    { id: 's4_social_6', text: 'How has the pandemic changed our society permanently?', category: 'Society' },
    { id: 's4_social_7', text: 'Should there be more support for single-parent families?', category: 'Society' },
    { id: 's4_social_8', text: 'Is traditional media still relevant in the age of social media?', category: 'Society' },
    { id: 's4_social_9', text: 'Should the voting age be lowered to 16?', category: 'Society' },
    { id: 's4_social_10', text: 'How can we address loneliness and social isolation in modern cities?', category: 'Society' },
    { id: 's4_social_11', text: 'Is cancel culture helpful or harmful to society?', category: 'Society' },
    { id: 's4_social_12', text: 'Should public figures be allowed to have private lives?', category: 'Society' },
    
    // Technology & Ethics (10 topics)
    { id: 's4_tech_1', text: 'Should there be limits on what AI can be used for? Discuss the ethical considerations.', category: 'Technology' },
    { id: 's4_tech_2', text: 'Is cryptocurrency the future of money? Analyze the potential and risks.', category: 'Technology' },
    { id: 's4_tech_3', text: 'Should social media platforms be responsible for the content their users post?', category: 'Technology' },
    { id: 's4_tech_4', text: 'Is facial recognition technology a threat to privacy and civil liberties?', category: 'Technology' },
    { id: 's4_tech_5', text: 'Should there be a global tax on technology giants?', category: 'Technology' },
    { id: 's4_tech_6', text: 'How can we ensure that technological progress benefits everyone equally?', category: 'Technology' },
    { id: 's4_tech_7', text: 'Is the metaverse a positive development for society?', category: 'Technology' },
    { id: 's4_tech_8', text: 'Should algorithms that make important decisions be transparent and explainable?', category: 'Technology' },
    { id: 's4_tech_9', text: 'How can we protect children from online dangers while respecting their privacy?', category: 'Technology' },
    { id: 's4_tech_10', text: 'Is it ethical to create increasingly human-like robots?', category: 'Technology' },
    
    // Environment & Global Issues (8 topics)
    { id: 's4_env_1', text: 'Should developed countries pay more to combat climate change?', category: 'Environment' },
    { id: 's4_env_2', text: 'Is nuclear power a solution to the energy crisis? Discuss the arguments.', category: 'Environment' },
    { id: 's4_env_3', text: 'Should there be international laws to protect the oceans from pollution?', category: 'Environment' },
    { id: 's4_env_4', text: 'How can we reduce food waste while also feeding a growing global population?', category: 'Environment' },
    { id: 's4_env_5', text: 'Should flying be taxed more heavily to reduce carbon emissions?', category: 'Environment' },
    { id: 's4_env_6', text: 'Is sustainable living possible in a consumer-driven society?', category: 'Environment' },
    { id: 's4_env_7', text: 'Should governments ban petrol and diesel cars by a certain date?', category: 'Environment' },
    { id: 's4_env_8', text: 'How can cities become more liveable and sustainable?', category: 'Environment' }
  ],

  'S5': [
    // Housing & Urban Issues (12 topics)
    { id: 's5_urban_1', text: 'With rising property prices in Hong Kong, many young people are concerned about their future housing prospects. Critically examine the current housing policies and suggest reforms that could make housing more accessible to the younger generation.', category: 'Housing' },
    { id: 's5_urban_2', text: 'The COVID-19 pandemic has fundamentally changed the way we work and learn. Evaluate the long-term implications of these changes on society and discuss how individuals and institutions should adapt.', category: 'Society' },
    { id: 's5_urban_3', text: 'Some argue that Hong Kong\'s education system places too much emphasis on academic achievement at the expense of creativity and critical thinking. To what extent do you agree, and what reforms would you propose?', category: 'Education' },
    { id: 's5_urban_4', text: 'Should the government prioritize building more public housing or improving existing estates?', category: 'Housing' },
    { id: 's5_urban_5', text: 'Is urban redevelopment beneficial or harmful to local communities?', category: 'Housing' },
    { id: 's5_urban_6', text: 'How can Hong Kong address its land shortage while preserving green spaces?', category: 'Housing' },
    { id: 's5_urban_7', text: 'Should young people expect to own their own homes, or is renting a viable long-term alternative?', category: 'Housing' },
    { id: 's5_urban_8', text: 'How can we make Hong Kong a more age-friendly city?', category: 'Society' },
    { id: 's5_urban_9', text: 'Should there be rent control in Hong Kong? Analyze the arguments.', category: 'Housing' },
    { id: 's5_urban_10', text: 'Is co-living a solution to the housing crisis for young professionals?', category: 'Housing' },
    { id: 's5_urban_11', text: 'How can public spaces be designed to improve community wellbeing?', category: 'Society' },
    { id: 's5_urban_12', text: 'Should the government reclaim more land from the sea for development?', category: 'Housing' },
    
    // Economy & Globalization (12 topics)
    { id: 's5_global_1', text: 'Is globalization beneficial or harmful to developing economies?', category: 'Economy' },
    { id: 's5_global_2', text: 'How should Hong Kong position itself in the changing geopolitical landscape?', category: 'Economy' },
    { id: 's5_global_3', text: 'Should there be stricter regulations on multinational corporations?', category: 'Economy' },
    { id: 's5_global_4', text: 'Is the current model of economic growth sustainable in the long term?', category: 'Economy' },
    { id: 's5_global_5', text: 'How can governments address income inequality in a globalized economy?', category: 'Economy' },
    { id: 's5_global_6', text: 'Should countries prioritize national interests or international cooperation?', category: 'Politics' },
    { id: 's5_global_7', text: 'Is free trade always beneficial? Discuss the winners and losers.', category: 'Economy' },
    { id: 's5_global_8', text: 'How has remote work changed the nature of the global workforce?', category: 'Economy' },
    { id: 's5_global_9', text: 'Should there be a global minimum corporate tax rate?', category: 'Economy' },
    { id: 's5_global_10', text: 'How can smaller economies compete with economic superpowers?', category: 'Economy' },
    { id: 's5_global_11', text: 'Is economic interdependence a force for peace or a vulnerability?', category: 'Politics' },
    { id: 's5_global_12', text: 'Should countries protect their own industries through tariffs and subsidies?', category: 'Economy' },
    
    // Social & Ethical Issues (12 topics)
    { id: 's5_ethics_1', text: 'To what extent should freedom of speech be protected? Are there limits?', category: 'Ethics' },
    { id: 's5_ethics_2', text: 'Is it possible to achieve true gender equality? What barriers remain?', category: 'Ethics' },
    { id: 's5_ethics_3', text: 'Should euthanasia be legalized? Discuss the ethical considerations.', category: 'Ethics' },
    { id: 's5_ethics_4', text: 'Is privacy a fundamental human right in the digital age?', category: 'Ethics' },
    { id: 's5_ethics_5', text: 'Should genetic engineering of humans be allowed? Where should the line be drawn?', category: 'Ethics' },
    { id: 's5_ethics_6', text: 'Is it ethical to use data about individuals for commercial purposes?', category: 'Ethics' },
    { id: 's5_ethics_7', text: 'Should wealthy individuals have a moral obligation to donate to charity?', category: 'Ethics' },
    { id: 's5_ethics_8', text: 'Is civil disobedience ever justified? Under what circumstances?', category: 'Ethics' },
    { id: 's5_ethics_9', text: 'Should animal testing for cosmetics and medicine be banned?', category: 'Ethics' },
    { id: 's5_ethics_10', text: 'How should society balance individual rights with collective responsibility?', category: 'Ethics' },
    { id: 's5_ethics_11', text: 'Is it ethical to have children in an era of climate change and uncertainty?', category: 'Ethics' },
    { id: 's5_ethics_12', text: 'Should there be limits on how much wealth individuals can accumulate?', category: 'Ethics' },
    
    // Future & Technology (9 topics)
    { id: 's5_future_1', text: 'Will AI eventually surpass human intelligence? What are the implications?', category: 'Technology' },
    { id: 's5_future_2', text: 'Should there be international regulations on emerging technologies like bioengineering?', category: 'Technology' },
    { id: 's5_future_3', text: 'Is social media fundamentally changing human relationships and communities?', category: 'Technology' },
    { id: 's5_future_4', text: 'How can we prepare for jobs that don\'t yet exist?', category: 'Career' },
    { id: 's5_future_5', text: 'Should we be concerned about AI making autonomous decisions in warfare?', category: 'Technology' },
    { id: 's5_future_6', text: 'Is technological unemployment an inevitable consequence of progress?', category: 'Technology' },
    { id: 's5_future_7', text: 'How will brain-computer interfaces change what it means to be human?', category: 'Technology' },
    { id: 's5_future_8', text: 'Should algorithms be allowed to make decisions about people\'s lives?', category: 'Technology' },
    { id: 's5_future_9', text: 'Is a cashless society desirable? What are the risks and benefits?', category: 'Technology' }
  ],

  'S6': [
    // Innovation & Economy (15 topics)
    { id: 's6_inno_1', text: 'As Hong Kong positions itself as a hub for innovation and technology, discuss the policy reforms and cultural shifts needed to foster an entrepreneurial ecosystem that can compete with other global cities like Singapore and Shenzhen.', category: 'Economy' },
    { id: 's6_inno_2', text: 'The concept of work-life balance is becoming increasingly important to the younger generation. Analyze how this shift in values might impact Hong Kong\'s economic productivity and corporate culture, and discuss whether employers should adapt their practices.', category: 'Economy' },
    { id: 's6_inno_3', text: 'With the growing influence of AI and automation, some experts predict that many traditional careers will become obsolete within the next decade. Critically evaluate how Hong Kong\'s education and training systems should evolve to prepare young people for this uncertain future.', category: 'Career' },
    { id: 's6_inno_4', text: 'Is Hong Kong\'s financial sector prepared for the challenges of fintech and decentralized finance?', category: 'Economy' },
    { id: 's6_inno_5', text: 'How can Hong Kong attract and retain global talent in an increasingly competitive world?', category: 'Economy' },
    { id: 's6_inno_6', text: 'Should governments take a more active role in directing economic development, or leave it to market forces?', category: 'Economy' },
    { id: 's6_inno_7', text: 'Is the pursuit of economic growth compatible with environmental sustainability?', category: 'Economy' },
    { id: 's6_inno_8', text: 'How can we measure national progress beyond GDP?', category: 'Economy' },
    { id: 's6_inno_9', text: 'Should essential services like healthcare and education be privatized or remain public?', category: 'Economy' },
    { id: 's6_inno_10', text: 'What role should government play in regulating emerging industries?', category: 'Economy' },
    { id: 's6_inno_11', text: 'Is the traditional 9-to-5 work model becoming obsolete?', category: 'Career' },
    { id: 's6_inno_12', text: 'How can we ensure that the benefits of technological innovation are shared broadly?', category: 'Economy' },
    { id: 's6_inno_13', text: 'Should there be stronger antitrust measures against monopolistic tech companies?', category: 'Economy' },
    { id: 's6_inno_14', text: 'Is stakeholder capitalism more ethical than shareholder capitalism?', category: 'Economy' },
    { id: 's6_inno_15', text: 'How should we rethink the purpose of work in an age of automation?', category: 'Career' },
    
    // Global Challenges (12 topics)
    { id: 's6_global_1', text: 'Is international cooperation sufficient to address the climate crisis?', category: 'Environment' },
    { id: 's6_global_2', text: 'Should wealthy nations accept more refugees? What are their moral obligations?', category: 'Politics' },
    { id: 's6_global_3', text: 'Is democracy under threat globally? What can be done to strengthen democratic institutions?', category: 'Politics' },
    { id: 's6_global_4', text: 'How should the international community respond to authoritarian regimes?', category: 'Politics' },
    { id: 's6_global_5', text: 'Can the UN effectively address 21st-century global challenges, or does it need reform?', category: 'Politics' },
    { id: 's6_global_6', text: 'Is economic sanctions an effective foreign policy tool?', category: 'Politics' },
    { id: 's6_global_7', text: 'Should there be an international court with the power to prosecute environmental crimes?', category: 'Environment' },
    { id: 's6_global_8', text: 'How can we address vaccine inequality between developed and developing countries?', category: 'Health' },
    { id: 's6_global_9', text: 'Is the rise of nationalism a threat to global cooperation?', category: 'Politics' },
    { id: 's6_global_10', text: 'Should there be stricter international regulation of offshore tax havens?', category: 'Economy' },
    { id: 's6_global_11', text: 'How can we prevent future pandemics? What global governance structures are needed?', category: 'Health' },
    { id: 's6_global_12', text: 'Is the current international order fair to developing nations?', category: 'Politics' },
    
    // Philosophy & Ethics (12 topics)
    { id: 's6_phil_1', text: 'To what extent should individuals sacrifice personal freedom for the collective good?', category: 'Ethics' },
    { id: 's6_phil_2', text: 'Is objective truth possible in an era of information overload and competing narratives?', category: 'Philosophy' },
    { id: 's6_phil_3', text: 'Should we have the right to be forgotten on the internet?', category: 'Ethics' },
    { id: 's6_phil_4', text: 'Is meritocracy a myth? Discuss the factors that influence success.', category: 'Philosophy' },
    { id: 's6_phil_5', text: 'Should future generations have legal rights? How should we represent their interests?', category: 'Ethics' },
    { id: 's6_phil_6', text: 'Is the concept of national sovereignty becoming obsolete in a globalized world?', category: 'Philosophy' },
    { id: 's6_phil_7', text: 'Should artistic expression have any limits? Where should the line be drawn?', category: 'Ethics' },
    { id: 's6_phil_8', text: 'Is it possible to have ethical consumption in a capitalist society?', category: 'Ethics' },
    { id: 's6_phil_9', text: 'Does technology ultimately liberate or constrain human freedom?', category: 'Philosophy' },
    { id: 's6_phil_10', text: 'Is happiness a choice, or is it determined by circumstances beyond our control?', category: 'Philosophy' },
    { id: 's6_phil_11', text: 'Should there be a universal set of human values that transcends cultural differences?', category: 'Philosophy' },
    { id: 's6_phil_12', text: 'Is the pursuit of self-interest inherently incompatible with the common good?', category: 'Philosophy' },
    
    // Technology & Future Society (11 topics)
    { id: 's6_tech_1', text: 'Should there be limits on the development of superintelligent AI?', category: 'Technology' },
    { id: 's6_tech_2', text: 'Is digital immortality ethically desirable? Consider the implications of uploading consciousness.', category: 'Technology' },
    { id: 's6_tech_3', text: 'Should social media platforms be treated as public utilities with regulated access?', category: 'Technology' },
    { id: 's6_tech_4', text: 'Is surveillance technology fundamentally incompatible with a free society?', category: 'Technology' },
    { id: 's6_tech_5', text: 'How should we govern the development and use of autonomous weapons?', category: 'Technology' },
    { id: 's6_tech_6', text: 'Should humans colonize other planets? Is it an ethical imperative or hubris?', category: 'Technology' },
    { id: 's6_tech_7', text: 'Is transhumanism the next step in human evolution, or a dangerous path?', category: 'Technology' },
    { id: 's6_tech_8', text: 'How can we ensure AI systems are fair, transparent, and accountable?', category: 'Technology' },
    { id: 's6_tech_9', text: 'Should there be universal access to the internet as a human right?', category: 'Technology' },
    { id: 's6_tech_10', text: 'Is it possible to have meaningful human connection in an increasingly virtual world?', category: 'Technology' },
    { id: 's6_tech_11', text: 'How will biotechnology change our understanding of life, death, and what it means to be human?', category: 'Technology' }
  ]
};

// Helper function to get a random topic for a grade level
export function getRandomTopic(grade: string): DiscussionTopic | null {
  const gradeLevel = grade.toUpperCase();
  
  // Check primary topics first
  if (primaryDiscussionTopics[gradeLevel]) {
    const topics = primaryDiscussionTopics[gradeLevel];
    return topics[Math.floor(Math.random() * topics.length)];
  }
  
  // Check secondary topics
  if (secondaryDiscussionTopics[gradeLevel]) {
    const topics = secondaryDiscussionTopics[gradeLevel];
    return topics[Math.floor(Math.random() * topics.length)];
  }
  
  // Fallback for grades not explicitly defined
  // Try to find closest match
  if (gradeLevel.startsWith('P') || gradeLevel.startsWith('K')) {
    // Primary/Kindergarten - use P4 as default
    const topics = primaryDiscussionTopics['P4'];
    return topics[Math.floor(Math.random() * topics.length)];
  } else if (gradeLevel.startsWith('S')) {
    // Secondary - use S3 as default
    const topics = secondaryDiscussionTopics['S3'];
    return topics[Math.floor(Math.random() * topics.length)];
  }
  
  return null;
}

// Get topic count for a grade
export function getTopicCount(grade: string): number {
  const gradeLevel = grade.toUpperCase();
  
  if (primaryDiscussionTopics[gradeLevel]) {
    return primaryDiscussionTopics[gradeLevel].length;
  }
  
  if (secondaryDiscussionTopics[gradeLevel]) {
    return secondaryDiscussionTopics[gradeLevel].length;
  }
  
  return 0;
}

// Get all topics for a grade
export function getAllTopicsForGrade(grade: string): DiscussionTopic[] {
  const gradeLevel = grade.toUpperCase();
  
  if (primaryDiscussionTopics[gradeLevel]) {
    return primaryDiscussionTopics[gradeLevel];
  }
  
  if (secondaryDiscussionTopics[gradeLevel]) {
    return secondaryDiscussionTopics[gradeLevel];
  }
  
  return [];
}
