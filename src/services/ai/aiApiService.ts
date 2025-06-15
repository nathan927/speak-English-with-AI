
const MODEL_FALLBACK_LIST = [
  "google/gemini-2.0-flash-exp:free", 
  "deepseek/deepseek-r1-0528:free", 
  "google/gemini-2.5-flash-preview-05-20"
];

const logMessage = (message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO', data?: any) => {
  console.log(`[${level}] ${message}`, data || '');
};

export async function callApi(systemPrompt: string, userPrompt: string, base64Audio: string[] = []): Promise<string> {
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
