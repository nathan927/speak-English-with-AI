
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

