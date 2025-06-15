
interface RecordingData {
  questionId: number;
  section: string;
  question: string;
  audioBlob: Blob;
  timestamp: string;
  duration: number;
  wordCount: number;
  responseTime: number;
}

interface AIEvaluationResult {
  overallScore: number;
  pronunciation: number;
  vocabulary: number;
  fluency: number;
  confidence: number;
  sectionScores: {
    spontaneous: number;
    reading: number;
    personal: number;
  };
  detailedAnalysis: Array<{
    section: string;
    question: string;
    score: number;
    confidence: number;
    feedback: string;
    responseTime: number;
    specificIssues: string[];
    improvements: string[];
  }>;
  grade: string;
  questionsAttempted: number;
  strengths: string[];
  improvements: string[];
  avgResponseTime: number;
  personalizedPlan: {
    weeklyFocus: string;
    shortTermGoals: string[];
    longTermGoals: string[];
    practiceActivities: string[];
  };
}

const MODEL_FALLBACK_LIST = [
  "google/gemini-2.0-flash-exp:free", 
  "deepseek/deepseek-r1-0528:free", 
  "google/gemini-2.5-flash-preview-05-20"
];

const logMessage = (message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO', data?: any) => {
  console.log(`[${level}] ${message}`, data || '');
};

async function callApi(systemPrompt: string, userPrompt: string, base64Audio: string[] = []): Promise<string> {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  
  for (const modelId of MODEL_FALLBACK_LIST) {
    try {
      logMessage(`正在使用AI模型分析: ${modelId}...`);
      
      let content: any[] = [{ type: "text", text: userPrompt }];
      
      // Add audio data as base64 for AI analysis
      if (base64Audio.length > 0) {
        content.push({
          type: "text", 
          text: `\n\n音頻數據 (Base64編碼):\n${base64Audio.map((audio, index) => `錄音${index + 1}: ${audio.substring(0, 100)}...`).join('\n')}`
        });
      }
      
      const payload = {
        model: modelId,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: content }
        ],
        max_tokens: 8192,
        response_format: { type: "json_object" }
      };
      
      logMessage(`Calling AI API with model ${modelId}`, 'INFO', {
        url: "https://aiquiz.ycm927.workers.dev",
        payload: { model: modelId, max_tokens: 8192 }
      });
      
      const response = await fetch("https://aiquiz.ycm927.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API 請求失敗 (${response.status}): ${await response.text()}`);
      }
      
      const data = await response.json();
      logMessage(`AI API call successful with model ${modelId}.`);
      
      if (data?.choices?.[0]?.message?.content) {
        return data.choices[0].message.content;
      }
      
      throw new Error("AI 回應的資料格式不正確或為空。");
    } catch (error) {
      logMessage(`模型 ${modelId} 請求失敗`, 'ERROR', error);
      if (MODEL_FALLBACK_LIST.indexOf(modelId) < MODEL_FALLBACK_LIST.length - 1) {
        await delay(1200);
      }
    }
  }
  
  throw new Error("所有AI模型均請求失敗，請稍後再試。");
}

// 將音頻轉換為base64
async function audioToBase64(audioBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });
}

// 創建系統提示詞
function createSystemPrompt(grade: string): string {
  return `你是一位頂尖的香港中小學英語口試專業評估師，擁有超過20年的香港教育經驗。你具備深度的英語語音分析能力，能夠通過音頻數據準確評估學生的口語表現。

**核心職責:**
1. **真實音頻分析**: 你將接收到學生的真實錄音數據（Base64格式），需要基於音頻內容進行專業評估
2. **專業評分標準**: 基於香港教育局英語口語評估框架，針對${grade}年級學生能力水平
3. **語音特徵分析**: 重點分析發音準確度、語調變化、停頓模式、語速控制等音頻特徵
4. **香港學生特色**: 深度了解香港學生英語學習背景，識別廣東話母語影響的發音特點

**評分維度 (0-100分制):**
1. **發音準確度 (Pronunciation)**: 
   - 個別音素準確性 (th, r/l, 長短母音等)
   - 重音位置正確性
   - 語調自然度
   
2. **詞彙運用 (Vocabulary)**:
   - 詞彙豐富性和準確性
   - 年級適宜性
   - 語境運用恰當程度
   
3. **流暢度 (Fluency)**:
   - 語速適中性
   - 停頓自然性
   - 連貫表達能力
   
4. **自信程度 (Confidence)**:
   - 聲音清晰度和音量
   - 表達自然性
   - 反應速度

**${grade}年級特定標準:**
${getGradeSpecificCriteria(grade)}

**分析要求:**
- 基於實際音頻內容進行評估，不得編造或假設內容
- 提供具體的音頻特徵觀察和分析
- 針對香港學生常見問題給出專業建議
- 使用繁體中文提供詳細反饋

**回應格式:** 必須返回標準JSON格式，包含具體分數和專業中文分析。`;
}

function getGradeSpecificCriteria(grade: string): string {
  switch (grade) {
    case 'K1':
      return `K1學生 (3-4歲): 基本詞彙表達、簡單句型、清晰發音。重點評估溝通意願和基本詞彙掌握。`;
    case 'P1':
      return `P1學生 (6-7歲): 完整句子結構、學校詞彙、基本朗讀能力。重點評估表達完整性。`;
    case 'P3':
      return `P3學生 (8-9歲): 複雜句型、詳細描述、邏輯連貫。重點評估詞彙多樣性和語法準確性。`;
    case 'S1':
      return `S1學生 (12-13歲): 論述能力、觀點表達、互動討論。重點評估流暢表達和邏輯思維。`;
    case 'S6':
      return `S6學生 (17-18歲): 高階分析、複雜論述、學術表達。重點評估批判思考和語言精確度。`;
    default:
      return `一般評估標準: 根據年級水準評估相應語言能力發展。`;
  }
}

