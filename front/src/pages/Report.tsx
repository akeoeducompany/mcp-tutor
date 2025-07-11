
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, MessageSquare, Code, Award, Target, BookOpen, Repeat, Home } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    selectedTopics = ['자료구조', '알고리즘'],
    elapsedTime = 850,
    problems = [
      { id: '1', title: '1. 리스트 생성하기', completed: true },
      { id: '2', title: '2. 리스트 아이템 접근', completed: true },
      { id: '3', title: '3. 리스트 슬라이싱', completed: false },
    ],
    messages = new Array(12)
  } = location.state || {};

  const completedProblems = problems.filter((p: any) => p.completed);
  const completionRate = problems.length > 0 ? Math.round((completedProblems.length / problems.length) * 100) : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
             <Award className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">학습 리포트</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">정말 수고하셨습니다! 다음은 이번 세션의 학습 요약입니다.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Clock} title="총 학습 시간" value={formatTime(elapsedTime)} color="blue" />
          <StatCard icon={Target} title="완료 문제 수" value={`${completedProblems.length} / ${problems.length}`} color="green" />
          <StatCard icon={MessageSquare} title="총 대화 수" value={messages.length} color="purple" />
          <StatCard icon={Code} title="학습 주제" value={selectedTopics.length} color="orange" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Summary & Topics */}
          <div className="lg:col-span-1 space-y-6">
             <Card className="shadow-lg border-none bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <BookOpen className="w-6 h-6 text-indigo-500" />
                  <span>학습 개요</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">완료율: {completionRate}%</h4>
                  <Progress value={completionRate} className="w-full" />
                </div>
                 <Separator />
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">학습 주제</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopics.map((topic: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Problems & Feedback */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-none bg-white dark:bg-gray-800">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>문제 해결 현황</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-3">
                  {problems.map((problem: any) => (
                    <li key={problem.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <span className={`font-medium ${problem.completed ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500'}`}>
                        {problem.title}
                      </span>
                      {problem.completed ? (
                        <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold py-1 px-2 rounded-full bg-green-100 dark:bg-green-900/50">
                          <CheckCircle className="w-4 h-4" />
                          성공
                        </span>
                      ) : (
                         <span className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold py-1 px-2 rounded-full bg-gray-200 dark:bg-gray-600">
                          미완료
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <footer className="mt-10 text-center">
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/')} className="font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-transform hover:scale-105">
              <Repeat className="w-5 h-5 mr-2" />
              새로운 학습 시작
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/')} className="font-bold shadow-md">
               <Home className="w-5 h-5 mr-2" />
              홈으로
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard = ({ icon: Icon, title, value, color }: StatCardProps) => {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400",
  };
  
  return (
     <Card className="p-5 shadow-lg border-none bg-white dark:bg-gray-800 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        </div>
      </Card>
  )
}


export default Report;
