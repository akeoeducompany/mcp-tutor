import React from 'react';
import { Button } from '@/components/ui/button';

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
    <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800">AI Coding Tutor</h1>
      
      <div className="flex items-center gap-3">
        <div className="text-base font-mono font-semibold text-blue-600">
          {formatTime(elapsedTime)}
        </div>
        <Button 
          onClick={onEndSession}
          variant="outline"
          size="sm"
          className="border-red-200 text-red-600 hover:bg-red-50 text-sm"
        >
          튜터링 종료
        </Button>
      </div>
    </header>
  );
};

export default TutoringHeader;
