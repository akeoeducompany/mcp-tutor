import React from 'react';
import { Button } from '@/components/ui/button';
import { Timer, X } from 'lucide-react';

interface TutoringHeaderProps {
  onEndSession: () => void;
  elapsedTime: number;
}

const TutoringHeader = ({ onEndSession, elapsedTime }: TutoringHeaderProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-2 flex items-center justify-between shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 text-white rounded-md p-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM3 5a1 1 0 00-1 1v2a1 1 0 102 0V6a1 1 0 00-1-1zm14 0a1 1 0 00-1 1v2a1 1 0 102 0V6a1 1 0 00-1-1zM6 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm-3 5a1 1 0 100 2h14a1 1 0 100-2H3z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-gray-800 tracking-tight">AI Coding Tutor</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
          <Timer className="w-4 h-4 text-gray-500" />
          <span>{formatTime(elapsedTime)}</span>
        </div>
        <Button 
          onClick={onEndSession}
          variant="outline"
          size="sm"
          className="text-xs font-semibold border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
        >
          <X className="w-3 h-3 mr-1.5" />
          세션 종료
        </Button>
      </div>
    </header>
  );
};

export default TutoringHeader;
