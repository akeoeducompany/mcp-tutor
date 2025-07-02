import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TutoringHeader from '@/components/TutoringHeader';
import ProgressSidebar from '@/components/ProgressSidebar';
import CodeEditor from '@/components/CodeEditor';
import ChatSidebar from '@/components/ChatSidebar';

interface Problem {
  id: string;
  title: string;
  description: string;
  initialCode?: string;
  completed: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  content: string;
  timestamp: Date;
}

const Tutoring = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedTopics = location.state?.selectedTopics || ['list'];
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentProblemId, setCurrentProblemId] = useState('1');
  const [output, setOutput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'tutor',
      content: `안녕하세요! '${selectedTopics[0]}'에 대해 함께 배워볼까요? 첫 번째 문제로 시작해보겠습니다. 궁금한 점이 있으면 언제든 질문해주세요!`,
      timestamp: new Date()
    }
  ]);

  // Sample problems - 실제로는 선택된 토픽에 따라 동적으로 생성
  const [problems, setProblems] = useState<Problem[]>([
    {
      id: '1',
      title: '1. 리스트 생성하기',
      description: '비어있는 리스트를 만들고 1, 2, 3 세 개의 숫자를 추가해보세요.',
      initialCode: '# 빈 리스트를 만들어보세요\nmy_list = []\n\n# 숫자 1, 2, 3을 추가해보세요\n',
      completed: false
    },
    {
      id: '2',
      title: '2. 리스트 아이템 접근',
      description: '리스트의 첫 번째와 마지막 요소를 출력해보세요.',
      initialCode: 'my_list = [1, 2, 3, 4, 5]\n\n# 첫 번째 요소 출력\n\n# 마지막 요소 출력\n',
      completed: false
    },
    {
      id: '3',
      title: '3. 리스트 슬라이싱',
      description: '리스트의 중간 부분(인덱스 1부터 3까지)을 슬라이싱해보세요.',
      initialCode: 'my_list = [1, 2, 3, 4, 5]\n\n# 인덱스 1부터 3까지 슬라이싱\n',
      completed: false
    }
  ]);

  const currentProblem = problems.find(p => p.id === currentProblemId) || problems[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEndSession = () => {
    navigate('/report', { 
      state: { 
        selectedTopics, 
        elapsedTime, 
        problems,
        messages 
      } 
    });
  };

  const handleProblemClick = (problemId: string) => {
    setCurrentProblemId(problemId);
  };

  const handleRunCode = (code: string) => {
    // 실제로는 코드 실행 API를 호출
    setOutput('코드가 실행되었습니다!\n결과: [1, 2, 3]');
  };

  const handleSubmitCode = (code: string) => {
    // 코드 제출시 AI 튜터 피드백 생성
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'tutor',
      content: '좋은 시도입니다! 코드를 살펴보니 리스트 생성과 요소 추가를 잘 구현하셨네요. 다음 문제로 넘어가볼까요?',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // 문제 완료 처리
    setProblems(prev => prev.map(p => 
      p.id === currentProblemId ? { ...p, completed: true } : p
    ));
  };

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // AI 튜터 응답 시뮬레이션
    setTimeout(() => {
      const tutorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        content: '좋은 질문이에요! 파이썬에서 리스트에 요소를 추가할 때는 `append()` 메소드를 사용합니다. 예를 들어 `my_list.append(1)` 이런 식으로 사용하면 됩니다.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, tutorResponse]);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TutoringHeader onEndSession={handleEndSession} elapsedTime={elapsedTime} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Progress */}
        <div className="w-56 p-3 overflow-y-auto">
          <ProgressSidebar
            currentTopic={selectedTopics[0]}
            problems={problems}
            onProblemClick={handleProblemClick}
            currentProblemId={currentProblemId}
          />
        </div>

        {/* Center - Code Editor (increased space) */}
        <div className="flex-1 p-3 overflow-y-auto">
          <CodeEditor
            problem={currentProblem}
            onRunCode={handleRunCode}
            onSubmitCode={handleSubmitCode}
            output={output}
          />
        </div>

        {/* Right Sidebar - Chat */}
        <div className="w-72 p-3 overflow-y-auto">
          <ChatSidebar
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Tutoring;
