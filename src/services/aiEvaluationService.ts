
import { RecordingData, AIEvaluationResult } from './types/evaluationTypes';
import { callApi } from './ai/aiApiService';
import { audioToBase64 } from './utils/audioUtils';
import { createSystemPrompt, createUserPrompt } from './prompts/promptGenerator';

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
        console.log(`成功轉換錄音 ${recording.questionId} 為Base64格式`);
      } catch (error) {
        console.error(`轉換錄音 ${recording.questionId} 失敗`, error);
      }
    }
    
    if (base64AudioList.length === 0) {
      throw new Error('沒有可用的音頻數據進行評估');
    }
    
    const systemPrompt = createSystemPrompt(grade);
    const userPrompt = createUserPrompt(recordings, grade);
    
    console.log('發送音頻數據到AI進行專業評估...');
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
