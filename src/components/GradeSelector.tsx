
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Mic, BookOpen, Users, Volume2 } from 'lucide-react';

interface GradeSelectorProps {
  onGradeSelect: (grade: string, speechRate: number) => void;
  onBack: () => void;
}

export const GradeSelector = ({ onGradeSelect, onBack }: GradeSelectorProps) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(0.9);

  const gradeCategories = [
    {
      title: '幼稚園',
      description: '遊戲化設計，大按鈕介面',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-green-100 text-green-800',
      grades: [
        { id: 'K1', name: 'K1', description: '3-4歲，基礎詞彙' },
        { id: 'K2', name: 'K2', description: '4-5歲，簡單句子' },
        { id: 'K3', name: 'K3', description: '5-6歲，基本對話' }
      ]
    },
    {
      title: '小學',
      description: '4級評分制，成就徽章系統',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-800',
      grades: [
        { id: 'P1', name: 'P1', description: '基礎發音與詞彙' },
        { id: 'P2', name: 'P2', description: '簡單對話技巧' },
        { id: 'P3', name: 'P3', description: '流暢度提升' },
        { id: 'P4', name: 'P4', description: '表達能力發展' },
        { id: 'P5', name: 'P5', description: '進階口語技巧' },
        { id: 'P6', name: 'P6', description: '升中準備' }
      ]
    },
    {
      title: '中學',
      description: '6級評分制，專業分析報告',
      icon: <Mic className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-800',
      grades: [
        { id: 'S1', name: 'S1', description: '中一適應期評估' },
        { id: 'S2', name: 'S2', description: '基礎中學口語' },
        { id: 'S3', name: 'S3', description: '中等程度評測' },
        { id: 'S4', name: 'S4', description: '高中準備' },
        { id: 'S5', name: 'S5', description: 'DSE預備' },
        { id: 'S6', name: 'S6', description: 'DSE衝刺' }
      ]
    }
  ];

  const handleGradeSelect = (gradeId: string) => {
    setSelectedGrade(gradeId);
  };

  const handleStartTest = () => {
    if (selectedGrade) {
      onGradeSelect(selectedGrade, speechRate);
    }
  };

  const getSpeechRateLabel = (rate: number) => {
    if (rate <= 0.7) return '慢速';
    if (rate <= 0.9) return '正常';
    if (rate <= 1.1) return '快速';
    return '極快';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="group relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 border border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-700 font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="relative z-10">返回首頁</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">選擇年級</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              請選擇您的年級，系統將根據香港教育局標準為您量身定制評測內容
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 mb-8">
            {gradeCategories.map((category) => (
              <Card key={category.title} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                    <Badge className={category.color}>{category.title}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {category.grades.map((grade) => (
                      <Button
                        key={grade.id}
                        variant={selectedGrade === grade.id ? 'default' : 'outline'}
                        className={`h-auto p-4 flex flex-col items-center space-y-2 text-center transition-all duration-200 ${
                          selectedGrade === grade.id
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                            : 'hover:bg-blue-50 hover:border-blue-300'
                        }`}
                        onClick={() => handleGradeSelect(grade.id)}
                      >
                        <span className="font-bold text-lg">{grade.name}</span>
                        <span className="text-xs opacity-80 leading-tight">
                          {grade.description}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 語速設定 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5" />
                <span>語速設定</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">調整問題播放的語速</span>
                  <Badge variant="outline">{getSpeechRateLabel(speechRate)}</Badge>
                </div>
                <Slider
                  value={[speechRate]}
                  onValueChange={(value) => setSpeechRate(value[0])}
                  max={1.5}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>慢速 (0.5x)</span>
                  <span>正常 (1.0x)</span>
                  <span>快速 (1.5x)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 開始測試按鈕 */}
          {selectedGrade && (
            <div className="text-center">
              <Button
                size="lg"
                onClick={handleStartTest}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-2xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Mic className="w-10 h-10 mr-4" />
                開始 {selectedGrade} 測驗
              </Button>
              <p className="text-gray-600 mt-4">
                已選擇：{selectedGrade} • 語速：{getSpeechRateLabel(speechRate)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
