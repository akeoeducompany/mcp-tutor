
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, MessageSquare, Code } from 'lucide-react';

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    selectedTopics = [],
    elapsedTime = 0,
    problems = [],
    messages = []
  } = location.state || {};

  const completedProblems = problems.filter((p: any) => p.completed);
  const completionRate = problems.length > 0 ? (completedProblems.length / problems.length) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  const handleStartNew = () => {
    navigate('/set-goals');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">학습 완료!</h1>
          <p className="text-gray-600">수고하셨습니다. 학습 결과를 확인해보세요.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{formatTime(elapsedTime)}</div>
            <div className="text-sm text-gray-600">학습 시간</div>
          </Card>
          
          <Card className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{completedProblems.length}</div>
            <div className="text-sm text-gray-600">완료한 문제</div>
          </Card>
          
          <Card className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{messages.length}</div>
            <div className="text-sm text-gray-600">대화 메시지</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">{Math.round(completionRate)}%</div>
            <div className="text-sm text-gray-600">완료율</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Summary */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              학습 요약
            </h3>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">학습한 주제</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTopics.map((topic: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    #{topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">완료한 문제</h4>
              <div className="space-y-2">
                {problems.map((problem: any) => (
                  <div key={problem.id} className="flex items-center gap-2">
                    {problem.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                    )}
                    <span className={`text-sm ${problem.completed ? 'text-green-700' : 'text-gray-500'}`}>
                      {problem.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* AI Tutor Feedback */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🤖 AI 튜터 피드백
            </h3>
            
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-green-800 mb-2">잘한 점</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 리스트 조작 기본 개념을 잘 이해했습니다</li>
                <li>• 코드 작성 시 적절한 변수명을 사용했습니다</li>
                <li>• 막힌 부분에 대해 적극적으로 질문했습니다</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">개선할 점</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 리스트 슬라이싱 문법을 더 연습해보세요</li>
                <li>• 코드 실행 전 예상 결과를 먼저 생각해보세요</li>
                <li>• 다음에는 더 복잡한 문제에 도전해보세요</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center space-x-4">
          <Button onClick={handleStartNew} className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
            새로운 학습 시작하기
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="px-8 py-3">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Report;
