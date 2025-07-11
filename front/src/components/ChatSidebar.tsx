import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { cn } from "@/lib/utils";
import tutorImage from "@/assets/tutor1.png";
import tutor2Image from "@/assets/tutor2.png";

const personaImages = {
  teacher: tutorImage,
  professor: tutor2Image,
};

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  content: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  persona: 'teacher' | 'professor';
  userId: string;
}

const ChatSidebar = ({ messages, onSendMessage, isTyping = false, persona, userId }: ChatSidebarProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedPersonaImage = personaImages[persona] || tutorImage;
  const personaName = persona === 'teacher' ? '중학교 선생님' : '비전공자반 교수님';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      // isComposing을 확인하여 한글 등 조합 문자 입력 중 Enter가 눌리는 것을 방지합니다.
      e.preventDefault(); // Form 전송 등 기본 동작 방지
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="h-full flex flex-col bg-white border-l shadow-sm">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={selectedPersonaImage} alt={personaName} className="w-10 h-10 rounded-full" />
            <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white ${isTyping ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-base">{personaName}</h3>
            <p className="text-xs text-gray-500">{isTyping ? '입력 중...' : '온라인'}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
              message.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-3 border-t bg-gray-50">
        <div className="flex w-full items-center space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 text-sm bg-white"
          />
          <Button onClick={handleSend} size="icon" disabled={!inputMessage.trim()}>
            <Send className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatSidebar;
