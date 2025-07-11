import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TutoringHeader from '@/components/TutoringHeader';
import ProgressSidebar from '@/components/ProgressSidebar';
import CodeEditor from '@/components/CodeEditor';
import ChatSidebar from '@/components/ChatSidebar';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { PanelLeft, PanelRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

const defaultListProblems: Problem[] = [
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
];

const mergeSortProblem: Problem[] = [
  {
    id: 'merge-sort-1',
    title: '1. 병합 정렬 (Merge Sort)',
    description: '분할 정복(Divide and Conquer) 방식을 이용해 병합 정렬 알고리즘을 구현해 보세요. 리스트를 더 이상 나눌 수 없을 때까지 나누고, 정렬하면서 다시 합치는 `merge` 함수와 `merge_sort` 함수를 모두 작성해야 합니다.',
    initialCode: `def merge(left, right):
  # 정렬된 두 리스트 left, right를 병합하여
  # 하나의 정렬된 리스트로 반환하는 함수를 작성하세요.
  pass

def merge_sort(arr):
  # 재귀적으로 리스트를 분할하고,
  # 'merge' 함수를 사용하여 다시 병합하는 함수를 작성하세요.
  pass

# 테스트 코드
my_list = [5, 2, 4, 7, 1, 3, 2, 6]
sorted_list = merge_sort(my_list)
print("정렬된 리스트:", sorted_list)
`,
    completed: false
  }
];

const getInitialProblems = (topics: string[]): Problem[] => {
  if (topics.includes('data-structure') && topics.includes('algorithm')) {
    return mergeSortProblem;
  }
  return defaultListProblems;
};


const Tutoring = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId, selectedTopics, userId, persona } = location.state || {};

  if (!sessionId) {
    useEffect(() => {
      navigate("/");
    }, [navigate]);
    return null;
  }
  
  const initialProblems = getInitialProblems(selectedTopics || ['list']);

  const [isProgressSidebarExpanded, setIsProgressSidebarExpanded] = useState(false);
  const [showEndSessionAlert, setShowEndSessionAlert] = useState(false);
  const [showNextProblemAlert, setShowNextProblemAlert] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [currentProblemId, setCurrentProblemId] = useState(initialProblems[0].id);
  const [output, setOutput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const [isTutorTyping, setIsTutorTyping] = useState(false);

  // Sample problems - 실제로는 선택된 토픽에 따라 동적으로 생성
  /*
  const [problems, setProblems] = useState<Problem[]>([
    {
      id: '1',
      title: '1. 리스트 생성하기',
      description: '비어있는 리스트를 만들고 1, 2, 3 세 개의 숫자를 추가해보세요.',
      initialCode: '# 빈 리스트를 만들어보세요\\nmy_list = []\\n\\n# 숫자 1, 2, 3을 추가해보세요\\n',
      completed: false
    },
    {
      id: '2',
      title: '2. 리스트 아이템 접근',
      description: '리스트의 첫 번째와 마지막 요소를 출력해보세요.',
      initialCode: 'my_list = [1, 2, 3, 4, 5]\\n\\n# 첫 번째 요소 출력\\n\\n# 마지막 요소 출력\\n',
      completed: false
    },
    {
      id: '3',
      title: '3. 리스트 슬라이싱',
      description: '리스트의 중간 부분(인덱스 1부터 3까지)을 슬라이싱해보세요.',
      initialCode: 'my_list = [1, 2, 3, 4, 5]\\n\\n# 인덱스 1부터 3까지 슬라이싱\\n',
      completed: false
    }
  ]);
  */

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

    // Show confirmation and move to next problem
    setShowNextProblemAlert(true);
  };

  const handleGoToNextProblem = () => {
    const currentIndex = problems.findIndex(p => p.id === currentProblemId);
    const nextProblem = problems[currentIndex + 1];

    if (nextProblem) {
      setCurrentProblemId(nextProblem.id);
    } else {
      // Last problem was solved, end the session.
      handleEndSession();
    }
  };

  const sendToChatApi = async (msg: string) => {
    const res = await fetch('/api/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message: msg }),
    });
    return res.json();
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    setIsTutorTyping(true);
    try {
      const data = await sendToChatApi(message);
      const tutorMsgText = data.response?.text || '...';
      const tutorMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'tutor',
        content: tutorMsgText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, tutorMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTutorTyping(false);
    }
  };

  // fetch initial greeting on mount
  useEffect(() => {
    const fetchGreeting = async () => {
      setIsTutorTyping(true);
      try {
        const data = await sendToChatApi('');
        const text = data.response?.text || '안녕하세요!';
        setMessages([{ id: crypto.randomUUID(), sender: 'tutor', content: text, timestamp: new Date() }]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsTutorTyping(false);
      }
    };
    fetchGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TutoringHeader 
        onEndSession={() => setShowEndSessionAlert(true)}
        elapsedTime={elapsedTime}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Progress */}
        <ProgressSidebar 
          isExpanded={isProgressSidebarExpanded}
          onToggle={() => setIsProgressSidebarExpanded(prev => !prev)}
          currentTopic="자료구조"
          problems={problems}
          currentProblemId={currentProblemId}
          onProblemSelect={setCurrentProblemId}
          persona={persona}
          userId={userId}
        />

        {/* Center - Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Main Content - Code Editor */}
          <div className="flex-1 p-4 overflow-auto">
            <CodeEditor 
              problem={currentProblem}
              onRunCode={handleRunCode}
              onSubmitCode={handleSubmitCode}
              output={output}
            />
          </div>
        </div>
        
        {/* Right Sidebar - Chat */}
        <div className="w-96 border-l flex flex-col h-full">
          <ChatSidebar 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isTyping={isTutorTyping}
            persona={persona}
            userId={userId}
          />
        </div>
      </div>

      <AlertDialog open={showEndSessionAlert} onOpenChange={setShowEndSessionAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>튜터링을 종료하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              지금까지의 학습 기록은 리포트로 저장됩니다. 정말로 세션을 종료하시겠어요?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndSession}>종료하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showNextProblemAlert} onOpenChange={setShowNextProblemAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정답입니다!</AlertDialogTitle>
            <AlertDialogDescription>
              다음 문제로 이동하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>아니요</AlertDialogCancel>
            <AlertDialogAction onClick={handleGoToNextProblem}>네, 이동합니다</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tutoring;
