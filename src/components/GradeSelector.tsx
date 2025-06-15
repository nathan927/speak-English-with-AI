
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, BookOpen, GraduationCap } from 'lucide-react';

interface GradeSelectorProps {
  onGradeSelect: (grade: string) => void;
  onBack: () => void;
}

export const GradeSelector = ({ onGradeSelect, onBack }: GradeSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const gradeCategories = [
    {
      id: 'kindergarten',
      title: '幼稚園',
      subtitle: 'K1 - K3',
      description: '觀察記錄制度，遊戲化學習體驗',
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      grades: ['K1', 'K2', 'K3'],
      features: ['大按鈕設計', '鮮豔色彩', '互動遊戲', '基礎詞彙']
    },
    {
      id: 'primary',
      title: '小學',
      subtitle: 'P1 - P6',
      description: '4級評分制度，成就導向學習',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      grades: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
      features: ['成就徽章', '進度追蹤', '趣味互動', '詞彙擴展']
    },
    {
      id: 'secondary',
      title: '中學',
      subtitle: 'S1 - S6',
      description: '6級評分制度，專業分析報告',
      icon: GraduationCap,
      color: 'from-purple-500 to-indigo-500',
      grades: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
      features: ['詳細分析', '個人化建議', '技能雷達圖', '進階評估']
    }
  ];

  const selectedCategoryData = gradeCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="group relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 border border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-700 font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="relative z-10">返回首頁</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">選擇年級</h1>
          <p className="text-gray-600">請選擇您的學習階段，我們將為您提供相應的測試內容</p>
        </div>

        {!selectedCategory ? (
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {gradeCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 h-fit"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardHeader className="text-center pb-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription className="text-base font-semibold text-gray-700">
                      {category.subtitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pt-0 pb-4">
                    <p className="text-gray-600 mb-2 text-sm">{category.description}</p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {category.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCategory('')}
                className="group relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 border border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-700 font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 mb-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="relative z-10">返回選擇</span>
              </Button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedCategoryData?.title}階段
                </h2>
                <p className="text-gray-600">{selectedCategoryData?.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {selectedCategoryData?.grades.map((grade) => (
                <Card 
                  key={grade}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 text-center"
                  onClick={() => onGradeSelect(grade)}
                >
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 bg-gradient-to-r ${selectedCategoryData.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-white font-bold text-sm">{grade}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{grade}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedCategoryData.id === 'kindergarten' && '觀察記錄'}
                      {selectedCategoryData.id === 'primary' && '4級制度'}
                      {selectedCategoryData.id === 'secondary' && '6級制度'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {selectedCategoryData?.title}階段特色
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {selectedCategoryData?.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
