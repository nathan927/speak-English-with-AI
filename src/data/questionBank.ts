
export interface Question {
  id: string;
  grade: string;
  title: string;
  content: string;
  keywords?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export const questionBank: Question[] = [
  // K1 幼稚園題目
  {
    id: 'k1-1',
    grade: 'K1',
    title: '我的家人',
    content: '請說說你的家人。你家裡有誰？他們平常會做什麼？你最喜歡和誰一起玩？',
    keywords: ['家人', '父母', '兄弟姊妹', '祖父母'],
    difficulty: 'easy',
    tags: ['family', 'daily-life']
  },
  {
    id: 'k1-2',
    grade: 'K1',
    title: '我最喜歡的玩具',
    content: '你最喜歡什麼玩具？為什麼喜歡它？你會怎樣和這個玩具一起玩？',
    keywords: ['玩具', '遊戲', '樂趣'],
    difficulty: 'easy',
    tags: ['toys', 'play']
  },
  {
    id: 'k1-3',
    grade: 'K1',
    title: '動物朋友',
    content: '你最喜歡什麼動物？它長什麼樣子？它會做什麼？你想和它做朋友嗎？',
    keywords: ['動物', '外表', '行為'],
    difficulty: 'easy',
    tags: ['animals', 'nature']
  },
  {
    id: 'k1-4',
    grade: 'K1',
    title: '我的一天',
    content: '請說說你今天做了什麼？從起床到現在，你都做了哪些事情？',
    keywords: ['日常生活', '活動', '時間'],
    difficulty: 'easy',
    tags: ['daily-routine']
  },
  {
    id: 'k1-5',
    grade: 'K1',
    title: '顏色世界',
    content: '你最喜歡什麼顏色？你能說出一些這個顏色的東西嗎？',
    keywords: ['顏色', '物品', '描述'],
    difficulty: 'easy',
    tags: ['colors', 'description']
  },

  // K2 幼稚園題目
  {
    id: 'k2-1',
    grade: 'K2',
    title: '我的學校',
    content: '請介紹你的學校。學校裡有什麼地方？你最喜歡學校的哪個地方？為什麼？',
    keywords: ['學校', '教室', '操場', '圖書館'],
    difficulty: 'easy',
    tags: ['school', 'education']
  },
  {
    id: 'k2-2',
    grade: 'K2',
    title: '我的朋友',
    content: '你有好朋友嗎？你的好朋友是誰？你們會一起做什麼？',
    keywords: ['朋友', '友誼', '遊戲'],
    difficulty: 'easy',
    tags: ['friendship', 'social']
  },
  {
    id: 'k2-3',
    grade: 'K2',
    title: '我喜歡的食物',
    content: '你最喜歡吃什麼？它是什麼味道的？誰會煮給你吃？',
    keywords: ['食物', '味道', '烹飪'],
    difficulty: 'easy',
    tags: ['food', 'taste']
  },
  {
    id: 'k2-4',
    grade: 'K2',
    title: '季節變化',
    content: '現在是什麼季節？這個季節有什麼特別的地方？你喜歡這個季節嗎？',
    keywords: ['季節', '天氣', '變化'],
    difficulty: 'easy',
    tags: ['seasons', 'weather']
  },
  {
    id: 'k2-5',
    grade: 'K2',
    title: '我的房間',
    content: '請描述你的房間。房間裡有什麼東西？你最喜歡房間裡的什麼？',
    keywords: ['房間', '家具', '物品'],
    difficulty: 'easy',
    tags: ['home', 'personal-space']
  },

  // K3 幼稚園題目
  {
    id: 'k3-1',
    grade: 'K3',
    title: '我長大後想做什麼',
    content: '你長大後想做什麼工作？為什麼想做這個工作？你覺得這個工作需要做什麼？',
    keywords: ['職業', '夢想', '工作'],
    difficulty: 'easy',
    tags: ['career', 'dreams']
  },
  {
    id: 'k3-2',
    grade: 'K3',
    title: '特別的一天',
    content: '請說說一個特別的日子，比如生日或節日。那天發生了什麼特別的事？',
    keywords: ['節日', '慶祝', '記憶'],
    difficulty: 'easy',
    tags: ['celebrations', 'memories']
  },
  {
    id: 'k3-3',
    grade: 'K3',
    title: '我的社區',
    content: '你住的地方附近有什麼？有商店、公園或其他地方嗎？你最常去哪裡？',
    keywords: ['社區', '鄰里', '公共設施'],
    difficulty: 'easy',
    tags: ['community', 'neighborhood']
  },
  {
    id: 'k3-4',
    grade: 'K3',
    title: '幫助別人',
    content: '你有沒有幫助過別人？你是怎樣幫助的？幫助別人的時候你有什麼感覺？',
    keywords: ['幫助', '善良', '感受'],
    difficulty: 'easy',
    tags: ['helping', 'kindness']
  },
  {
    id: 'k3-5',
    grade: 'K3',
    title: '我的興趣',
    content: '你平常喜歡做什麼？為什麼喜歡這些活動？你是怎樣學會的？',
    keywords: ['興趣', '愛好', '學習'],
    difficulty: 'easy',
    tags: ['hobbies', 'interests']
  },

  // P1 小學題目
  {
    id: 'p1-1',
    grade: 'P1',
    title: '我的新學期',
    content: '你剛開始小學生活，有什麼新的體驗？和幼稚園有什麼不同？你最期待什麼？',
    keywords: ['小學', '新體驗', '學習'],
    difficulty: 'easy',
    tags: ['school-transition', 'new-experiences']
  },
  {
    id: 'p1-2',
    grade: 'P1',
    title: '我學會的新技能',
    content: '最近你學會了什麼新的技能？是怎樣學會的？學會後你有什麼感覺？',
    keywords: ['技能', '學習', '成就感'],
    difficulty: 'easy',
    tags: ['skills', 'learning']
  },
  {
    id: 'p1-3',
    grade: 'P1',
    title: '我的老師',
    content: '請介紹你的老師。老師是什麼樣的人？老師教你什麼？你喜歡你的老師嗎？',
    keywords: ['老師', '教學', '師生關係'],
    difficulty: 'easy',
    tags: ['teachers', 'education']
  },
  {
    id: 'p1-4',
    grade: 'P1',
    title: '我的課外活動',
    content: '除了上課，你還會參加什麼活動？你最喜歡哪個活動？為什麼？',
    keywords: ['課外活動', '興趣班', '運動'],
    difficulty: 'easy',
    tags: ['activities', 'sports']
  },
  {
    id: 'p1-5',
    grade: 'P1',
    title: '我讀過的故事書',
    content: '你最近讀了什麼故事書？故事講什麼？你最喜歡故事裡的誰？',
    keywords: ['閱讀', '故事', '角色'],
    difficulty: 'easy',
    tags: ['reading', 'stories']
  },

  // P2 小學題目
  {
    id: 'p2-1',
    grade: 'P2',
    title: '我的假期',
    content: '在假期裡你做了什麼？去了哪些地方？最開心的是什麼事？',
    keywords: ['假期', '旅行', '活動'],
    difficulty: 'easy',
    tags: ['holidays', 'travel']
  },
  {
    id: 'p2-2',
    grade: 'P2',
    title: '我的寵物',
    content: '你有養寵物嗎？如果有，請介紹你的寵物。如果沒有，你想養什麼寵物？',
    keywords: ['寵物', '照顧', '責任'],
    difficulty: 'easy',
    tags: ['pets', 'responsibility']
  },
  {
    id: 'p2-3',
    grade: 'P2',
    title: '我最難忘的一天',
    content: '請說說你最難忘的一天。那天發生了什麼事？為什麼這麼難忘？',
    keywords: ['回憶', '經歷', '情感'],
    difficulty: 'medium',
    tags: ['memories', 'experiences']
  },
  {
    id: 'p2-4',
    grade: 'P2',
    title: '我的生日派對',
    content: '你的生日是怎樣慶祝的？有什麼特別的活動嗎？你收到了什麼禮物？',
    keywords: ['生日', '慶祝', '禮物'],
    difficulty: 'easy',
    tags: ['birthday', 'celebrations']
  },
  {
    id: 'p2-5',
    grade: 'P2',
    title: '我喜歡的運動',
    content: '你最喜歡什麼運動？為什麼喜歡？你平常在哪裡做這個運動？',
    keywords: ['運動', '健康', '興趣'],
    difficulty: 'easy',
    tags: ['sports', 'health']
  },

  // P3 小學題目
  {
    id: 'p3-1',
    grade: 'P3',
    title: '我的偶像',
    content: '你最佩服誰？為什麼佩服這個人？你想從他/她身上學到什麼？',
    keywords: ['偶像', '佩服', '學習榜樣'],
    difficulty: 'medium',
    tags: ['role-models', 'inspiration']
  },
  {
    id: 'p3-2',
    grade: 'P3',
    title: '環保小尖兵',
    content: '你知道什麼是環保嗎？你有沒有做過環保的事情？我們應該怎樣保護環境？',
    keywords: ['環保', '保護環境', '回收'],
    difficulty: 'medium',
    tags: ['environment', 'conservation']
  },
  {
    id: 'p3-3',
    grade: 'P3',
    title: '我的文化背景',
    content: '請介紹你的家庭文化背景。你們有什麼特別的傳統或習俗嗎？',
    keywords: ['文化', '傳統', '習俗'],
    difficulty: 'medium',
    tags: ['culture', 'traditions']
  },
  {
    id: 'p3-4',
    grade: 'P3',
    title: '科技與我',
    content: '你平常會使用什麼科技產品？科技對你的生活有什麼幫助？',
    keywords: ['科技', '電腦', '手機', '網絡'],
    difficulty: 'medium',
    tags: ['technology', 'digital-life']
  },
  {
    id: 'p3-5',
    grade: 'P3',
    title: '我想發明的東西',
    content: '如果你可以發明一樣東西，你會發明什麼？這個發明有什麼用處？',
    keywords: ['發明', '創意', '創新'],
    difficulty: 'medium',
    tags: ['invention', 'creativity']
  },

  // P4 小學題目
  {
    id: 'p4-1',
    grade: 'P4',
    title: '我的學習方法',
    content: '你有什麼好的學習方法嗎？遇到困難的時候你會怎麼辦？',
    keywords: ['學習方法', '困難', '解決問題'],
    difficulty: 'medium',
    tags: ['study-methods', 'problem-solving']
  },
  {
    id: 'p4-2',
    grade: 'P4',
    title: '團隊合作經驗',
    content: '你有沒有和同學一起完成過什麼任務？團隊合作有什麼好處和困難？',
    keywords: ['團隊合作', '溝通', '協作'],
    difficulty: 'medium',
    tags: ['teamwork', 'collaboration']
  },
  {
    id: 'p4-3',
    grade: 'P4',
    title: '我對未來的計劃',
    content: '你對未來有什麼計劃嗎？想要達成什麼目標？會怎樣努力？',
    keywords: ['未來', '計劃', '目標'],
    difficulty: 'medium',
    tags: ['future-plans', 'goals']
  },
  {
    id: 'p4-4',
    grade: 'P4',
    title: '我的興趣發展',
    content: '你的興趣是怎樣培養出來的？你想在這方面有什麼進步？',
    keywords: ['興趣發展', '進步', '努力'],
    difficulty: 'medium',
    tags: ['interest-development', 'progress']
  },
  {
    id: 'p4-5',
    grade: 'P4',
    title: '解決衝突',
    content: '如果你和朋友發生爭執，你會怎樣處理？什麼是好的解決方法？',
    keywords: ['衝突', '解決', '友誼'],
    difficulty: 'medium',
    tags: ['conflict-resolution', 'friendship']
  },

  // P5 小學題目
  {
    id: 'p5-1',
    grade: 'P5',
    title: '社會議題討論',
    content: '你關心什麼社會問題？你覺得我們可以怎樣改善這個問題？',
    keywords: ['社會問題', '關心', '改善'],
    difficulty: 'medium',
    tags: ['social-issues', 'civic-awareness']
  },
  {
    id: 'p5-2',
    grade: 'P5',
    title: '媒體與資訊',
    content: '你從哪裡得到新聞和資訊？你怎樣判斷資訊是否可靠？',
    keywords: ['媒體', '資訊', '判斷力'],
    difficulty: 'medium',
    tags: ['media-literacy', 'information']
  },
  {
    id: 'p5-3',
    grade: 'P5',
    title: '領導經驗',
    content: '你有沒有當過組長或班長？領導別人時有什麼挑戰？',
    keywords: ['領導', '責任', '挑戰'],
    difficulty: 'medium',
    tags: ['leadership', 'responsibility']
  },
  {
    id: 'p5-4',
    grade: 'P5',
    title: '多元文化社會',
    content: '香港是個多元文化的社會，你對此有什麼看法？我們應該怎樣互相尊重？',
    keywords: ['多元文化', '尊重', '包容'],
    difficulty: 'medium',
    tags: ['multiculturalism', 'respect']
  },
  {
    id: 'p5-5',
    grade: 'P5',
    title: '批判性思考',
    content: '當你看到一個新觀點時，你會怎樣思考？如何分辨對錯？',
    keywords: ['批判思考', '分析', '判斷'],
    difficulty: 'medium',
    tags: ['critical-thinking', 'analysis']
  },

  // P6 小學題目
  {
    id: 'p6-1',
    grade: 'P6',
    title: '準備升中',
    content: '你對升讀中學有什麼期待和擔憂？你會怎樣準備這個轉變？',
    keywords: ['升中', '期待', '準備'],
    difficulty: 'medium',
    tags: ['secondary-school', 'transition']
  },
  {
    id: 'p6-2',
    grade: 'P6',
    title: '全球化影響',
    content: '你認為全球化對我們的生活有什麼影響？有好處也有壞處嗎？',
    keywords: ['全球化', '影響', '利弊'],
    difficulty: 'hard',
    tags: ['globalization', 'impact']
  },
  {
    id: 'p6-3',
    grade: 'P6',
    title: '個人價值觀',
    content: '什麼價值觀對你來說最重要？為什麼？這些價值觀如何影響你的決定？',
    keywords: ['價值觀', '重要性', '決定'],
    difficulty: 'hard',
    tags: ['values', 'decision-making']
  },
  {
    id: 'p6-4',
    grade: 'P6',
    title: '創新與傳統',
    content: '你認為我們應該堅持傳統還是追求創新？怎樣取得平衡？',
    keywords: ['創新', '傳統', '平衡'],
    difficulty: 'hard',
    tags: ['innovation', 'tradition']
  },
  {
    id: 'p6-5',
    grade: 'P6',
    title: '公民責任',
    content: '作為社會的一分子，你認為自己有什麼責任？你會怎樣貢獻社會？',
    keywords: ['公民責任', '貢獻', '社會'],
    difficulty: 'hard',
    tags: ['civic-duty', 'contribution']
  },

  // S1 中學題目
  {
    id: 's1-1',
    grade: 'S1',
    title: '中學新生活',
    content: '升讀中學後，你的學習和生活有什麼改變？你如何適應這些變化？',
    keywords: ['中學生活', '適應', '變化'],
    difficulty: 'medium',
    tags: ['secondary-adaptation', 'change']
  },
  {
    id: 's1-2',
    grade: 'S1',
    title: '朋輩壓力',
    content: '你有沒有感受過朋輩壓力？你是怎樣處理的？什麼是正確的處理方法？',
    keywords: ['朋輩壓力', '處理', '影響'],
    difficulty: 'medium',
    tags: ['peer-pressure', 'coping']
  },
  {
    id: 's1-3',
    grade: 'S1',
    title: '時間管理',
    content: '中學的功課比較多，你如何安排時間？有什麼好的時間管理方法？',
    keywords: ['時間管理', '功課', '安排'],
    difficulty: 'medium',
    tags: ['time-management', 'homework']
  },
  {
    id: 's1-4',
    grade: 'S1',
    title: '網絡安全',
    content: '使用互聯網時要注意什麼？你知道什麼網絡安全知識？',
    keywords: ['網絡安全', '互聯網', '保護'],
    difficulty: 'medium',
    tags: ['internet-safety', 'digital-citizenship']
  },
  {
    id: 's1-5',
    grade: 'S1',
    title: '自我認識',
    content: '你認為自己有什麼優點和缺點？你想怎樣改善自己？',
    keywords: ['自我認識', '優缺點', '改善'],
    difficulty: 'medium',
    tags: ['self-awareness', 'improvement']
  },

  // S2 中學題目
  {
    id: 's2-1',
    grade: 'S2',
    title: '學習壓力',
    content: '你有沒有感到學習壓力？壓力來自哪裡？你會怎樣舒緩壓力？',
    keywords: ['學習壓力', '來源', '舒緩'],
    difficulty: 'medium',
    tags: ['academic-stress', 'stress-management']
  },
  {
    id: 's2-2',
    grade: 'S2',
    title: '社交媒體影響',
    content: '社交媒體對青少年有什麼影響？你如何健康地使用社交媒體？',
    keywords: ['社交媒體', '影響', '健康使用'],
    difficulty: 'medium',
    tags: ['social-media', 'digital-wellness']
  },
  {
    id: 's2-3',
    grade: 'S2',
    title: '選科考慮',
    content: '將來選科時你會考慮什麼因素？興趣和就業前景哪個更重要？',
    keywords: ['選科', '考慮因素', '興趣'],
    difficulty: 'medium',
    tags: ['subject-selection', 'career-planning']
  },
  {
    id: 's2-4',
    grade: 'S2',
    title: '環保行動',
    content: '氣候變化是全球問題，作為中學生，你可以做什麼環保行動？',
    keywords: ['氣候變化', '環保行動', '責任'],
    difficulty: 'medium',
    tags: ['climate-change', 'environmental-action']
  },
  {
    id: 's2-5',
    grade: 'S2',
    title: '文化差異',
    content: '你如何看待不同文化之間的差異？我們應該怎樣促進文化交流？',
    keywords: ['文化差異', '交流', '理解'],
    difficulty: 'medium',
    tags: ['cultural-diversity', 'intercultural-communication']
  },

  // S3 中學題目
  {
    id: 's3-1',
    grade: 'S3',
    title: '職業規劃',
    content: '你對未來的職業有什麼想法？你會如何為此做準備？',
    keywords: ['職業規劃', '準備', '未來'],
    difficulty: 'medium',
    tags: ['career-planning', 'preparation', 'DSE']
  },
  {
    id: 's3-2',
    grade: 'S3',
    title: '科技發展對社會的影響',
    content: '人工智能和自動化技術快速發展，這對社會和就業市場會有什麼影響？',
    keywords: ['人工智能', '自動化', '就業'],
    difficulty: 'hard',
    tags: ['technology-impact', 'future-jobs', 'DSE']
  },
  {
    id: 's3-3',
    grade: 'S3',
    title: '社會公平',
    content: '你認為現在的社會公平嗎？什麼因素會影響社會公平？我們可以怎樣改善？',
    keywords: ['社會公平', '不平等', '改善'],
    difficulty: 'hard',
    tags: ['social-justice', 'equality', 'DSE']
  },
  {
    id: 's3-4',
    grade: 'S3',
    title: '媒體素養',
    content: '在資訊爆炸的年代，我們如何分辨真假新聞？媒體素養為什麼重要？',
    keywords: ['媒體素養', '假新聞', '資訊'],
    difficulty: 'hard',
    tags: ['media-literacy', 'fake-news', 'DSE']
  },
  {
    id: 's3-5',
    grade: 'S3',
    title: '可持續發展',
    content: '什麼是可持續發展？個人和社會應該如何實踐可持續發展？',
    keywords: ['可持續發展', '環境', '未來'],
    difficulty: 'hard',
    tags: ['sustainability', 'environment', 'DSE']
  },

  // S4 中學題目
  {
    id: 's4-1',
    grade: 'S4',
    title: '全球化與在地化',
    content: '全球化帶來機遇和挑戰，我們如何在全球化中保持本土特色？',
    keywords: ['全球化', '在地化', '文化保育'],
    difficulty: 'hard',
    tags: ['globalization', 'localization', 'DSE']
  },
  {
    id: 's4-2',
    grade: 'S4',
    title: '人工智能的倫理問題',
    content: '人工智能發展迅速，但也帶來倫理問題。你認為我們應該如何平衡發展和倫理？',
    keywords: ['人工智能', '倫理', '發展'],
    difficulty: 'hard',
    tags: ['AI-ethics', 'technology', 'DSE']
  },
  {
    id: 's4-3',
    grade: 'S4',
    title: '教育制度改革',
    content: '你認為現行的教育制度有什麼優缺點？如果可以改革，你會提出什麼建議？',
    keywords: ['教育制度', '改革', '建議'],
    difficulty: 'hard',
    tags: ['education-reform', 'system', 'DSE']
  },
  {
    id: 's4-4',
    grade: 'S4',
    title: '都市發展與環境保護',
    content: '城市發展往往與環境保護產生矛盾，我們應該如何取得平衡？',
    keywords: ['都市發展', '環境保護', '平衡'],
    difficulty: 'hard',
    tags: ['urban-development', 'environment', 'DSE']
  },
  {
    id: 's4-5',
    grade: 'S4',
    title: '青年參與社會事務',
    content: '青年人應該如何參與社會事務？參與社會事務對個人發展有什麼意義？',
    keywords: ['青年參與', '社會事務', '發展'],
    difficulty: 'hard',
    tags: ['youth-participation', 'civic-engagement', 'DSE']
  },

  // S5 中學題目
  {
    id: 's5-1',
    grade: 'S5',
    title: '經濟發展與社會責任',
    content: '企業在追求利潤的同時，應該承擔什麼社會責任？如何平衡經濟效益和社會價值？',
    keywords: ['企業社會責任', '經濟發展', '社會價值'],
    difficulty: 'hard',
    tags: ['corporate-responsibility', 'economics', 'DSE']
  },
  {
    id: 's5-2',
    grade: 'S5',
    title: '文化保育與城市發展',
    content: '在城市發展過程中，我們應該如何保護文化遺產？發展和保育能否並存？',
    keywords: ['文化保育', '城市發展', '文化遺產'],
    difficulty: 'hard',
    tags: ['cultural-preservation', 'urban-planning', 'DSE']
  },
  {
    id: 's5-3',
    grade: 'S5',
    title: '老齡化社會挑戰',
    content: '人口老齡化為社會帶來什麼挑戰？我們應該如何應對這些挑戰？',
    keywords: ['人口老齡化', '社會挑戰', '應對'],
    difficulty: 'hard',
    tags: ['aging-population', 'social-challenges', 'DSE']
  },
  {
    id: 's5-4',
    grade: 'S5',
    title: '創新與創業精神',
    content: '創新和創業對社會發展有什麼重要性？我們如何培養創新思維？',
    keywords: ['創新', '創業', '思維'],
    difficulty: 'hard',
    tags: ['innovation', 'entrepreneurship', 'DSE']
  },
  {
    id: 's5-5',
    grade: 'S5',
    title: '國際合作與競爭',
    content: '在全球化時代，國際間既有合作也有競爭。我們應該如何看待這種關係？',
    keywords: ['國際合作', '競爭', '全球化'],
    difficulty: 'hard',
    tags: ['international-cooperation', 'competition', 'DSE']
  },

  // S6 中學題目
  {
    id: 's6-1',
    grade: 'S6',
    title: '西區重建令居民無法安眠',
    content: '西區重建項目進行得如火如荼，但夜間施工噪音嚴重影響附近居民的睡眠質素。居民投訴無門，發展商以工程進度為由拒絕調整施工時間。你認為在城市發展和居民生活質素之間應該如何取得平衡？政府和發展商應該承擔什麼責任？',
    keywords: ['城市重建', '噪音污染', '居民權益', '發展與生活平衡'],
    difficulty: 'hard',
    tags: ['urban-redevelopment', 'noise-pollution', 'resident-rights', 'DSE']
  },
  {
    id: 's6-2',
    grade: 'S6',
    title: '數碼時代的人際關係',
    content: '社交媒體和網絡通訊改變了我們的人際關係模式。你認為科技對人際關係的影響是正面還是負面？我們應該如何在數碼時代維持真誠的人際關係？',
    keywords: ['數碼時代', '人際關係', '社交媒體', '科技影響'],
    difficulty: 'hard',
    tags: ['digital-relationships', 'social-media-impact', 'human-connection', 'DSE']
  },
  {
    id: 's6-3',
    grade: 'S6',
    title: '教育公平與社會流動',
    content: '教育被視為促進社會流動的重要途徑，但教育資源分配不均的問題依然存在。你認為什麼因素影響教育公平？我們應該如何確保每個人都有平等的教育機會？',
    keywords: ['教育公平', '社會流動', '資源分配', '平等機會'],
    difficulty: 'hard',
    tags: ['educational-equity', 'social-mobility', 'equal-opportunity', 'DSE']
  },
  {
    id: 's6-4',
    grade: 'S6',
    title: '氣候變化與個人責任',
    content: '氣候變化是全球性問題，需要各國政府和企業的共同努力。但作為個人，我們也有責任嗎？個人行動在解決氣候問題上能發揮多大作用？',
    keywords: ['氣候變化', '個人責任', '環保行動', '全球問題'],
    difficulty: 'hard',
    tags: ['climate-change', 'individual-responsibility', 'environmental-action', 'DSE']
  },
  {
    id: 's6-5',
    grade: 'S6',
    title: '傳統文化在現代社會的價值',
    content: '在急速現代化的社會中，傳統文化面臨失傳的危機。你認為傳統文化在現代社會還有價值嗎？我們應該如何傳承和發展傳統文化？',
    keywords: ['傳統文化', '現代化', '文化傳承', '文化價值'],
    difficulty: 'hard',
    tags: ['traditional-culture', 'modernization', 'cultural-heritage', 'DSE']
  }
];
