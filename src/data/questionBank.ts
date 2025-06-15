// Hong Kong English Oral Assessment Question Bank
// Production-level questions designed for each grade level

export interface Question {
  id: number;
  section: string;
  type: 'greeting' | 'question' | 'reading' | 'personal' | 'discussion' | 'presentation' | 'current_affairs' | 'opinion';
  text: string;
  instruction: string;
  targetWords: string[];
  timeLimit?: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface QuestionSet {
  setId: number;
  name: string;
  questions: Question[];
  dsePartA?: {
    title: string;
    article: string;
    discussionPoints: string[];
  };
}

// K1 Question Sets (Age 3-4): Basic vocabulary, simple responses
export const K1_QUESTIONS: QuestionSet[] = [
  {
    setId: 1,
    name: "動物和顏色",
    questions: [
      { id: 1, section: 'A. 簡單問答', type: 'greeting', text: 'Hello! What is your name?', instruction: '請告訴我你的名字', targetWords: ['name', 'hello'], difficulty: 'basic' },
      { id: 2, section: 'A. 簡單問答', type: 'question', text: 'How old are you?', instruction: '告訴我你幾歲', targetWords: ['old', 'three', 'four'], difficulty: 'basic' },
      { id: 3, section: 'B. 認識事物', type: 'question', text: 'What color is this apple?', instruction: '這個蘋果是什麼顏色？', targetWords: ['red', 'apple', 'color'], difficulty: 'basic' },
      { id: 4, section: 'B. 認識事物', type: 'question', text: 'What animal says "moo"?', instruction: '什麼動物會說"哞"？', targetWords: ['cow', 'animal'], difficulty: 'basic' },
      { id: 5, section: 'C. 個人喜好', type: 'personal', text: 'Do you like cats or dogs?', instruction: '你喜歡貓還是狗？', targetWords: ['like', 'cat', 'dog'], difficulty: 'basic' }
    ]
  },
  {
    setId: 2,
    name: "家庭和玩具",
    questions: [
      { id: 6, section: 'A. 簡單問答', type: 'greeting', text: 'Good morning!', instruction: '請回應早安問候', targetWords: ['good', 'morning'], difficulty: 'basic' },
      { id: 7, section: 'A. 簡單問答', type: 'question', text: 'Who is in your family?', instruction: '你家裡有誰？', targetWords: ['family', 'mummy', 'daddy'], difficulty: 'basic' },
      { id: 8, section: 'B. 認識事物', type: 'question', text: 'What toy do you play with?', instruction: '你玩什麼玩具？', targetWords: ['toy', 'play', 'ball'], difficulty: 'basic' },
      { id: 9, section: 'B. 認識事物', type: 'question', text: 'Where do you sleep?', instruction: '你在哪裡睡覺？', targetWords: ['sleep', 'bed'], difficulty: 'basic' },
      { id: 10, section: 'C. 個人喜好', type: 'personal', text: 'What is your favorite food?', instruction: '你最喜歡吃什麼？', targetWords: ['favorite', 'food'], difficulty: 'basic' }
    ]
  },
  {
    setId: 3,
    name: "身體部位和動作",
    questions: [
      { id: 11, section: 'A. 簡單問答', type: 'greeting', text: 'How are you today?', instruction: '你今天好嗎？', targetWords: ['good', 'fine', 'happy'], difficulty: 'basic' },
      { id: 12, section: 'A. 簡單問答', type: 'question', text: 'Can you show me your hands?', instruction: '你能給我看看你的手嗎？', targetWords: ['hands', 'show'], difficulty: 'basic' },
      { id: 13, section: 'B. 認識事物', type: 'question', text: 'What do you do with your eyes?', instruction: '你用眼睛做什麼？', targetWords: ['eyes', 'see'], difficulty: 'basic' },
      { id: 14, section: 'B. 認識事物', type: 'question', text: 'Can you jump?', instruction: '你會跳嗎？', targetWords: ['jump', 'can'], difficulty: 'basic' },
      { id: 15, section: 'C. 個人喜好', type: 'personal', text: 'Do you like to run?', instruction: '你喜歡跑步嗎？', targetWords: ['like', 'run'], difficulty: 'basic' }
    ]
  },
  {
    setId: 4,
    name: "數字和形狀",
    questions: [
      { id: 16, section: 'A. 簡單問答', type: 'question', text: 'Can you count to five?', instruction: '你能數到五嗎？', targetWords: ['count', 'one', 'two', 'three', 'four', 'five'], difficulty: 'basic' },
      { id: 17, section: 'A. 簡單問答', type: 'question', text: 'How many fingers do you have?', instruction: '你有幾根手指？', targetWords: ['fingers', 'ten'], difficulty: 'basic' },
      { id: 18, section: 'B. 認識事物', type: 'question', text: 'What shape is a ball?', instruction: '球是什麼形狀？', targetWords: ['ball', 'round', 'circle'], difficulty: 'basic' },
      { id: 19, section: 'B. 認識事物', type: 'question', text: 'What color is the sun?', instruction: '太陽是什麼顏色？', targetWords: ['sun', 'yellow'], difficulty: 'basic' },
      { id: 20, section: 'C. 個人喜好', type: 'personal', text: 'Do you like to sing?', instruction: '你喜歡唱歌嗎？', targetWords: ['like', 'sing'], difficulty: 'basic' }
    ]
  },
  {
    setId: 5,
    name: "天氣和感覺",
    questions: [
      { id: 21, section: 'A. 簡單問答', type: 'question', text: 'Is it sunny today?', instruction: '今天是晴天嗎？', targetWords: ['sunny', 'today'], difficulty: 'basic' },
      { id: 22, section: 'A. 簡單問答', type: 'question', text: 'Are you happy?', instruction: '你開心嗎？', targetWords: ['happy', 'yes'], difficulty: 'basic' },
      { id: 23, section: 'B. 認識事物', type: 'question', text: 'What do you wear when it rains?', instruction: '下雨時你穿什麼？', targetWords: ['rain', 'coat'], difficulty: 'basic' },
      { id: 24, section: 'B. 認識事物', type: 'question', text: 'When are you tired?', instruction: '你什麼時候累？', targetWords: ['tired', 'sleep'], difficulty: 'basic' },
      { id: 25, section: 'C. 個人喜好', type: 'personal', text: 'Do you like ice cream?', instruction: '你喜歡雪糕嗎？', targetWords: ['like', 'ice', 'cream'], difficulty: 'basic' }
    ]
  }
];

// P1 Question Sets (Age 6-7): School life, basic reading
export const P1_QUESTIONS: QuestionSet[] = [
  {
    setId: 1,
    name: "學校生活",
    questions: [
      { id: 1, section: 'A. 自發表達', type: 'greeting', text: 'Good morning. How are you?', instruction: '請回應問候', targetWords: ['good', 'morning', 'fine'], difficulty: 'basic' },
      { id: 2, section: 'A. 自發表達', type: 'question', text: 'What is your name and which school do you go to?', instruction: '告訴我你的名字和學校', targetWords: ['name', 'school'], difficulty: 'basic' },
      { id: 3, section: 'A. 自發表達', type: 'question', text: 'What class are you in?', instruction: '你在哪一班？', targetWords: ['class', 'primary', 'one'], difficulty: 'basic' },
      { id: 4, section: 'B. 朗讀', type: 'reading', text: 'My School Day: I go to school at eight. I have English and Math. I play with my friends. I go home at three.', instruction: '請朗讀這段文字', targetWords: ['school', 'english', 'math', 'friends', 'home'], difficulty: 'basic' },
      { id: 5, section: 'C. 個人經驗', type: 'personal', text: 'What do you like to do at school?', instruction: '你在學校喜歡做什麼？', targetWords: ['like', 'school', 'play', 'learn'], difficulty: 'basic' }
    ]
  },
  {
    setId: 2,
    name: "我的家庭",
    questions: [
      { id: 6, section: 'A. 自發表達', type: 'question', text: 'How many people are there in your family?', instruction: '你家有幾個人？', targetWords: ['family', 'people', 'four', 'five'], difficulty: 'basic' },
      { id: 7, section: 'A. 自發表達', type: 'question', text: 'What does your father do?', instruction: '你爸爸做什麼工作？', targetWords: ['father', 'work'], difficulty: 'basic' },
      { id: 8, section: 'A. 自發表達', type: 'question', text: 'Do you have any brothers or sisters?', instruction: '你有兄弟姊妹嗎？', targetWords: ['brother', 'sister'], difficulty: 'basic' },
      { id: 9, section: 'B. 朗讀', type: 'reading', text: 'My Family: I have a happy family. My father is kind. My mother cooks well. I have one sister. We love each other.', instruction: '請朗讀這段關於家庭的文字', targetWords: ['family', 'father', 'mother', 'sister', 'love'], difficulty: 'basic' },
      { id: 10, section: 'C. 個人經驗', type: 'personal', text: 'What do you do with your family on weekends?', instruction: '週末你和家人做什麼？', targetWords: ['family', 'weekend', 'together'], difficulty: 'basic' }
    ]
  },
  {
    setId: 3,
    name: "我的興趣",
    questions: [
      { id: 11, section: 'A. 自發表達', type: 'question', text: 'What is your favorite subject?', instruction: '你最喜歡什麼科目？', targetWords: ['favorite', 'subject', 'english', 'math'], difficulty: 'basic' },
      { id: 12, section: 'A. 自發表達', type: 'question', text: 'Do you like to read books?', instruction: '你喜歡看書嗎？', targetWords: ['like', 'read', 'books'], difficulty: 'basic' },
      { id: 13, section: 'A. 自發表達', type: 'question', text: 'What games do you play?', instruction: '你玩什麼遊戲？', targetWords: ['games', 'play'], difficulty: 'basic' },
      { id: 14, section: 'B. 朗讀', type: 'reading', text: 'My Hobbies: I like to draw pictures. I play football with friends. I read story books. I watch cartoons on TV.', instruction: '請朗讀這段關於興趣的文字', targetWords: ['draw', 'football', 'story', 'cartoons'], difficulty: 'basic' },
      { id: 15, section: 'C. 個人經驗', type: 'personal', text: 'Tell me about your favorite toy or game.', instruction: '告訴我你最喜歡的玩具或遊戲', targetWords: ['favorite', 'toy', 'game', 'fun'], difficulty: 'basic' }
    ]
  },
  {
    setId: 4,
    name: "動物朋友",
    questions: [
      { id: 16, section: 'A. 自發表達', type: 'question', text: 'Do you have a pet?', instruction: '你有寵物嗎？', targetWords: ['pet', 'have'], difficulty: 'basic' },
      { id: 17, section: 'A. 自發表達', type: 'question', text: 'What is your favorite animal?', instruction: '你最喜歡什麼動物？', targetWords: ['favorite', 'animal'], difficulty: 'basic' },
      { id: 18, section: 'A. 自發表達', type: 'question', text: 'Where do fish live?', instruction: '魚住在哪裡？', targetWords: ['fish', 'live', 'water'], difficulty: 'basic' },
      { id: 19, section: 'B. 朗讀', type: 'reading', text: 'Animals: Dogs are loyal friends. Cats are soft and cute. Birds can fly high. Fish swim in the water. I love all animals.', instruction: '請朗讀這段關於動物的文字', targetWords: ['dogs', 'cats', 'birds', 'fish', 'animals'], difficulty: 'basic' },
      { id: 20, section: 'C. 個人經驗', type: 'personal', text: 'Have you ever been to a zoo? What animals did you see?', instruction: '你去過動物園嗎？看到什麼動物？', targetWords: ['zoo', 'animals', 'see'], difficulty: 'basic' }
    ]
  },
  {
    setId: 5,
    name: "節日慶祝",
    questions: [
      { id: 21, section: 'A. 自發表達', type: 'question', text: 'What is your favorite festival?', instruction: '你最喜歡什麼節日？', targetWords: ['favorite', 'festival'], difficulty: 'basic' },
      { id: 22, section: 'A. 自發表達', type: 'question', text: 'What do you eat during Chinese New Year?', instruction: '農曆新年你吃什麼？', targetWords: ['chinese', 'new', 'year', 'eat'], difficulty: 'basic' },
      { id: 23, section: 'A. 自發表達', type: 'question', text: 'Do you get presents on your birthday?', instruction: '你生日時收到禮物嗎？', targetWords: ['presents', 'birthday'], difficulty: 'basic' },
      { id: 24, section: 'B. 朗讀', type: 'reading', text: 'Christmas Time: At Christmas, we have a big dinner. We give presents to family. We sing songs together. It is a happy time.', instruction: '請朗讀這段關於聖誕節的文字', targetWords: ['christmas', 'dinner', 'presents', 'songs', 'happy'], difficulty: 'basic' },
      { id: 25, section: 'C. 個人經驗', type: 'personal', text: 'How do you celebrate your birthday?', instruction: '你怎樣慶祝生日？', targetWords: ['celebrate', 'birthday', 'party'], difficulty: 'basic' }
    ]
  }
];

// P3 Question Sets (Age 8-9): More complex sentences, detailed descriptions
export const P3_QUESTIONS: QuestionSet[] = [
  {
    setId: 1,
    name: "我的學習生活",
    questions: [
      { id: 1, section: 'A. 自發表達', type: 'greeting', text: 'Good afternoon. How was your day at school?', instruction: '請回應問候並簡單描述在校一天', targetWords: ['good', 'afternoon', 'school', 'day'], difficulty: 'intermediate' },
      { id: 2, section: 'A. 自發表達', type: 'question', text: 'What subjects do you study in Primary 3?', instruction: '小三你讀什麼科目？', targetWords: ['subjects', 'study', 'primary', 'english', 'chinese', 'math'], difficulty: 'intermediate' },
      { id: 3, section: 'A. 自發表達', type: 'question', text: 'Which subject is the most difficult for you and why?', instruction: '哪一科對你來說最困難？為什麼？', targetWords: ['difficult', 'subject', 'because'], difficulty: 'intermediate' },
      { id: 4, section: 'B. 朗讀', type: 'reading', text: 'A School Trip: Last week, our class went to the Science Museum. We saw many interesting experiments. The teacher explained how things work. We asked many questions and learned a lot. Everyone enjoyed the trip very much.', instruction: '請朗讀這段關於學校旅行的文字', targetWords: ['school', 'trip', 'museum', 'experiments', 'teacher', 'questions', 'learned'], difficulty: 'intermediate' },
      { id: 5, section: 'C. 個人經驗', type: 'personal', text: 'Describe your best friend at school. What do you like to do together?', instruction: '描述你在學校最好的朋友，你們一起做什麼？', targetWords: ['best', 'friend', 'together', 'play', 'like'], difficulty: 'intermediate' }
    ]
  },
  {
    setId: 2,
    name: "香港我的家",
    questions: [
      { id: 6, section: 'A. 自發表達', type: 'question', text: 'What district do you live in Hong Kong?', instruction: '你住在香港哪一區？', targetWords: ['district', 'live', 'hong', 'kong'], difficulty: 'intermediate' },
      { id: 7, section: 'A. 自發表達', type: 'question', text: 'How do you go to school every day?', instruction: '你每天怎樣上學？', targetWords: ['school', 'every', 'day', 'bus', 'walk'], difficulty: 'intermediate' },
      { id: 8, section: 'A. 自發表達', type: 'question', text: 'What can you see from your home window?', instruction: '從你家窗戶可以看到什麼？', targetWords: ['see', 'home', 'window'], difficulty: 'intermediate' },
      { id: 9, section: 'B. 朗讀', type: 'reading', text: 'Living in Hong Kong: Hong Kong is a busy city with tall buildings. Many people take the MTR to work. There are beautiful parks and beaches. Dim sum is popular food here. People speak Cantonese and English.', instruction: '請朗讀這段關於香港生活的文字', targetWords: ['hong', 'kong', 'busy', 'buildings', 'mtr', 'parks', 'beaches', 'cantonese'], difficulty: 'intermediate' },
      { id: 10, section: 'C. 個人經驗', type: 'personal', text: 'What is your favorite place in Hong Kong and why?', instruction: '你最喜歡香港哪個地方？為什麼？', targetWords: ['favorite', 'place', 'hong', 'kong', 'because'], difficulty: 'intermediate' }
    ]
  },
  {
    setId: 3,
    name: "健康生活",
    questions: [
      { id: 11, section: 'A. 自發表達', type: 'question', text: 'What do you usually eat for breakfast?', instruction: '你通常早餐吃什麼？', targetWords: ['usually', 'eat', 'breakfast'], difficulty: 'intermediate' },
      { id: 12, section: 'A. 自發表達', type: 'question', text: 'How much sleep do you get every night?', instruction: '你每晚睡多少小時？', targetWords: ['sleep', 'every', 'night', 'hours'], difficulty: 'intermediate' },
      { id: 13, section: 'A. 自發表達', type: 'question', text: 'What sports or exercise do you do?', instruction: '你做什麼運動或鍛煉？', targetWords: ['sports', 'exercise'], difficulty: 'intermediate' },
      { id: 14, section: 'B. 朗讀', type: 'reading', text: 'Staying Healthy: To stay healthy, we should eat fruits and vegetables every day. We need to exercise regularly and get enough sleep. Drinking water is important too. We should also wash our hands often to prevent illness.', instruction: '請朗讀這段關於保持健康的文字', targetWords: ['healthy', 'fruits', 'vegetables', 'exercise', 'regularly', 'sleep', 'water', 'prevent'], difficulty: 'intermediate' },
      { id: 15, section: 'C. 個人經驗', type: 'personal', text: 'Tell me about a time when you were sick. How did you feel and what did you do?', instruction: '告訴我你生病的經歷，你感覺如何？做了什麼？', targetWords: ['sick', 'feel', 'doctor', 'medicine'], difficulty: 'intermediate' }
    ]
  },
  {
    setId: 4,
    name: "季節和天氣",
    questions: [
      { id: 16, section: 'A. 自發表達', type: 'question', text: 'What is your favorite season and why?', instruction: '你最喜歡哪個季節？為什麼？', targetWords: ['favorite', 'season', 'spring', 'summer', 'autumn', 'winter'], difficulty: 'intermediate' },
      { id: 17, section: 'A. 自發表達', type: 'question', text: 'What is the weather like in Hong Kong during summer?', instruction: '香港夏天的天氣怎樣？', targetWords: ['weather', 'hong', 'kong', 'summer', 'hot', 'humid'], difficulty: 'intermediate' },
      { id: 18, section: 'A. 自發表達', type: 'question', text: 'What clothes do you wear in different seasons?', instruction: '不同季節你穿什麼衣服？', targetWords: ['clothes', 'wear', 'seasons'], difficulty: 'intermediate' },
      { id: 19, section: 'B. 朗讀', type: 'reading', text: 'Four Seasons: Spring brings warm weather and beautiful flowers. Summer is hot and perfect for swimming. Autumn has cool weather and falling leaves. Winter is cold, and sometimes we need to wear thick coats.', instruction: '請朗讀這段關於四季的文字', targetWords: ['spring', 'warm', 'flowers', 'summer', 'swimming', 'autumn', 'leaves', 'winter', 'coats'], difficulty: 'intermediate' },
      { id: 20, section: 'C. 個人經驗', type: 'personal', text: 'Describe what you like to do on a rainy day.', instruction: '描述你在下雨天喜歡做什麼', targetWords: ['rainy', 'day', 'indoor', 'activities'], difficulty: 'intermediate' }
    ]
  },
  {
    setId: 5,
    name: "科技和未來",
    questions: [
      { id: 21, section: 'A. 自發表達', type: 'question', text: 'Do you use a computer or tablet at home?', instruction: '你在家使用電腦或平板嗎？', targetWords: ['computer', 'tablet', 'home'], difficulty: 'intermediate' },
      { id: 22, section: 'A. 自發表達', type: 'question', text: 'What do you want to be when you grow up?', instruction: '你長大後想做什麼？', targetWords: ['want', 'grow', 'up', 'teacher', 'doctor'], difficulty: 'intermediate' },
      { id: 23, section: 'A. 自發表達', type: 'question', text: 'How do you think schools will be different in the future?', instruction: '你認為未來的學校會有什麼不同？', targetWords: ['think', 'schools', 'different', 'future'], difficulty: 'intermediate' },
      { id: 24, section: 'B. 朗讀', type: 'reading', text: 'Technology Today: Many children use tablets and computers for learning. We can video call family members far away. Robots help people do difficult jobs. In the future, technology will make our lives even easier and more interesting.', instruction: '請朗讀這段關於科技的文字', targetWords: ['technology', 'tablets', 'computers', 'learning', 'video', 'call', 'robots', 'future'], difficulty: 'intermediate' },
      { id: 25, section: 'C. 個人經驗', type: 'personal', text: 'If you could invent something to help people, what would it be?', instruction: '如果你能發明幫助人們的東西，會是什麼？', targetWords: ['invent', 'help', 'people', 'useful'], difficulty: 'intermediate' }
    ]
  }
];

// S1 Question Sets (Age 12-13): Complex discussions, critical thinking
export const S1_QUESTIONS: QuestionSet[] = [
  {
    setId: 1,
    name: "中學新生活",
    questions: [
      { id: 1, section: 'A. 個人演講', type: 'presentation', text: 'Describe your first impressions of secondary school life.', instruction: '描述你對中學生活的第一印象 (1-2分鐘)', targetWords: ['secondary', 'school', 'impressions', 'different', 'challenging'], timeLimit: 120, difficulty: 'intermediate' },
      { id: 2, section: 'A. 個人演講', type: 'presentation', text: 'Compare primary school and secondary school. What are the main differences?', instruction: '比較小學和中學的主要分別 (1-2分鐘)', targetWords: ['compare', 'primary', 'secondary', 'differences', 'subjects', 'responsibility'], timeLimit: 120, difficulty: 'intermediate' },
      { id: 3, section: 'B. 問答討論', type: 'question', text: 'How do you manage your time between schoolwork and hobbies?', instruction: '你如何平衡學業和興趣？', targetWords: ['manage', 'time', 'schoolwork', 'hobbies', 'balance'], difficulty: 'intermediate' },
      { id: 4, section: 'B. 問答討論', type: 'question', text: 'What challenges do you face as a new secondary school student?', instruction: '作為中學新生，你面對什麼挑戰？', targetWords: ['challenges', 'face', 'new', 'student', 'adapt'], difficulty: 'intermediate' },
      { id: 5, section: 'C. 小組討論', type: 'discussion', text: 'Should schools have longer lunch breaks? Discuss the advantages and disadvantages.', instruction: '學校應該有更長的午餐時間嗎？討論利弊', targetWords: ['longer', 'lunch', 'breaks', 'advantages', 'disadvantages', 'students', 'relax'], timeLimit: 480, difficulty: 'intermediate' }
    ]
  },
  {
    setId: 2,
    name: "香港社會議題",
    questions: [
      { id: 6, section: 'A. 個人演講', type: 'presentation', text: 'Explain why recycling is important in Hong Kong.', instruction: '解釋為什麼回收對香港很重要 (1-2分鐘)', targetWords: ['recycling', 'important', 'hong', 'kong', 'environment', 'reduce', 'waste'], timeLimit: 120, difficulty: 'intermediate' },
      { id: 7, section: 'A. 個人演講', type: 'current_affairs', text: 'Describe the benefits of using public transport in Hong Kong.', instruction: '描述在香港使用公共交通的好處 (1-2分鐘)', targetWords: ['benefits', 'public', 'transport', 'hong', 'kong', 'convenient', 'environmental'], timeLimit: 120, difficulty: 'intermediate' },
      { id: 8, section: 'B. 問答討論', type: 'opinion', text: 'What can young people do to protect the environment?', instruction: '年輕人可以做什麼來保護環境？', targetWords: ['young', 'people', 'protect', 'environment', 'actions', 'responsibility'], difficulty: 'intermediate' },
      { id: 9, section: 'B. 問答討論', type: 'opinion', text: 'How has technology changed the way people communicate in Hong Kong?', instruction: '科技如何改變香港人的溝通方式？', targetWords: ['technology', 'changed', 'communicate', 'hong', 'kong', 'social', 'media'], difficulty: 'intermediate' },
      { id: 10, section: 'C. 小組討論', type: 'discussion', text: 'Should mobile phones be banned in schools? Share your views.', instruction: '學校應該禁止使用手機嗎？分享你的看法', targetWords: ['mobile', 'phones', 'banned', 'schools', 'views', 'distraction', 'learning'], timeLimit: 480, difficulty: 'intermediate' }
    ]
  },
  {
    setId: 3,
    name: "個人成長與價值觀",
    questions: [
      { id: 11, section: 'A. 個人演講', type: 'presentation', text: 'Talk about a person who has influenced you and explain why.', instruction: '談論一個影響你的人並解釋原因 (1-2分鐘)', targetWords: ['person', 'influenced', 'explain', 'why', 'inspiration', 'qualities'], timeLimit: 120, difficulty: 'intermediate' },
      { id: 12, section: 'A. 個人演講', type: 'personal', text: 'Describe a goal you have set for yourself and how you plan to achieve it.', instruction: '描述你為自己設定的目標以及實現計劃 (1-2分鐘)', targetWords: ['goal', 'set', 'yourself', 'plan', 'achieve', 'steps', 'determination'], timeLimit: 120, difficulty: 'intermediate' },
      { id: 13, section: 'B. 問答討論', type: 'opinion', text: 'What qualities make a good friend?', instruction: '什麼品質造就好朋友？', targetWords: ['qualities', 'good', 'friend', 'loyal', 'trustworthy', 'supportive'], difficulty: 'intermediate' },
      { id: 14, section: 'B. 問答討論', type: 'personal', text: 'How do you deal with stress and pressure from studies?', instruction: '你如何處理學習壓力？', targetWords: ['deal', 'stress', 'pressure', 'studies', 'cope', 'relaxation'], difficulty: 'intermediate' },
      { id: 15, section: 'C. 小組討論', type: 'discussion', text: 'Is it more important to be popular or to be true to yourself? Discuss.', instruction: '受歡迎和做真實的自己，哪個更重要？討論', targetWords: ['important', 'popular', 'true', 'yourself', 'authentic', 'peer', 'pressure'], timeLimit: 480, difficulty: 'intermediate' }
    ]
  },
  {
    setId: 4,
    name: "全球化與文化",
    questions: [
      { id: 16, section: 'A. 個人演講', type: 'presentation', text: 'Explain how globalization affects teenagers in Hong Kong.', instruction: '解釋全球化如何影響香港青少年 (1-2分鐘)', targetWords: ['globalization', 'affects', 'teenagers', 'hong', 'kong', 'culture', 'opportunities'], timeLimit: 120, difficulty: 'advanced' },
      { id: 17, section: 'A. 個人演講', type: 'current_affairs', text: 'Describe the importance of learning different languages in today\'s world.', instruction: '描述在當今世界學習不同語言的重要性 (1-2分鐘)', targetWords: ['importance', 'learning', 'languages', 'today', 'world', 'communication', 'opportunities'], timeLimit: 120, difficulty: 'advanced' },
      { id: 18, section: 'B. 問答討論', type: 'opinion', text: 'Should traditional festivals be preserved in modern society?', instruction: '現代社會應該保留傳統節日嗎？', targetWords: ['traditional', 'festivals', 'preserved', 'modern', 'society', 'culture', 'heritage'], difficulty: 'advanced' },
      { id: 19, section: 'B. 問答討論', type: 'current_affairs', text: 'How do social media platforms influence young people\'s behavior?', instruction: '社交媒體平台如何影響年輕人的行為？', targetWords: ['social', 'media', 'platforms', 'influence', 'young', 'behavior', 'impact'], difficulty: 'advanced' },
      { id: 20, section: 'C. 小組討論', type: 'discussion', text: 'Fast food vs. traditional cuisine: Which is better for society? Discuss the pros and cons.', instruction: '快餐與傳統菜式：哪個對社會更好？討論利弊', targetWords: ['fast', 'food', 'traditional', 'cuisine', 'society', 'pros', 'cons', 'health', 'culture'], timeLimit: 480, difficulty: 'advanced' }
    ]
  },
  {
    setId: 5,
    name: "未來職業與教育",
    questions: [
      { id: 21, section: 'A. 個人演講', type: 'presentation', text: 'Discuss the role of artificial intelligence in future education.', instruction: '討論人工智能在未來教育中的作用 (1-2分鐘)', targetWords: ['artificial', 'intelligence', 'future', 'education', 'role', 'technology', 'learning'], timeLimit: 120, difficulty: 'advanced' },
      { id: 22, section: 'A. 個人演講', type: 'personal', text: 'Explain what career path you are considering and why it interests you.', instruction: '解釋你考慮的職業道路以及為什麼感興趣 (1-2分鐘)', targetWords: ['career', 'path', 'considering', 'interests', 'future', 'goals', 'passion'], timeLimit: 120, difficulty: 'intermediate' },
      { id: 23, section: 'B. 問答討論', type: 'opinion', text: 'What skills will be most important for future workers?', instruction: '哪些技能對未來工作者最重要？', targetWords: ['skills', 'important', 'future', 'workers', 'technology', 'creativity', 'communication'], difficulty: 'advanced' },
      { id: 24, section: 'B. 問答討論', type: 'current_affairs', text: 'How can schools better prepare students for the changing job market?', instruction: '學校如何更好地為學生準備應對變化的就業市場？', targetWords: ['schools', 'prepare', 'students', 'changing', 'job', 'market', 'skills', 'adaptability'], difficulty: 'advanced' },
      { id: 25, section: 'C. 小組討論', type: 'discussion', text: 'University education vs. vocational training: Which provides better career prospects? Discuss.', instruction: '大學教育與職業培訓：哪個提供更好的職業前景？討論', targetWords: ['university', 'education', 'vocational', 'training', 'career', 'prospects', 'skills', 'opportunities'], timeLimit: 480, difficulty: 'advanced' }
    ]
  }
];

// S6 Question Sets (Age 17-18): Advanced discussions, complex analysis
export const S6_QUESTIONS: QuestionSet[] = [
  {
    setId: 1,
    name: "全球議題與社會責任",
    questions: [
      { id: 1, section: 'A. 個人演講', type: 'presentation', text: 'Analyze the impact of climate change on global society and propose solutions.', instruction: '分析氣候變化對全球社會的影響並提出解決方案 (2-3分鐘)', targetWords: ['analyze', 'climate', 'change', 'global', 'society', 'impact', 'solutions', 'sustainable'], timeLimit: 180, difficulty: 'advanced' },
      { id: 2, section: 'A. 個人演講', type: 'current_affairs', text: 'Discuss the role of international cooperation in addressing global challenges.', instruction: '討論國際合作在應對全球挑戰中的作用 (2-3分鐘)', targetWords: ['international', 'cooperation', 'addressing', 'global', 'challenges', 'collaboration', 'diplomacy'], timeLimit: 180, difficulty: 'advanced' },
      { id: 3, section: 'B. 深度問答', type: 'opinion', text: 'Evaluate the effectiveness of social media in promoting social justice movements.', instruction: '評估社交媒體在推動社會正義運動方面的效力', targetWords: ['evaluate', 'effectiveness', 'social', 'media', 'promoting', 'justice', 'movements', 'activism'], difficulty: 'advanced' },
      { id: 4, section: 'B. 深度問答', type: 'current_affairs', text: 'How should governments balance economic growth with environmental protection?', instruction: '政府應如何平衡經濟增長與環境保護？', targetWords: ['governments', 'balance', 'economic', 'growth', 'environmental', 'protection', 'sustainable', 'development'], difficulty: 'advanced' },
      { id: 5, section: 'C. 小組辯論', type: 'discussion', text: 'Should developed countries bear greater responsibility for addressing climate change than developing nations?', instruction: '發達國家是否應該比發展中國家承擔更大的應對氣候變化責任？', targetWords: ['developed', 'countries', 'responsibility', 'climate', 'change', 'developing', 'nations', 'historical', 'emissions'], timeLimit: 600, difficulty: 'advanced' }
    ]
  },
  {
    setId: 2,
    name: "科技創新與倫理",
    questions: [
      { id: 6, section: 'A. 個人演講', type: 'presentation', text: 'Examine the ethical implications of artificial intelligence in modern society.', instruction: '探討人工智能在現代社會的倫理意涵 (2-3分鐘)', targetWords: ['examine', 'ethical', 'implications', 'artificial', 'intelligence', 'modern', 'society', 'moral', 'considerations'], timeLimit: 180, difficulty: 'advanced' },
      { id: 7, section: 'A. 個人演講', type: 'current_affairs', text: 'Analyze how digital technology has transformed human relationships and communication.', instruction: '分析數碼科技如何改變人際關係和溝通 (2-3分鐘)', targetWords: ['analyze', 'digital', 'technology', 'transformed', 'human', 'relationships', 'communication', 'impact'], timeLimit: 180, difficulty: 'advanced' },
      { id: 8, section: 'B. 深度問答', type: 'opinion', text: 'What are the potential risks and benefits of genetic engineering?', instruction: '基因工程的潛在風險和好處是什麼？', targetWords: ['potential', 'risks', 'benefits', 'genetic', 'engineering', 'biotechnology', 'ethical', 'concerns'], difficulty: 'advanced' },
      { id: 9, section: 'B. 深度問答', type: 'current_affairs', text: 'How can society ensure that technological advancement benefits everyone equally?', instruction: '社會如何確保科技進步平等地惠及所有人？', targetWords: ['society', 'ensure', 'technological', 'advancement', 'benefits', 'everyone', 'equally', 'digital', 'divide'], difficulty: 'advanced' },
      { id: 10, section: 'C. 小組辯論', type: 'discussion', text: 'Should there be stricter regulations on social media platforms to protect user privacy and mental health?', instruction: '是否應該對社交媒體平台實施更嚴格的法規以保護用戶隱私和心理健康？', targetWords: ['stricter', 'regulations', 'social', 'media', 'platforms', 'protect', 'privacy', 'mental', 'health'], timeLimit: 600, difficulty: 'advanced' }
    ]
  },
  {
    setId: 3,
    name: "教育改革與未來學習",
    questions: [
      { id: 11, section: 'A. 個人演講', type: 'presentation', text: 'Propose reforms to make the Hong Kong education system more effective for the 21st century.', instruction: '提議改革使香港教育制度更適應21世紀需求 (2-3分鐘)', targetWords: ['propose', 'reforms', 'hong', 'kong', 'education', 'system', 'effective', '21st', 'century'], timeLimit: 180, difficulty: 'advanced' },
      { id: 12, section: 'A. 個人演講', type: 'opinion', text: 'Evaluate the advantages and disadvantages of online learning compared to traditional classroom education.', instruction: '評估網上學習與傳統課堂教育的優缺點 (2-3分鐘)', targetWords: ['evaluate', 'advantages', 'disadvantages', 'online', 'learning', 'traditional', 'classroom', 'education'], timeLimit: 180, difficulty: 'advanced' },
      { id: 13, section: 'B. 深度問答', type: 'opinion', text: 'How can education systems better prepare students for jobs that don\'t exist yet?', instruction: '教育制度如何更好地為學生準備尚未存在的工作？', targetWords: ['education', 'systems', 'prepare', 'students', 'jobs', 'exist', 'future', 'skills'], difficulty: 'advanced' },
      { id: 14, section: 'B. 深度問答', type: 'current_affairs', text: 'What role should critical thinking play in modern education curricula?', instruction: '批判性思維在現代教育課程中應扮演什麼角色？', targetWords: ['critical', 'thinking', 'role', 'modern', 'education', 'curricula', 'analytical', 'skills'], difficulty: 'advanced' },
      { id: 15, section: 'C. 小組辯論', type: 'discussion', text: 'Should academic achievement be the primary measure of student success, or should schools focus more on developing life skills and emotional intelligence?', instruction: '學術成就應該是衡量學生成功的主要標準，還是學校應更注重培養生活技能和情商？', targetWords: ['academic', 'achievement', 'primary', 'measure', 'student', 'success', 'life', 'skills', 'emotional', 'intelligence'], timeLimit: 600, difficulty: 'advanced' }
    ]
  },
  {
    setId: 4,
    name: "文化多元與身份認同",
    questions: [
      { id: 16, section: 'A. 個人演講', type: 'presentation', text: 'Analyze how globalization affects cultural identity and local traditions.', instruction: '分析全球化如何影響文化身份和本土傳統 (2-3分鐘)', targetWords: ['analyze', 'globalization', 'affects', 'cultural', 'identity', 'local', 'traditions', 'preservation'], timeLimit: 180, difficulty: 'advanced' },
      { id: 17, section: 'A. 個人演講', type: 'current_affairs', text: 'Discuss the challenges and opportunities of living in a multicultural society.', instruction: '討論生活在多元文化社會的挑戰和機遇 (2-3分鐘)', targetWords: ['challenges', 'opportunities', 'living', 'multicultural', 'society', 'diversity', 'integration'], timeLimit: 180, difficulty: 'advanced' },
      { id: 18, section: 'B. 深度問答', type: 'opinion', text: 'How can societies promote cultural understanding while maintaining their unique identities?', instruction: '社會如何在保持獨特身份的同時促進文化理解？', targetWords: ['societies', 'promote', 'cultural', 'understanding', 'maintaining', 'unique', 'identities', 'balance'], difficulty: 'advanced' },
      { id: 19, section: 'B. 深度問答', type: 'current_affairs', text: 'What role does language play in preserving cultural heritage?', instruction: '語言在保護文化遺產方面發揮什麼作用？', targetWords: ['language', 'role', 'preserving', 'cultural', 'heritage', 'identity', 'transmission'], difficulty: 'advanced' },
      { id: 20, section: 'C. 小組辯論', type: 'discussion', text: 'Should immigrants be required to fully assimilate into their new country\'s culture, or should multiculturalism be encouraged?', instruction: '移民是否應該完全融入新國家的文化，還是應該鼓勵多元文化主義？', targetWords: ['immigrants', 'required', 'assimilate', 'country', 'culture', 'multiculturalism', 'encouraged', 'integration'], timeLimit: 600, difficulty: 'advanced' }
    ]
  },
  {
    setId: 5,
    name: "領導力與社會參與",
    questions: [
      { id: 21, section: 'A. 個人演講', type: 'presentation', text: 'Define effective leadership in the modern world and explain its key characteristics.', instruction: '定義現代世界的有效領導力並解釋其關鍵特徵 (2-3分鐘)', targetWords: ['define', 'effective', 'leadership', 'modern', 'world', 'explain', 'key', 'characteristics'], timeLimit: 180, difficulty: 'advanced' },
      { id: 22, section: 'A. 個人演講', type: 'personal', text: 'Describe your vision for contributing to society after graduation and explain how you plan to achieve it.', instruction: '描述你畢業後為社會作出貢獻的願景並解釋實現計劃 (2-3分鐘)', targetWords: ['describe', 'vision', 'contributing', 'society', 'graduation', 'explain', 'plan', 'achieve'], timeLimit: 180, difficulty: 'advanced' },
      { id: 23, section: 'B. 深度問答', type: 'opinion', text: 'How can young people become more engaged in civic and political processes?', instruction: '年輕人如何更多地參與公民和政治進程？', targetWords: ['young', 'people', 'engaged', 'civic', 'political', 'processes', 'participation', 'democracy'], difficulty: 'advanced' },
      { id: 24, section: 'B. 深度問答', type: 'current_affairs', text: 'What are the most pressing issues facing Hong Kong youth today, and how should they be addressed?', instruction: '香港青年今天面臨的最緊迫問題是什麼？應該如何解決？', targetWords: ['pressing', 'issues', 'facing', 'hong', 'kong', 'youth', 'today', 'addressed', 'solutions'], difficulty: 'advanced' },
      { id: 25, section: 'C. 小組辯論', type: 'discussion', text: 'Is it the responsibility of individuals or governments to solve social problems? Discuss the balance between personal responsibility and institutional action.', instruction: '解決社會問題是個人還是政府的責任？討論個人責任與制度行動之間的平衡', targetWords: ['responsibility', 'individuals', 'governments', 'solve', 'social', 'problems', 'balance', 'personal', 'institutional', 'action'], timeLimit: 600, difficulty: 'advanced' }
    ]
  },
  {
    setId: 6,
    name: "無人便利店 (Unmanned Convenience Store)",
    dsePartA: {
      title: "Family Mart’s first 'unmanned convenience store' in Japan",
      article: `We paid a visit to a Tokyo convenience store where there's no human clerk to pay.\n\nOn Thursday, Family Mart opened a new branch inside Tokyo Station. It has the sort of food and beverages you'd expect in a Japanese convenience store, but there aren't any employees at the check-out counters. That's because the payments are all done through a slick, unmanned system.\n\nOne difference you'll notice right away is that there's a gate you pass through when entering the shop. As we stepped through, a recorded voice called out, "Irasshaimase!" ("Welcome!")\n\nThe total selection of products isn't quite as wide as it is at some Family Marts, but customers can still get toiletries and face masks.\n\nThere actually is one Family Mart employee on the premises, who only handles shelf-stocking and customer inquiries. When we walked up to the check-out counters with our purchases, no human cashier was present. We didn't even have to scan anything. The terminal already knew what we had in our hand to buy and it made an electronic beep to draw our attention to the screen, where the total amount to be paid was displayed. You can pay with an e-money card, credit card or cash.\n\nOh, and by the way, there's also a gate you have to pass through in order to leave the store, and if you have an unpaid bill, it won't open up until you settle your account.`,
      discussionPoints: [
        "the benefits of unmanned convenience stores",
        "the limitations of unmanned convenience stores",
        "whether unmanned convenience stores are a good idea for Hong Kong",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 26, section: 'B. Individual Response', type: 'question', text: 'Do you often shop at convenience stores?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 27, section: 'B. Individual Response', type: 'question', text: 'What do people usually buy at a convenience store?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 28, section: 'B. Individual Response', type: 'question', text: 'Do you prefer self-checkout or paying at the cashier?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 29, section: 'B. Individual Response', type: 'question', text: 'Is customer service important to you when shopping?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 30, section: 'B. Individual Response', type: 'question', text: 'Do you think there will be more theft in unmanned stores?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 31, section: 'B. Individual Response', type: 'question', text: 'Would you find shopping at an unmanned store too impersonal?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 32, section: 'B. Individual Response', type: 'question', text: 'Do you think the trend of unmanned stores will continue to grow?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 33, section: 'B. Individual Response', type: 'question', text: 'Do you think automation is making life too convenient?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 7,
    name: "戲院與串流服務 (Cinemas vs Movie Streaming)",
    dsePartA: {
      title: "Cinemas vs Movie Streaming Services",
      article: `Technology is changing the way young people consume entertainment. Many youngsters are choosing to use online movie streaming services instead of going to the cinema to watch films.\n\nThe popularity of streaming services such as Netflix, Disney Plus, and Apple TV further increased during the COVID pandemic because cinemas were shut down everywhere. Now, more than 200 million people use Netflix to watch movies and TV shows. This is due to four main advantages it has over cinemas.\n\n1. You can choose from thousands of movies and TV shows to watch.\n2. The monthly price of Netflix is cheaper than one movie ticket.\n3. There is original content on Netflix you cannot watch in cinemas.\n4. You can watch movies anywhere on your phone and laptop.\n\nA study also shows that after joining Netflix, 30% of people go to cinemas less often and 15% of them don't go to cinemas anymore. While this is good news for movie streaming services, cinemas are closing down due to a lack of demand, and a number of the biggest cinema chains around the world have filed for bankruptcy.\n\nThis brings up the question: Is this the end of cinemas?`,
      discussionPoints: [
        "whether going to cinemas is a popular pastime in Hong Kong",
        "what cinemas can do to compete with movie streaming services",
        "any disadvantages of movie streaming services",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 34, section: 'B. Individual Response', type: 'question', text: 'Do you like watching movies?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 35, section: 'B. Individual Response', type: 'question', text: 'Do you go to the cinema often?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 36, section: 'B. Individual Response', type: 'question', text: 'Which do you prefer: watching a movie in the cinema or at home?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 37, section: 'B. Individual Response', type: 'question', text: 'Would you pay for a movie streaming service?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 38, section: 'B. Individual Response', type: 'question', text: 'What can people learn from watching movies?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 39, section: 'B. Individual Response', type: 'question', text: 'What is your most memorable experience of going to the cinema?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 40, section: 'B. Individual Response', type: 'question', text: 'Do you think movie streaming services make people less social?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 41, section: 'B. Individual Response', type: 'question', text: 'Do you think movie streaming services will eventually replace cinemas?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 8,
    name: "植物性肉類 (Plant-based meats)",
    dsePartA: {
      title: "Plant-based meats",
      article: `Impossible Foods and OmniFoods are two of the best-known names in Hong Kong offering plant-based fake meat. While you're more likely to have seen them on the menus of Western restaurants, both brands have taken a step into traditional Chinese cooking, creating plant-based tasting menus at Chinese fine dining restaurants.\n\nChef Tsang is a restaurant industry veteran who works at Ming Court, a Michelin-starred restaurant on Hong Kong Island. "Meat is indispensable in Chinese cuisine and fresh pork is the soul of Cantonese cuisine. But the arrival of plant-based meat offers vegetarian options to diners and encourages them to make diet changes."\n\nThe rise of vegetarianism, increasing concerns about health and the very real threat of climate change have inspired the chefs in the restaurant to provide more vegetarian options to diners. They would also like to demonstrate how plant-based meat can be used in Cantonese cuisine – including Cantonese fine-dining – and make it just as delicious.\n\nChef Tsang has started experimenting with the new OmniSeafood series. "The Omni Classic Fillet from the OmniSeafood series can be used in most of the traditional dishes in Cantonese cuisine. One of our popular dishes is Fried Omni Classic Fillet, Kung Po style."`,
      discussionPoints: [
        "why plant-based meats are gaining popularity",
        "whether your school should encourage students to take up a vegetarian diet",
        "whether people will eat less meat in the future",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 42, section: 'B. Individual Response', type: 'question', text: 'Do you prefer meat or vegetables?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 43, section: 'B. Individual Response', type: 'question', text: 'Have you been to a vegetarian restaurant?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 44, section: 'B. Individual Response', type: 'question', text: 'Do most teenagers eat healthily?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 45, section: 'B. Individual Response', type: 'question', text: 'Do you think you could only eat vegetarian food?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 46, section: 'B. Individual Response', type: 'question', text: 'Why is it difficult for people to change their eating habits?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 47, section: 'B. Individual Response', type: 'question', text: 'How could vegetarianism be promoted in Hong Kong?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 48, section: 'B. Individual Response', type: 'question', text: 'Do you think the combination of fine dining and fake-meat will be successful?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 49, section: 'B. Individual Response', type: 'question', text: 'Do you agree that meat is essential in Chinese cuisine?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 9,
    name: "夜貓子 (Night Owls)",
    dsePartA: {
      title: "Night Owls",
      article: `‘Night owls’ are people who are naturally more awake and active at night and tend to go to bed late. Research has found that night owls face higher rates of poor health, including having a 10 percent higher risk of dying younger than 'early birds' or people who get up early and feel more energetic first thing in the day. Night owls often suffer from long-term lack of sleep, and this can increase the chance of diabetes, heart disease and obesity. Not having enough sleep even for just one night can make us moody; when it happens every single night for an extended period, depression can develop.\n\nAssociate professor Kristen Knutson at Northwestern University said: "This is a public health issue that cannot be ignored. We need to recognise that people have different body clocks which regulate the time we feel sleepy and wakeful throughout the day. Some people naturally wake up early while others feel more awake at night. All of this comes down to a combination of genes and the person's environment."\n\nEmployers can benefit from adjusting start times to suit individual employees' needs. Another study found that when companies let night owls start work later in the day or allowed them to work from home, there was an estimated US$277m gain in productivity. It argues that people who are more awake at night should be allowed to start and finish work later. Not everyone is suited to get up for an 8am start.`,
      discussionPoints: [
        "the advantages of being a night owl",
        "the advantages of getting up early",
        "whether companies should have flexible working hours for people with different sleeping patterns",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 50, section: 'B. Individual Response', type: 'question', text: 'Do you wake up early on weekends?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 51, section: 'B. Individual Response', type: 'question', text: 'Do you often have problems waking up in the morning?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 52, section: 'B. Individual Response', type: 'question', text: 'Do you often fall asleep?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 53, section: 'B. Individual Response', type: 'question', text: 'What do you do to keep yourself awake when you are sleepy?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 54, section: 'B. Individual Response', type: 'question', text: 'Have you ever overslept for something important?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 55, section: 'B. Individual Response', type: 'question', text: 'What time of the day are you most productive?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 56, section: 'B. Individual Response', type: 'question', text: 'Would you consider a job that requires working at night?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 57, section: 'B. Individual Response', type: 'question', text: 'Do you envy people who only need a few hours of sleep?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 10,
    name: "師生社交媒體關係 (Teachers & Students on Social Media)",
    dsePartA: {
      title: "Should teachers and students be friends on social media?",
      article: `A majority of teens are online and most of them use social networking apps such as Facebook, Twitter, Instagram and Snapchat. This makes social media a convenient way for teachers to connect with students. Some teachers think that as Instagram is what most teenagers use these days, it is a good idea for teachers to connect with students in this way to maintain their interest. Some parents agree that this allows teachers to be leaders and role models for their students online.\n\nBut at the same time, students should learn to know the difference between personal and professional communication. At school, students do not talk to their teachers as if they were friends, so when interacting with teachers on social media, the line between personal and professional communication is less clear. Therefore, it is recommended that students should not talk to their teachers like their friends on Instagram. Otherwise, they may cross the line.\n\nRecently, a number of parents have also complained about seeing teachers wearing swimsuits and gym clothes on their Instagram accounts. These parents claimed the photos were inappropriate. In order to avoid such problems and complaints, some schools are proposing a new policy not to allow teachers and students to be friends on social media.`,
      discussionPoints: [
        "why students like to connect with teachers on social media",
        "problems with connecting with teachers on social media",
        "whether you agree with the proposed policy",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 58, section: 'B. Individual Response', type: 'question', text: 'What do you like to share on social media?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 59, section: 'B. Individual Response', type: 'question', text: 'Do young people spend too much time on social media?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 60, section: 'B. Individual Response', type: 'question', text: 'Do you think many Hong Kong teachers are active on social media?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 61, section: 'B. Individual Response', type: 'question', text: 'Why do you think Instagram is so popular?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 62, section: 'B. Individual Response', type: 'question', text: 'Should schools teach students how to use social media safely?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 63, section: 'B. Individual Response', type: 'question', text: "Should parents monitor their children's friends on social media?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 64, section: 'B. Individual Response', type: 'question', text: 'Does social media negatively affect your learning?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 65, section: 'B. Individual Response', type: 'question', text: "Should schools monitor their students' social media activities?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 11,
    name: "畢業慶祝活動 (Graduation ideas)",
    dsePartA: {
      title: "Graduation ideas",
      article: `This advertisement for local entertainment appeared on a webpage:\n\n**Helicopter ride**\nScenic flights take off from the roof of the iconic Peninsula Hotel, allowing guests to take in the unbeatable aerial view of the world famous Victoria Harbour, marvel at the rock formations of the Geopark and cruise over the beaches and bays of Hong Kong Island. As night falls, catch Hong Kong's famous laser light show, Symphony of Lights, on your return.\n\n**Cooking lessons with a celebrity chef**\nTake your cooking skills to the next level with a local celebrity chef. Join a Michelin-starred chef in a Hong Kong restaurant to learn the techniques that have brought them fame and fortune. The chef will teach you everything from buying the freshest ingredients to creating unforgettable dishes. Then enjoy seriously good food at the ultimate dinner party.\n\n**Zip line across Hong Kong**\nIf hanging off rocks and flying over the water is your style, nothing beats a day of zip-lining with Hong Kong's spectacular scenery as a backdrop. Your journey begins with a trek through rocks, historical relics, and lush greenery to reach the site. Don't worry: experienced local zip-lining guides will brief you on the safety instructions before you make the leap. And once you do, well, keep your eyes open – it's a fun ride to the other side!`,
      discussionPoints: [
        "what to consider when planning a graduation celebration",
        "whether any of the above activities are suitable",
        "how else you might celebrate your graduation",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 66, section: 'B. Individual Response', type: 'question', text: 'Would you like to go on a helicopter ride?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 67, section: 'B. Individual Response', type: 'question', text: 'Would you like your teachers to attend your graduation celebration?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 68, section: 'B. Individual Response', type: 'question', text: 'What is the best way to celebrate something?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 69, section: 'B. Individual Response', type: 'question', text: 'How do students usually celebrate graduation in Hong Kong?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 70, section: 'B. Individual Response', type: 'question', text: 'Would you like your graduation celebration to be held outdoors?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 71, section: 'B. Individual Response', type: 'question', text: 'Which do you prefer: a big celebration or a small one?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 72, section: 'B. Individual Response', type: 'question', text: 'Would you like to be on the school graduation organising committee?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 73, section: 'B. Individual Response', type: 'question', text: 'Is a graduation celebration meaningful to you?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 12,
    name: "疫情與時裝業 (Pandemic & Fashion Industry)",
    dsePartA: {
      title: "How the pandemic has redefined the fashion industry",
      article: `This article appeared in a fashion blog:\n\nCOVID-19 has upended many norms and one of its top victims has been the fashion industry.\n\nA survey queried 1,843 Americans on how the pandemic has impacted their relationship with fashion trends and clothing. While one-third of Americans did not buy any new clothing during the COVID-19 lockdown, retail clothing businesses have actually seen an increase in sales since March 2020.\n\nShoppers are shopping for various reasons but a universal trend is that Americans are mostly shopping for more comfortable clothes to fit the remote work lifestyle.\n\nThe survey found that more than half of people (61%) are reaching for sweats, yoga pants and more casual clothing. Not only that, but nearly 40% have lowered their standards of what's 'acceptable' to wear since lockdown began.\n\nSocial media has also played a big role in revolutionizing fashion since early 2020. Tiktok, Instagram, and YouTube have influenced fashion choices. One-third of respondents said they have purchased clothing seen on social media during the last year.\n\nSince people have been working from home, offices no longer require workers to wear a 'professional outfit'. More than 20% of survey respondents said they won't return to how they dressed before the pandemic. Spending more time at home for work and entertainment has given more people the freedom to express themselves and get more experimental with fashion.`,
      discussionPoints: [
        "how the pandemic has changed the way people dress",
        "how the pandemic has changed the way people shop for clothes",
        "how the fashion industry can cater for these changes",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 74, section: 'B. Individual Response', type: 'question', text: 'Do you like fashion?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 75, section: 'B. Individual Response', type: 'question', text: 'Do you like shopping for clothes?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 76, section: 'B. Individual Response', type: 'question', text: 'Do you dress differently at home when compared to going out?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 77, section: 'B. Individual Response', type: 'question', text: 'Do you prefer shopping for clothes in stores or online?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 78, section: 'B. Individual Response', type: 'question', text: 'Do Hong Kong teens like to follow fashion trends?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 79, section: 'B. Individual Response', type: 'question', text: 'Where do people get their inspiration for fashion?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 80, section: 'B. Individual Response', type: 'question', text: 'Which is more important to you when you buy clothes: comfort or how they look?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 81, section: 'B. Individual Response', type: 'question', text: 'Do you think keeping up with fashion trends is a waste of money?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 13,
    name: "做家務的價值 (The value of doing chores)",
    dsePartA: {
      title: "The value of doing chores",
      article: `This article appeared in a local newspaper:\n\nOne of the traditions of Japanese education is that students do soji (cleaning). Soji starts after lunch and lasts for about 20 minutes. This happens four times a week and, on the last day of each semester, there is a longer cleaning session called o-soji (big cleaning).\n\nDuring the entire cleaning time, the public announcement system blasts cheerful marching music. Every class is responsible for cleaning its own classroom and two other places in the school.\n\nThrough cleaning, children develop values such as responsibility, cooperation and discipline.\n\nSimilarly, research shows that when children help out with home duties or chores, they actually do better in school, and are more thoughtful and considerate. Even if they are asked to be responsible for only a certain area, like their own bedroom, they show more consideration to other family members and are less likely to mess up other areas.\n\nChildren who participate in everyday responsibilities are also found to be more positive and have a stronger sense of self-worth. Interestingly, the effects are comparable to those of playing with friends.\n\nWhen children are contributing, they feel needed and bonded to the family. They see that they have an important role to play, and consideration and helpfulness become second nature to them.`,
      discussionPoints: [
        "benefits of adding cleaning sessions to the timetable",
        "possible problems of requiring students to clean the school",
        "cleaning tasks that are suitable for different forms",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 82, section: 'B. Individual Response', type: 'question', text: 'Do you like doing housework?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 83, section: 'B. Individual Response', type: 'question', text: 'Do you help out with housework?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 84, section: 'B. Individual Response', type: 'question', text: 'What can be done to make cleaning less boring?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 85, section: 'B. Individual Response', type: 'question', text: 'How can parents motivate their children to do housework?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 86, section: 'B. Individual Response', type: 'question', text: 'Do you agree that teenagers are messier than adults?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 87, section: 'B. Individual Response', type: 'question', text: 'Do you agree that housework can bring family members closer?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 88, section: 'B. Individual Response', type: 'question', text: 'Should cleaning staff receive more respect in society?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 89, section: 'B. Individual Response', type: 'question', text: 'Will technology change housework in the future?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 14,
    name: "園藝治療 (Gardening as healing)",
    dsePartA: {
      title: "Gardening becomes a way of healing",
      article: `This article appeared in a newspaper:\n\nHorticultural therapy is a professional practice that uses plants and gardening to improve mental and physical health. A horticultural therapist works with any group that can benefit from interaction with plants, including children, the elderly and those dealing with addiction and mental health problems.\n\n"I was suffering from depression which seriously affected my life," Mary Wright, a patient at a mental health centre, said. "One day, I was asked, 'Can you do flower arranging? Can you water and take care of plants?' I said, 'Well, I'll try it.'"\n\n"It was exactly the help I needed," she said. "When I'm touching a plant, it's a very calming experience. It helped me get better."\n\nMany studies have found that just being in nature – such as taking a walk through a garden, a park or a forest – can improve not only your state of mind but your blood pressure, your heart rate and your stress levels and, over time, can lead to a longer life.\n\nStudies have also found that horticultural therapy supports recovery and improves mood, resulting in shorter stays for patients at hospitals and mental health facilities.`,
      discussionPoints: [
        "what benefits growing plants can bring to students and the school",
        "whether growing plants will be popular among students",
        "what other activities can help promote students' well-being",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 90, section: 'B. Individual Response', type: 'question', text: 'Do you like going to country parks?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 91, section: 'B. Individual Response', type: 'question', text: 'Do you like gardening?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 92, section: 'B. Individual Response', type: 'question', text: 'Do more young people or older people enjoy caring for plants?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 93, section: 'B. Individual Response', type: 'question', text: 'Are there enough green spaces in Hong Kong?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 94, section: 'B. Individual Response', type: 'question', text: 'Is gardening a popular hobby in Hong Kong?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 95, section: 'B. Individual Response', type: 'question', text: 'Do you prefer caring for plants or keeping a pet?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 96, section: 'B. Individual Response', type: 'question', text: 'Should there be plants in the work environment?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 97, section: 'B. Individual Response', type: 'question', text: 'Which do you prefer: real or artificial plants?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 15,
    name: "穿戴式智能裝置 (Wearable smart devices)",
    dsePartA: {
      title: "Wearable smart devices are here!",
      article: `This article appeared on a business website:\n\nWearable smart devices, commonly known as wearables, have become popular over the last ten years. Smartwatches like the Apple Watch are likely the best-known ones. But there are many other kinds of new smart devices you can wear on your body now, including clothing and jewellery. Let's take a look at two of them.\n\nSmart Ring. The most common kind of smart jewellery might be the smart ring. Smart rings are worn on the finger like regular rings. But they can collect health-tracking data for the users and allow them to review it on a smartphone later. Compared to a smartwatch, the smart ring is less distracting since it cannot receive messages and can only track the user's health. And if you don't like rings, there are also smart bracelets created by well-known fashion brands.\n\nSmart Clothing. By covering a large amount of a user's body, smart clothing can provide more information than other wearable devices. It allows for better medical care and lifestyle improvement. For example, there are smart shirts capable of diagnosing respiratory diseases, smart shoes that monitor running performance, smart yoga pants that vibrate to improve form during exercises, and smart swimsuits that alert the user to apply sunscreen. A luxury brand also added location-tracking to its jeans to track how frequently the customer wore them, so that the brand can reward frequent wearers with more of its products.`,
      discussionPoints: [
        "why wearable smart devices are becoming popular",
        "the disadvantages of wearable smart devices",
        "whether wearable smart devices should be allowed at school",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 98, section: 'B. Individual Response', type: 'question', text: 'Do you or your friends have a wearable smart device?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 99, section: 'B. Individual Response', type: 'question', text: 'Would you buy a wearable smart device?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 100, section: 'B. Individual Response', type: 'question', text: 'Do you prefer a smart watch or a smart ring?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 101, section: 'B. Individual Response', type: 'question', text: 'Do you think wearable smart devices are a waste of money?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 102, section: 'B. Individual Response', type: 'question', text: 'Do you think there are too many smart devices in our lives?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 103, section: 'B. Individual Response', type: 'question', text: 'Are wearable smart devices fashionable?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 104, section: 'B. Individual Response', type: 'question', text: 'Can using wearable smart devices help us become healthier?', instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 105, section: 'B. Individual Response', type: 'question', text: "Would you be concerned about privacy if you wore a wearable smart device?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 16,
    name: "Adaptability quotient (AQ)",
    dsePartA: {
      title: "Adaptability quotient",
      article: `We are all familiar with IQ (intelligence quotient) and EQ (emotional quotient). Adding to these two Qs is a new one: AQ. AQ stands for adaptability quotient. It is the ability to learn, adjust, and change to new situations or circumstances. People with high AQ can work in a variety of environments and succeed in times of change and uncertainty.

Technology is changing our world every day and requires us to learn and re-invent ourselves again and again, faster and faster. The good news is that AQ is something we can train and develop:

Change your routine
Seek or create opportunities for change. Doing the same thing is comfortable, but we can easily become too lazy to leave our comfort zone. Instead of staying home for the weekend again, reconnect with your old friends. Rather than robotically walking down the same street, take different paths.

Keep learning
Learn a new skill every now and then. Learning requires active thinking, careful planning, constant adjustment and strong commitment. Anything new will train you to be always up for challenges.

Be curious and observant
Watch and learn from others. They can be successful people you read about in books or your friends and family. Pay attention to how and why people make important decisions in life. The more you think from different people's perspectives, the more open you will be to different ideas.`,
      discussionPoints: [
        "why being adaptable is becoming more important nowadays",
        "whether being adaptable is more important than being intelligent",
        "whether it is possible to teach adaptability",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 106, section: 'B. Individual Response', type: 'question', text: "Do you like trying new things?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 107, section: 'B. Individual Response', type: 'question', text: "Can you adapt to new environments quickly?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 108, section: 'B. Individual Response', type: 'question', text: "Do you think having new experiences is important?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 109, section: 'B. Individual Response', type: 'question', text: "Are Hong Kong students adaptable?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 110, section: 'B. Individual Response', type: 'question', text: "Are young people better at coping with change than older people?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 111, section: 'B. Individual Response', type: 'question', text: "Do you think change is always good?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 112, section: 'B. Individual Response', type: 'question', text: "Do you consider yourself a risk taker?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 113, section: 'B. Individual Response', type: 'question', text: "Why are some people more adaptable than others?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 17,
    name: "社交媒體正能量 (Social Media Positivity)",
    dsePartA: {
      title: "How to use social media to spread positivity",
      article: `Social media has taken the sharing of knowledge to an entirely new level, but we face so much information we often don't know what to do with it. Here are some ways to reduce the impact of social media on your mental health and help you use social media to spread positivity instead.

1. Be intentional about using social media.
When you show up to use a social media platform, such as Instagram, ask yourself, 'Why am I here?' If you don't have any need to be on that platform then, close the app.

2. Filter the noise.
Go through your feeds and delete anyone who isn't contributing to a positive environment. You can't change the way people act but you can change your experience using these platforms quite easily.

3. Don't use it to fill time and space.
If you are using social media to kill time, you might want to ask yourself why. Why do I have to be entertained every second of the day? There's nothing wrong with being bored standing in line.

4. Remove yourself from the negativity.
At the end of the day, if you feel like you can't handle it or social media is really impacting your happiness in a negative way, it might be a better idea to remove yourself from it entirely. You might be surprised by how little you miss it after a while. You can always come back to social media when you feel like you are ready to be there again.`,
      discussionPoints: [
        "what kind of people are popular on social media",
        "the negative effects of social media on users",
        "what the club can do to help promote better social media habits",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 114, section: 'B. Individual Response', type: 'question', text: "Do you use social media?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 115, section: 'B. Individual Response', type: 'question', text: "Would you like to be popular on social media?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 116, section: 'B. Individual Response', type: 'question', text: "How do you feel when someone 'likes' your social media posts?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 117, section: 'B. Individual Response', type: 'question', text: "Do social media posts show someone's real life?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 118, section: 'B. Individual Response', type: 'question', text: "Do people become addicted to social media?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 119, section: 'B. Individual Response', type: 'question', text: "How do you control your use of social media?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 120, section: 'B. Individual Response', type: 'question', text: "Do you agree there is a lack of compassion on social media?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 121, section: 'B. Individual Response', type: 'question', text: "Does social media impact people's self-esteem?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 18,
    name: "基因尋根 (DNA tests for family history)",
    dsePartA: {
      title: "Searching for family history drives Chinese to DNA tests",
      article: `With a growing middle class, an increasing number of people are now keen on finding their roots in China. DNA testing kits are now widely available – users simply use the kit, follow the instructions and mail a sample of their DNA back. Within a week, a digital report returns, showing the origin of their DNA.

"I was curious about my family history. I wanted to know who I am and where I came from," Miao, a Chinese executive who recently used the service, said. "Since I grew up in the south, I was quite certain that I'm a southern Han."

But when results of the test came back, Miao was shocked. She had 60% Manchurian ethnicity – a north-eastern group. This then led to a search of her grandmother's surname, which revealed that her great-great-great-grandparents were actually from the Red Banner – a royal family group in Manchu society during the Qing dynasty. In the process, she also reconnected with a few distant relatives she never knew existed.

"The DNA test was such a good experience that I've just bought another DNA testing kit. This one can reveal your personality," Miao said. The kit she referred to claims to be able to detect personality traits in the genes, like whether the user is outgoing or shy, optimistic or pessimistic. "Who knows what I'll find out about myself!"`,
      discussionPoints: [
        "why people want to know about their family history",
        "whether there are any disadvantages to DNA testing",
        "other ways to find out about your family history",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 122, section: 'B. Individual Response', type: 'question', text: "Are you interested in your family's history?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 123, section: 'B. Individual Response', type: 'question', text: "Do you often visit your relatives?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 124, section: 'B. Individual Response', type: 'question', text: "Do you feel closer to your relatives or your friends?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 125, section: 'B. Individual Response', type: 'question', text: "How can you keep a record of important family events?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 126, section: 'B. Individual Response', type: 'question', text: "How would you feel if you found out you were related to someone famous?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 127, section: 'B. Individual Response', type: 'question', text: "Do you think young people know much about their family history?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 128, section: 'B. Individual Response', type: 'question', text: "Would you be interested in taking a DNA test?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 129, section: 'B. Individual Response', type: 'question', text: "Is personality more affected by DNA or our environment?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 19,
    name: "Carousell 網上買賣平台 (Carousell Marketplace)",
    dsePartA: {
      title: "Carousell",
      article: `Carousell is one of Singapore's most well-known startup companies, a platform on which users can buy and sell new and secondhand goods.

It has come a long way since 2012, when the startup was awarded $7,000 to develop a mobile-based marketplace app. Today, it's present in seven markets and valued at US$1.1 billion.

Carousell was founded by three university friends – Quek Siu Rui, Marcus Tan and Lucas Ngoo. The trio wanted to build an app that would help to declutter the mountain of stuff they'd accumulated. The idea was to build a mobile-first version of US-based classifieds platforms like eBay and Craigslist. They were guided by a simple question: how can we reduce the time it takes to list a product?

For decades, when newspapers dominated the classifieds business, it would take a few days for an ad to show up in the papers. Then came the internet. Online classifieds like Craigslist cut that time to 30 minutes. You'd take a picture with a camera, transfer the file to a computer, connect to the internet and upload the listing.

As smartphones began to hit mass adoption, the founders aimed to build an app that allowed users to upload a listing for secondhand electronics, fashion, even cars and property. All within seconds. Snap, list, sell.`,
      discussionPoints: [
        "the benefits of buying and selling products online",
        "how to organise the donations for uploading to Carousell",
        "any problems which might occur from selling products online",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 130, section: 'B. Individual Response', type: 'question', text: "Do you buy things online?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 131, section: 'B. Individual Response', type: 'question', text: "Do many people sell things online in Hong Kong?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 132, section: 'B. Individual Response', type: 'question', text: "Could selling things online become a full-time job?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 133, section: 'B. Individual Response', type: 'question', text: "Would you like to start your own business?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 134, section: 'B. Individual Response', type: 'question', text: "Will more jobs involve the internet in the future?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 135, section: 'B. Individual Response', type: 'question', text: "What are the difficulties of owning your own business?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 136, section: 'B. Individual Response', type: 'question', text: "What advice would you give someone starting his or her own business?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 137, section: 'B. Individual Response', type: 'question', text: "What qualities make someone a good entrepreneur?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  },
  {
    setId: 20,
    name: "網上健身班 (Online Fitness Classes)",
    dsePartA: {
      title: "24 FitnessHK",
      article: `With coronavirus keeping people indoors and away from sports and gyms, obesity is on the rise and so are health risks caused by an inactive lifestyle. But no need to worry, because 24 FitnessHK is bringing the workouts and personal trainers to your home!

24 FitnessHK is now offering online yoga classes to all its members!

From this month onwards, we are offering all our members online yoga classes held by some of our most experienced yoga teachers and senior personal trainers. You can learn and do yoga with these experts from the comfort of your home. All you need is a laptop or a mobile phone with a camera.

Meet the community!
Humans are social animals and need to socialise even when we are social distancing. Once you subscribe to this package, you can attend these yoga classes with your fellow fitness enthusiasts. You can talk and interact with them through the chat function on our mobile app to share your fitness journey.

Amazing value for money package!

- 10 online yoga classes for only $2000
- Includes a limited-edition yoga mat, and a 24 FitnessHK towel and water bottle

What are you waiting for? Join now!`,
      discussionPoints: [
        "advantages of online fitness classes",
        "things to consider when choosing an online fitness class",
        "whether online fitness classes will continue to be popular",
        "anything else you think is important",
      ]
    },
    questions: [
      { id: 138, section: 'B. Individual Response', type: 'question', text: "Have you attended any online fitness classes?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 139, section: 'B. Individual Response', type: 'question', text: "Do you think you are an active person?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 140, section: 'B. Individual Response', type: 'question', text: "Are there any disadvantages of online fitness classes?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 141, section: 'B. Individual Response', type: 'question', text: "Should yoga be taught in school?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 142, section: 'B. Individual Response', type: 'question', text: "Do you prefer to exercise alone or in a group?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 143, section: 'B. Individual Response', type: 'question', text: "Is going to the gym popular nowadays?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 144, section: 'B. Individual Response', type: 'question', text: "Is Hong Kong becoming a healthier society?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
      { id: 145, section: 'B. Individual Response', type: 'question', text: "Why are some people obsessed with doing exercise?", instruction: '請回答問題', targetWords: [], difficulty: 'advanced' },
    ]
  }
];

// Export function to get questions by grade
export function getQuestionsForGrade(grade: string): QuestionSet[] {
  switch (grade) {
    case 'K1': return K1_QUESTIONS;
    case 'P1': return P1_QUESTIONS;
    case 'P3': return P3_QUESTIONS;
    case 'S1': return S1_QUESTIONS;
    case 'S6': return S6_QUESTIONS;
    default: return P3_QUESTIONS;
  }
}

// Get random question set for a grade
export function getRandomQuestionSet(grade: string): Question[] {
  const questionSets = getQuestionsForGrade(grade);
  const randomSet = questionSets[Math.floor(Math.random() * questionSets.length)];
  return randomSet.questions;
}
