
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const topics = [
  { id: 'list', label: '리스트', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
  { id: 'function', label: '함수', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  { id: 'loop', label: '반복문', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
  { id: 'recursion', label: '재귀함수', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
  { id: 'class', label: '클래스', color: 'bg-pink-100 text-pink-800 hover:bg-pink-200' },
  { id: 'algorithm', label: '알고리즘', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  { id: 'data-structure', label: '자료구조', color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
  { id: 'string', label: '문자열', color: 'bg-teal-100 text-teal-800 hover:bg-teal-200' }
];

const SetGoals = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const startTutoring = () => {
    if (selectedTopics.length > 0) {
      navigate('/tutoring', { state: { selectedTopics } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI 코딩 튜터
          </h1>
          <p className="text-xl text-gray-600">
            학습할 주제를 선택해주세요. (여러 개 선택 가능)
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => toggleTopic(topic.id)}
              className={`
                px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${selectedTopics.includes(topic.id) 
                  ? `${topic.color} ring-2 ring-offset-2 ring-blue-500 transform scale-105` 
                  : `${topic.color} hover:scale-105`
                }
              `}
            >
              #{topic.label}
            </button>
          ))}
        </div>

        {selectedTopics.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-2">선택된 주제:</p>
            <div className="flex flex-wrap gap-2">
              {selectedTopics.map(topicId => {
                const topic = topics.find(t => t.id === topicId);
                return (
                  <span key={topicId} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    #{topic?.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <Button 
          onClick={startTutoring}
          disabled={selectedTopics.length === 0}
          className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
        >
          튜터링 시작하기
        </Button>
      </Card>
    </div>
  );
};

export default SetGoals;
