import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, Circle } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  completed: boolean;
}

interface ProgressSidebarProps {
  currentTopic: string;
  problems: Problem[];
  onProblemClick: (problemId: string) => void;
  currentProblemId: string;
}

const ProgressSidebar = ({ currentTopic, problems, onProblemClick, currentProblemId }: ProgressSidebarProps) => {
  return (
    <Card className="h-full p-3 bg-gray-50">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2 text-sm">현재 학습 주제</h3>
        <div className="bg-blue-100 text-blue-800 px-2 py-1.5 rounded-lg text-xs font-medium">
          #{currentTopic}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">학습 진행도</h3>
        <div className="space-y-1.5">
          {problems.map((problem) => (
            <button
              key={problem.id}
              onClick={() => onProblemClick(problem.id)}
              className={`
                w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors
                ${currentProblemId === problem.id 
                  ? 'bg-blue-100 border-l-4 border-blue-500' 
                  : 'hover:bg-gray-100'
                }
              `}
            >
              {problem.completed ? (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              <span className={`text-xs ${problem.completed ? 'text-green-700' : 'text-gray-700'}`}>
                {problem.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ProgressSidebar;
