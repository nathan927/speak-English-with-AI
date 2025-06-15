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

async function callApi(systemPrompt: string, userPrompt: string, base64Images: string[] = []): Promise<string> {
  const maxRetries = 3;
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  
  for (const modelId of MODEL_FALLBACK_LIST) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const loadingStatusText = `正在使用AI模型分析: ${modelId} (第 ${attempt + 1} 次)...`;
        logMessage(loadingStatusText);
        
        let content: any[] = [{ type: "text", text: userPrompt }];
        if (base64Images.length > 0) {
          content.push(...base64Images.map(imgBase64 => ({
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${imgBase64}` }
          })));
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
        
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || "5", 10);
          logMessage(`API returned 429 (Too Many Requests). Retrying after ${retryAfter} seconds.`, 'WARN');
          await delay(retryAfter * 1000);
          continue;
        }
        
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
        logMessage(`模型 ${modelId} 第 ${attempt + 1} 次嘗試失敗`, 'ERROR', error);
        if (attempt === maxRetries - 1) break;
        await delay(2000 * (attempt + 1));
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
  return `你是一位頂尖的香港中小學英語口試卷設計專家和評估師，擁有超過20年的香港教育經驗。你深度了解香港學生的英語學習特點、常見問題以及有效的改進方法。

**核心指令 (必須嚴格遵守):**

1. **語言**: 你應主要使用**繁體中文（香港）**來和用戶指出用戶在英語口試的具體表現、舉例來針對哪些發音或地方來改善，建議有效具體的針對性練習方案。

2. **評估標準**: 基於香港教育局的英語口語評估框架，針對${grade}年級學生的能力水平進行評估。

3. **評分維度**:
   - **發音準確度 (Pronunciation)**: 重點關注香港學生常見的發音問題，如th音、r/l混淆、長短母音等
   - **詞彙運用 (Vocabulary)**: 評估詞彙的豐富性、準確性和年級適宜性
   - **流暢度 (Fluency)**: 語速、停頓、連貫性和自然度
   - **自信程度 (Confidence)**: 反應速度、語調變化、表達的自然性

4. **香港學生特點考慮**:
   - 廣東話母語背景影響
   - 香港英語學習環境特色
   - 文化背景對表達的影響
   - 年級相應的認知發展水平

5. **年級特定評估標準**:
   ${getGradeSpecificCriteria(grade)}

6. **反應時間評分準則**:
   - 3秒内開始回應: 高自信分數 (80-100分)
   - 3-5秒開始回應: 中等自信分數 (60-79分)
   - 5秒以上開始回應: 較低自信分數 (40-59分)
   - 回應應自然，不應過度停頓

7. **回應格式**: 必須返回有效的JSON格式，包含具體分數和詳細中文反饋。

請基於以上標準，對學生的英語口語表現進行專業、客觀且具建設性的評估。`;
}

function getGradeSpecificCriteria(grade: string): string {
  switch (grade) {
    case 'K1':
      return `
   - K1學生 (3-4歲): 期望簡單詞彙、基本句型、清晰發音
   - 評估重點: 能否說出常見單字、簡單問答、基本禮貌用語
   - 容忍度: 語法錯誤可以接受，重點在於溝通意願和基本詞彙`;
      
    case 'P1':
      return `
   - P1學生 (6-7歲): 期望基本句子結構、學校相關詞彙、簡單描述
   - 評估重點: 能否完整回答問題、基本朗讀能力、個人經驗分享
   - 容忍度: 允許語法小錯誤，重點在於表達完整性和詞彙運用`;
      
    case 'P3':
      return `
   - P3學生 (8-9歲): 期望複雜句子、詳細描述、邏輯連貫
   - 評估重點: 能否詳細描述經驗、使用連接詞、表達個人觀點
   - 容忍度: 語法應基本正確，詞彙使用應多樣化`;
      
    case 'S1':
      return `
   - S1學生 (12-13歲): 期望論述能力、批判思考、小組討論參與
   - 評估重點: 個人演講能力、觀點表達、互動討論技巧
   - 容忍度: 語法錯誤較少容忍，期望流暢表達和邏輯清晰`;
      
    case 'S6':
      return `
   - S6學生 (17-18歲): 期望高階分析、複雜論述、深度思考
   - 評估重點: 批判分析能力、複雜議題討論、學術水準表達
   - 容忍度: 高標準語法要求，期望接近成人水準的表達能力`;
      
    default:
      return `
   - 一般評估標準: 根據年級水準期望相應的語言能力
   - 評估重點: 綜合考慮發音、詞彙、流暢度和自信程度`;
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
    estimatedWords: Math.max(1, Math.floor(rec.duration / 0.8))
  }));

  return `請根據以下學生的英語口語測試數據，進行全面的AI評估和分析：

**學生資料:**
- 年級: ${grade}
- 測試日期: ${new Date().toLocaleDateString('zh-HK')}
- 完成題目數量: ${recordings.length}

**錄音數據分析:**
${recordingDetails.map(rec => `
題目 ${rec.questionNumber}: ${rec.section}
問題: "${rec.question}"
錄音時長: ${rec.duration}秒
反應時間: ${rec.responseTime}毫秒
估計詞彙量: ${rec.estimatedWords}個字
`).join('\n')}

**平均反應時間**: ${Math.round(recordings.reduce((sum, rec) => sum + rec.responseTime, 0) / recordings.length)}毫秒

請基於上述數據，提供一個JSON格式的詳細評估報告，包含以下結構：

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
      "feedback": "詳細中文反饋",
      "responseTime": 反應時間,
      "specificIssues": ["具體問題列表"],
      "improvements": ["具體改進建議列表"]
    }
  ],
  "strengths": ["優勢列表 - 繁體中文"],
  "improvements": ["改進建議列表 - 繁體中文"],
  "personalizedPlan": {
    "weeklyFocus": "本週學習重點 - 繁體中文",
    "shortTermGoals": ["短期目標列表 - 繁體中文"],
    "longTermGoals": ["長期目標列表 - 繁體中文"],
    "practiceActivities": ["具體練習活動列表 - 繁體中文"]
  }
}

請特別注意針對香港學生的常見英語發音和表達問題，提供具體、實用的改進建議。`;
}

// 主要AI評估函數
export async function performAIEvaluation(recordings: RecordingData[], grade: string): Promise<AIEvaluationResult> {
  console.log('開始AI驅動的語音評估...');
  
  try {
    const systemPrompt = createSystemPrompt(grade);
    const userPrompt = createUserPrompt(recordings, grade);
    
    const aiResponse = await callApi(systemPrompt, userPrompt);
    
    console.log('AI評估完成，正在解析結果...');
    
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
      strengths: evaluationResult.strengths || ['完成了所有測試環節'],
      improvements: evaluationResult.improvements || ['繼續練習以提升整體表現'],
      avgResponseTime: recordings.reduce((sum, rec) => sum + rec.responseTime, 0) / recordings.length,
      personalizedPlan: evaluationResult.personalizedPlan || {
        weeklyFocus: '加強發音練習',
        shortTermGoals: ['每日練習15分鐘'],
        longTermGoals: ['提升整體口語表達能力'],
        practiceActivities: ['跟讀練習', '角色扮演']
      }
    };
    
    console.log('AI評估結果:', finalResult);
    return finalResult;
    
  } catch (error) {
    console.error('AI評估失敗:', error);
    
    // 提供備用評估結果
    return createFallbackEvaluation(recordings, grade);
  }
}

// 備用評估結果
function createFallbackEvaluation(recordings: RecordingData[], grade: string): AIEvaluationResult {
  const avgDuration = recordings.reduce((sum, rec) => sum + rec.duration, 0) / recordings.length;
  const avgResponseTime = recordings.reduce((sum, rec) => sum + rec.responseTime, 0) / recordings.length;
  
  // 基於錄音數據的基本評分算法
  let baseScore = 50;
  
  // 録音時長評分
  if (avgDuration >= 5) baseScore += 10;
  if (avgDuration >= 10) baseScore += 10;
  
  // 反應時間評分
  if (avgResponseTime <= 3000) baseScore += 10;
  else if (avgResponseTime > 5000) baseScore -= 10;
  
  // 完成度評分
  baseScore += (recordings.length * 2);
  
  const finalScore = Math.max(30, Math.min(85, baseScore));
  
  return {
    overallScore: finalScore,
    pronunciation: finalScore - 5,
    vocabulary: finalScore + 2,
    fluency: finalScore - 3,
    confidence: avgResponseTime <= 3000 ? finalScore + 5 : finalScore - 10,
    sectionScores: {
      spontaneous: finalScore,
      reading: finalScore + 3,
      personal: finalScore - 2
    },
    detailedAnalysis: recordings.map((rec, index) => ({
      section: rec.section,
      question: rec.question,
      score: finalScore,
      confidence: 0.6,
      feedback: `錄音時長${rec.duration}秒，表現${finalScore >= 70 ? '良好' : '需要改進'}`,
      responseTime: rec.responseTime,
      specificIssues: ['AI評估暫時不可用'],
      improvements: ['建議多練習口語表達']
    })),
    grade,
    questionsAttempted: recordings.length,
    strengths: ['完成了所有測試環節', '有錄音回應'],
    improvements: ['建議使用AI評估功能獲得更詳細的分析'],
    avgResponseTime,
    personalizedPlan: {
      weeklyFocus: '加強日常英語口語練習',
      shortTermGoals: ['每日練習15分鐘英語會話'],
      longTermGoals: ['提升整體英語口語流暢度'],
      practiceActivities: ['跟讀英語材料', '錄音自我評估', '與同學練習對話']
    }
  };
}
