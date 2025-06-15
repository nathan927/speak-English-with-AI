
export interface RecordingData {
  questionId: number;
  section: string;
  question: string;
  audioBlob: Blob;
  timestamp: string;
  duration: number;
  wordCount: number;
  responseTime: number;
}

export interface AIEvaluationResult {
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
