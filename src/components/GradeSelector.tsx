import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Users, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/services/logService';

interface GradeSelectorProps {
  onGradeSelect: (grade: string) => void;
  onDiscussionSelect?: (grade: string) => void;
  onBack: () => void;
}

export const GradeSelector = ({ onGradeSelect, onDiscussionSelect, onBack }: GradeSelectorProps) => {
  const navigate = useNavigate();

  // Check if grade supports group discussion (P4+)
  const supportsDiscussion = (grade: string) => {
    const gradeNum = parseInt(grade.substring(1));
    if (grade.startsWith('P') && gradeNum >= 4) return true;
    if (grade.startsWith('S')) return true;
    return false;
  };

  const handleGradeSelect = (grade: string) => {
    logger.info('Grade selected in GradeSelector', { grade });
    onGradeSelect(grade);
  };

  const handleDiscussionSelect = (grade: string) => {
    logger.info('Discussion mode selected for grade', { grade });
    if (onDiscussionSelect) {
      onDiscussionSelect(grade);
    }
  };

  const gradeGroups = [
    {
      title: "幼稚園",
      subtitle: "Kindergarten (K1-K3)",
      description: "",
      grades: ["K1", "K2", "K3"],
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      title: "小學",
      subtitle: "Primary School (P1-P6)", 
      description: "",
      grades: ["P1", "P2", "P3", "P4", "P5", "P6"],
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "中學",
      subtitle: "Secondary School (S1-S6)",
      description: "",
      grades: ["S1", "S2", "S3", "S4", "S5", "S6"],
      bgColor: "bg-green-50", 
      borderColor: "border-green-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="group relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900 dark:hover:to-purple-900 border border-gray-300 dark:border-gray-600 hover:border-blue-300 text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="relative z-10">返回首頁</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/settings')}
              className="group bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 text-purple-700 dark:text-purple-300 font-medium px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              <span>設定</span>
            </Button>
          </div>
          
          <div className="text-center mb-4 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">選擇您的年級</h1>
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">根據香港教育體系設計的分級評測</p>
          </div>
        </div>

        {/* Grade Selection */}
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-8">
          {gradeGroups.map((group) => (
            <Card key={group.title} className={`${group.bgColor} dark:bg-gray-800 ${group.borderColor} dark:border-gray-700 border-2`}>
              <CardHeader className="text-center pb-3 md:pb-6">
                <CardTitle className="text-xl md:text-2xl text-gray-900 dark:text-white">{group.title}</CardTitle>
                <CardDescription className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
                  {group.subtitle}
                </CardDescription>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
                  {group.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
                  {group.grades.map((grade) => (
                    <div key={grade} className="flex flex-col gap-1">
                      <Button
                        onClick={() => handleGradeSelect(grade)}
                        className="h-12 md:h-16 text-base md:text-lg font-semibold bg-white dark:bg-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 text-gray-900 dark:text-white hover:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-transparent transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        <Mic className="w-4 h-4 mr-1 opacity-70" />
                        {grade}
                      </Button>
                      
                      {/* Discussion button for P4+ */}
                      {supportsDiscussion(grade) && onDiscussionSelect && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDiscussionSelect(grade)}
                          className="h-8 text-xs font-medium bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 hover:border-purple-400 transition-all"
                        >
                          <Users className="w-3 h-3 mr-1" />
                          Discussion
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};