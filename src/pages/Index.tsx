import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, BookOpen, Award, TrendingUp, Users, Globe, Star } from 'lucide-react';
import { GradeSelector } from '@/components/GradeSelector';
import VoiceTest from '@/components/VoiceTest';
import { ResultsAnalysis } from '@/components/ResultsAnalysis';
import LogViewer from '@/components/LogViewer';
import { logger } from '@/services/logService';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'gradeSelect' | 'test' | 'results'>('home');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [testResults, setTestResults] = useState<any>(null);
  const [showQuestions, setShowQuestions] = useState<boolean>(false);

  const handleStartTest = () => {
    logger.info('User started test from homepage');
    setCurrentView('gradeSelect');
  };

  const handleGradeSelect = (grade: string, rate: number) => {
    logger.info('Grade selected', { grade, speechRate: rate });
    setSelectedGrade(grade);
    setSpeechRate(rate);
    setCurrentView('test');
  };

  const handleTestComplete = (results: any) => {
    logger.info('Test completed', { grade: selectedGrade, results });
    setTestResults(results);
    setCurrentView('results');
  };

  const handleReturnHome = () => {
    logger.info('User returned to homepage');
    setCurrentView('home');
    setSelectedGrade('');
    setTestResults(null);
    setShowQuestions(false);
  };

  const handleShowQuestionsChange = (checked: boolean) => {
    setShowQuestions(checked);
  };

  // Helper function to render stars based on level
  const renderStars = (maxLevel: number) => {
    return (
      <div className="space-y-2">
        {Array.from({ length: maxLevel }, (_, i) => i + 1).map((level) => (
          <div key={level} className="flex justify-between items-center">
            <span className="text-sm">Level {level}</span>
            <div className="flex">
              {Array.from({ length: level }, (_, starIndex) => (
                <Star key={starIndex} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              {Array.from({ length: maxLevel - level }, (_, starIndex) => (
                <Star key={`empty-${starIndex}`} className="w-4 h-4 text-gray-300" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (currentView === 'gradeSelect') {
    return <GradeSelector onGradeSelect={handleGradeSelect} onBack={handleReturnHome} />;
  }

  if (currentView === 'test') {
    return (
      <VoiceTest 
        grade={selectedGrade}
        speechRate={speechRate}
        showQuestions={showQuestions}
        onComplete={handleTestComplete}
        onBack={() => setCurrentView('gradeSelect')}
        onShowQuestionsChange={handleShowQuestionsChange}
      />
    );
  }

  if (currentView === 'results') {
    return (
      <ResultsAnalysis 
        results={testResults}
        grade={selectedGrade}
        onReturnHome={handleReturnHome}
        onRetakeTest={() => setCurrentView('test')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SpeakCheck HK</h1>
                <p className="text-sm text-gray-600">AI英語口試即時評測</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI 英語口試即時評測
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            專為香港K1-S6學生設計，結合先進語音識別技術與教育局標準，
            提供精準的發音、詞彙、流暢度及自信程度評估
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-16 py-8 text-3xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={handleStartTest}
            >
              <Mic className="w-12 h-12 mr-6" strokeWidth={3} />
              開始測驗
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">智能評測系統特色</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            採用最新AI技術，為每位學生提供個人化的學習分析與建議
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Mic className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-base">發音準確度</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardDescription>
                基於音素匹配和置信度分析，提供精確的發音評估與改進建議
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle className="text-base">詞彙運用</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardDescription>
                智能識別關鍵詞彙使用情況，評估語言豐富度和表達能力
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle className="text-base">流暢度分析</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardDescription>
                分析語速、停頓模式和連貫性，提供流暢度提升指導
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <CardTitle className="text-base">自信程度</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardDescription>
                評估音量、音質和表達清晰度，培養自信的口語表達能力
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Grade Standards Section */}
      <section className="bg-white/50 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">香港教育局標準對接</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              完全對應香港教育體系評分標準，確保評測結果的權威性和準確性
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-center">幼稚園 (K1-K3)</CardTitle>
                <CardDescription className="text-center">觀察記錄制度</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">表現良好</span>
                    <Badge className="bg-green-100 text-green-800">Good</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">發展中</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Developing</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">需要支援</span>
                    <Badge className="bg-red-100 text-red-800">Support</Badge>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-4">
                  遊戲化設計 • 大按鈕介面 • 鮮豔色彩
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-center">小學 (P1-P6)</CardTitle>
                <CardDescription className="text-center">4級評分制度</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderStars(4)}
                <div className="text-xs text-gray-500 mt-4">
                  成就徽章 • 進度追蹤 • 互動元素
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-center">中學 (S1-S6)</CardTitle>
                <CardDescription className="text-center">6級評分制度</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderStars(6)}
                <div className="text-xs text-gray-500 mt-4">
                  專業分析 • 詳細報告 • 自主學習
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">準備好提升英語口語能力了嗎？</h3>
          <p className="text-xl mb-8 text-blue-100">
            立即開始您的個人化語音評測，獲得專業的學習建議
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="px-8 py-3 text-lg"
            onClick={handleStartTest}
          >
            <Users className="w-5 h-5 mr-2" />
            開始測試
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">SpeakCheck HK</span>
          </div>
          <p className="text-gray-400 mb-4">
            © 2025 SpeakCheck HK. 專為香港學生設計的AI英語口語評測系統
          </p>
          <div className="text-sm text-gray-400">
            Powered by Nathan Yuen
          </div>
        </div>
      </footer>

      {/* Log Viewer - Fixed position component */}
      <LogViewer />
    </div>
  );
};

export default Index;
