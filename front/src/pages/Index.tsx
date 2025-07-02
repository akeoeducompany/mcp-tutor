
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Code, MessageSquare, Target, TrendingUp } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "맞춤형 학습",
      description: "원하는 주제를 선택하고 개인 맞춤형 커리큘럼으로 학습하세요"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-600" />,
      title: "실시간 대화",
      description: "AI 튜터와 실시간으로 소통하며 궁금한 점을 바로 해결하세요"
    },
    {
      icon: <Code className="w-8 h-8 text-purple-600" />,
      title: "실습 중심",
      description: "실제 코드를 작성하고 실행하며 체험적으로 학습하세요"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      title: "학습 리포트",
      description: "학습 진도와 성과를 한눈에 확인하고 개선점을 파악하세요"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            AI 코딩 튜터
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            인공지능 튜터와 함께하는 1:1 맞춤형 코딩 학습<br />
            궁금한 점은 언제든 물어보세요!
          </p>
          <Button 
            onClick={() => navigate('/set-goals')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            학습 시작하기
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* How it works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            어떻게 동작하나요?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">학습 목표 설정</h3>
              <p className="text-gray-600 text-sm">
                배우고 싶은 주제를 선택하고 학습 목표를 설정합니다
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">실습과 대화</h3>
              <p className="text-gray-600 text-sm">
                코드를 작성하며 AI 튜터와 실시간으로 소통합니다
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">학습 완료</h3>
              <p className="text-gray-600 text-sm">
                학습 결과를 확인하고 다음 단계를 계획합니다
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Card className="inline-block p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <h3 className="text-2xl font-bold mb-4">지금 바로 시작해보세요!</h3>
            <p className="mb-6 opacity-90">
              AI 튜터와 함께하는 새로운 코딩 학습 경험
            </p>
            <Button 
              onClick={() => navigate('/set-goals')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 font-semibold"
            >
              무료로 시작하기
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