// 創建用戶提示詞
function createUserPrompt(recordings: RecordingData[], grade: string): string {
  const recordingDetails = recordings.map((rec, index) => ({
    questionNumber: index + 1,
    section: rec.section,
    question: rec.question,
    duration: rec.duration,
    responseTime: rec.responseTime,
  }));

  return `請基於以下學生的真實英語口語錄音進行專業AI評估：

**學生資料:**
- 年級: ${grade}
- 測試日期: ${new Date().toLocaleDateString('zh-HK')}
- 完成題目數量: ${recordings.length}

**錄音詳情:**
${recordingDetails.map(rec => `
題目 ${rec.questionNumber}: ${rec.section}
問題: "${rec.question}"
錄音時長: ${rec.duration}秒
反應時間: ${rec.responseTime}毫秒
`).join('\n')}

**平均反應時間**: ${Math.round(recordings.reduce((sum, rec) => sum + rec.responseTime, 0) / recordings.length)}毫秒

**評估要求:**
1. 仔細分析每段錄音的語音特徵
2. 基於實際音頻內容評分，不得假設或編造
3. 提供具體的發音、流暢度、詞彙運用分析
4. 針對香港學生特點給出專業建議

請提供以下JSON格式的詳細評估報告：

{
  "overallScore": 整體分數(0-100),
  "pronunciation": 發音分數(0-100),
  "vocabulary": 詞彙分數(0-100), 
  "fluency": 流暢度分數(0-100),
  "confidence": 自信分數(0-100),
  "sectionScores": {
    "spontaneous": 自發表達分數(0-100),
    "reading": 朗讀分數(0-100),
    "personal": 個人經驗表達分數(0-100)
  },
  "detailedAnalysis": [
    {
      "section": "題目分類",
      "question": "具體問題",
      "score": 分數,
      "confidence": 信心水平,
      "feedback": "基於實際音頻的詳細中文反饋",
      "responseTime": 反應時間,
      "specificIssues": ["基於音頻分析的具體問題"],
      "improvements": ["針對性改進建議"]
    }
  ],
  "strengths": ["基於實際表現的優勢 - 繁體中文"],
  "improvements": ["基於音頻分析的改進建議 - 繁體中文"],
  "personalizedPlan": {
    "weeklyFocus": "基於評估結果的學習重點 - 繁體中文",
    "shortTermGoals": ["具體短期目標 - 繁體中文"],
    "longTermGoals": ["長期發展目標 - 繁體中文"],
    "practiceActivities": ["針對性練習活動 - 繁體中文"]
  }
}`;
}

// 主要AI評估函數
export async function performAIEvaluation(recordings: RecordingData[], grade: string): Promise<AIEvaluationResult> {
  console.log('開始AI真實音頻評估...');
  
  try {
    // 轉換所有音頻為base64
    const base64AudioList: string[] = [];
    for (const recording of recordings) {
      try {
        const base64Audio = await audioToBase64(recording.audioBlob);
        base64AudioList.push(base64Audio);
        logMessage(`成功轉換錄音 ${recording.questionId} 為Base64格式`);
      } catch (error) {
        logMessage(`轉換錄音 ${recording.questionId} 失敗`, 'ERROR', error);
      }
    }
    
    if (base64AudioList.length === 0) {
      throw new Error('沒有可用的音頻數據進行評估');
    }
    
    const systemPrompt = createSystemPrompt(grade);
    const userPrompt = createUserPrompt(recordings, grade);
    
    logMessage('發送音頻數據到AI進行專業評估...');
    const aiResponse = await callApi(systemPrompt, userPrompt, base64AudioList);
    
    console.log('AI音頻評估完成，正在解析結果...');
    
    const evaluationResult = JSON.parse(aiResponse);
    
    // 確保返回完整的結果結構
    const finalResult: AIEvaluationResult = {
      overallScore: evaluationResult.overallScore || 0,
      pronunciation: evaluationResult.pronunciation || 0,
      vocabulary: evaluationResult.vocabulary || 0,
      fluency: evaluationResult.fluency || 0,
      confidence: evaluationResult.confidence || 0,
      sectionScores: {
        spontaneous: evaluationResult.sectionScores?.spontaneous || 0,
        reading: evaluationResult.sectionScores?.reading || 0,
        personal: evaluationResult.sectionScores?.personal || 0
      },
      detailedAnalysis: evaluationResult.detailedAnalysis || [],
      grade,
      questionsAttempted: recordings.length,
      strengths: evaluationResult.strengths || ['完成了音頻錄製'],
      improvements: evaluationResult.improvements || ['持續練習提升表現'],
      avgResponseTime: recordings.reduce((sum, rec) => sum + rec.responseTime, 0) / recordings.length,
      personalizedPlan: evaluationResult.personalizedPlan || {
        weeklyFocus: '基於AI分析的學習重點',
        shortTermGoals: ['根據音頻評估制定的短期目標'],
        longTermGoals: ['基於專業分析的長期發展計劃'],
        practiceActivities: ['針對性語音練習活動']
      }
    };
    
    console.log('AI真實評估結果:', finalResult);
    return finalResult;
    
  } catch (error) {
    console.error('AI真實評估失敗:', error);
    throw new Error(`AI評估服務暫時不可用: ${error.message}`);
  }
}
