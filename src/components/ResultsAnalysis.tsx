
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  RotateCcw, 
  TrendingUp, 
  Award, 
  Target, 
  BookOpen,
  Mic,
  MessageSquare,
  Heart,
  Download,
  Share2
} from 'lucide-react';

interface ResultsAnalysisProps {
  results: {
    overallScore: number;
    pronunciation: number;
    vocabulary: number;
    fluency: number;
    confidence: number;
    grade: string;
    questionsAttempted: number;
    strengths: string[];
    improvements: string[];
    detailedAnalysis: Array<{
      question: string;
      score: number;
      feedback: string;
    }>;
  };
  grade: string;
  onReturnHome: () => void;
  onRetakeTest: () => void;
}

export const ResultsAnalysis = ({ results, grade, onReturnHome, onRetakeTest }: ResultsAnalysisProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getGradeLevel = (score: number, grade: string) => {
    if (grade.startsWith('K')) {
      if (score >= 85) return { level: '表現良好', color: 'bg-green-500', description: '優秀表現' };
      if (score >= 70) return { level: '發展中', color: 'bg-yellow-500', description: '持續進步' };
      return { level: '需要支援', color: 'bg-red-500', description: '需要更多練習' };
    } else if (grade.startsWith('P')) {
      if (score >= 85) return { level: 'Level 4', color: 'bg-green-500', description: '卓越水平' };
      if (score >= 75) return { level: 'Level 3', color: 'bg-blue-500', description: '良好水平' };
      if (score >= 65) return { level: 'Level 2', color: 'bg-yellow-500', description: '達標水平' };
      return { level: 'Level 1', color: 'bg-red-500', description: '需要改進' };
    } else {
      if (score >= 90) return { level: 'Level 6', color: 'bg-green-500', description: '卓越水平' };
      if (score >= 80) return { level: 'Level 5', color: 'bg-green-400', description: '優良水平' };
      if (score >= 70) return { level: 'Level 4', color: 'bg-blue-500', description: '良好水平' };
      if (score >= 60) return { level: 'Level 3', color: 'bg-yellow-500', description: '達標水平' };
      if (score >= 50) return { level: 'Level 2', color: 'bg-orange-500', description: '基礎水平' };
      return { level: 'Level 1', color: 'bg-red-500', description: '需要改進' };
    }
  };

  const overallLevel = getGradeLevel(results.overallScore, grade);
  
  const skillsData = [
    { name: '發音準確度', score: results.pronunciation, icon: Mic, color: 'text-blue-600' },
    { name: '詞彙運用', score: results.vocabulary, icon: BookOpen, color: 'text-green-600' },
    { name: '流暢度', score: results.fluency, icon: MessageSquare, color: 'text-purple-600' },
    { name: '自信程度', score: results.confidence, icon: Heart, color: 'text-red-600' }
  ];

  const getMotivationalMessage = (score: number) => {
    if (score >= 90) return '🎉 卓越表現！您的英語口語能力非常出色！';
    if (score >= 80) return '👏 優秀表現！您在英語口語方面有很好的基礎！';
    if (score >= 70) return '😊 良好表現！繼續努力，您一定會有更大進步！';
    if (score >= 60) return '💪 不錯的開始！多加練習，您會越來越好！';
    return '🌟 每個人都有進步的空間，堅持練習就是成功的開始！';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">測試完成！</h1>
          <p className="text-gray-600 mb-4">{getMotivationalMessage(results.overallScore)}</p>
          <div className="flex justify-center space-x-4">
            <Button onClick={onReturnHome} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              返回首頁
            </Button>
            <Button onClick={onRetakeTest} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              重新測試
            </Button>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <div className="text-6xl font-bold mb-4">{results.overallScore}</div>
            <div className="text-xl mb-2">總體得分</div>
            <Badge className={`${overallLevel.color} text-white border-0 text-lg px-4 py-2`}>
              {overallLevel.level}
            </Badge>
            <p className="mt-2 text-blue-100">{overallLevel.description}</p>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">總覽</TabsTrigger>
            <TabsTrigger value="skills">技能分析</TabsTrigger>
            <TabsTrigger value="detailed">詳細報告</TabsTrigger>
            <TabsTrigger value="suggestions">學習建議</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Skills Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skillsData.map((skill) => {
                const IconComponent = skill.icon;
                const skillLevel = getGradeLevel(skill.score, grade);
                return (
                  <Card key={skill.name} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-3`}>
                        <IconComponent className={`w-6 h-6 ${skill.color}`} />
                      </div>
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900 mb-2">{skill.score}</div>
                      <Progress value={skill.score} className="mb-3" />
                      <Badge className={`${skillLevel.color} text-white border-0`}>
                        {skillLevel.level}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900">{results.questionsAttempted}</div>
                  <p className="text-gray-600">題目完成</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900">{results.strengths.length}</div>
                  <p className="text-gray-600">優勢技能</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900">{results.improvements.length}</div>
                  <p className="text-gray-600">改進建議</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>技能雷達圖分析</CardTitle>
                <CardDescription>您在各項技能上的表現分佈</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skillsData.map((skill) => {
                    const IconComponent = skill.icon;
                    return (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`w-5 h-5 ${skill.color}`} />
                            <span className="font-medium">{skill.name}</span>
                          </div>
                          <span className="text-2xl font-bold">{skill.score}</span>
                        </div>
                        <Progress value={skill.score} className="h-3" />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>需要改進</span>
                          <span>良好</span>
                          <span>卓越</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>逐題分析報告</CardTitle>
                <CardDescription>每個問題的詳細表現分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.detailedAnalysis.map((analysis, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">題目 {index + 1}</h4>
                        <Badge variant={analysis.score >= 80 ? "default" : analysis.score >= 60 ? "secondary" : "destructive"}>
                          {analysis.score} 分
                        </Badge>
                      </div>
                      <p className="text-gray-700 italic">"{analysis.question}"</p>
                      <div className="space-y-2">
                        <Progress value={analysis.score} />
                        <p className="text-sm text-gray-600">{analysis.feedback}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    您的優勢
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    改進建議
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-center text-blue-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>個人化學習計劃</CardTitle>
                <CardDescription>根據您的測試結果，我們為您推薦以下學習重點</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h4 className="font-semibold mb-2">📚 本週學習重點</h4>
                    <p className="text-gray-700">
                      重點練習發音準確度，建議每天花15分鐘跟讀英語材料，
                      特別關注母音和子音的正確發音。
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">🎯 短期目標 (2週內)</h4>
                    <p className="text-gray-700">
                      增加日常英語口語練習時間，嘗試用英語描述日常活動，
                      提高流暢度和自信心。
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <h4 className="font-semibold mb-2">🚀 長期目標 (1個月內)</h4>
                    <p className="text-gray-700">
                      參加英語角或尋找語言交換夥伴，在真實場景中應用所學，
                      爭取在下次測試中提高10分。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" className="px-6">
            <Download className="w-4 h-4 mr-2" />
            下載報告
          </Button>
          <Button variant="outline" className="px-6">
            <Share2 className="w-4 h-4 mr-2" />
            分享結果
          </Button>
        </div>
      </div>
    </div>
  );
};
