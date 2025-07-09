import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, Circle, PanelLeft, PanelRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

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
  isExpanded: boolean;
  onToggle: () => void;
}

const ProgressSidebar = ({ currentTopic, problems, onProblemClick, currentProblemId, isExpanded, onToggle }: ProgressSidebarProps) => {
  return (
    <TooltipProvider>
      <Card className={`h-full flex flex-col p-2 transition-all duration-300 ${isExpanded ? 'bg-gray-50' : 'bg-white'}`}>
        <div className={`w-full flex ${isExpanded ? 'justify-end' : 'justify-center'} mb-2`}>
          <Button onClick={onToggle} variant="ghost" size="icon">
            {isExpanded ? <PanelLeft className="h-5 w-5" /> : <PanelRight className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isExpanded && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">현재 학습 주제</h3>
              <div className="bg-blue-100 text-blue-800 px-2 py-1.5 rounded-lg text-xs font-medium">
                #{currentTopic}
              </div>
            </div>
          )}

          <div>
            {isExpanded && <h3 className="font-semibold text-gray-800 mb-3 text-sm">학습 진행도</h3>}
            <div className="space-y-1.5">
              {problems.map((problem) => (
                <Tooltip key={problem.id} disableHoverableContent={isExpanded}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onProblemClick(problem.id)}
                      className={`
                        w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors
                        ${isExpanded ? 'justify-start' : 'justify-center'}
                        ${currentProblemId === problem.id 
                          ? 'bg-blue-100 border-blue-500' 
                          : 'hover:bg-gray-100'
                        }
                        ${currentProblemId === problem.id && isExpanded ? 'border-l-4' : ''}
                      `}
                    >
                      {problem.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      {isExpanded && (
                        <span className={`text-xs ${problem.completed ? 'text-green-700' : 'text-gray-700'}`}>
                          {problem.title}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent side="right">
                      <p>{problem.title}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default ProgressSidebar;
