import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Database, Play, CheckCircle, XCircle, Loader2, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface CodeEditorProps {
  problem: {
    title: string;
    description: string;
    initialCode?: string;
  };
  onRunCode: (code: string) => void;
  onSubmitCode: (code: string) => void;
  output: string;
}

const CodeEditor = ({ problem, onRunCode, onSubmitCode, output }: CodeEditorProps) => {
  const [code, setCode] = useState(problem.initialCode || '# 여기에 코드를 작성하세요\n');
  const [language, setLanguage] = useState('python');
  const [testInput, setTestInput] = useState('');
  const [isTestVisible, setIsTestVisible] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradingState, setGradingState] = useState<'loading' | 'success' | 'error'>('loading');
  const [gradingResult, setGradingResult] = useState<{
    passed: boolean;
    score: number;
    feedback: string;
    testCases: { input: string; expected: string; actual: string; passed: boolean }[];
  } | null>(null);

  useEffect(() => {
    // 문제 변경 시 코드 초기화
    setCode(problem.initialCode || '# 여기에 코드를 작성하세요\n');
  }, [problem]);

  const handleSubmit = () => {
    setShowGradingModal(true);
    setGradingState('loading');
    
    // 채점 시뮬레이션
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% 성공률
      
      if (isSuccess) {
        setGradingState('success');
        setGradingResult({
          passed: true,
          score: 100,
          feedback: '완벽합니다! 리스트 생성과 요소 추가를 정확히 구현했습니다.',
          testCases: [
            { input: '[]', expected: '[1, 2, 3]', actual: '[1, 2, 3]', passed: true },
            { input: 'empty list', expected: '[1, 2, 3]', actual: '[1, 2, 3]', passed: true },
          ]
        });
      } else {
        setGradingState('error');
        setGradingResult({
          passed: false,
          score: 60,
          feedback: '아쉽습니다. append() 메소드 사용법을 다시 확인해보세요.',
          testCases: [
            { input: '[]', expected: '[1, 2, 3]', actual: '[1, 2]', passed: false },
            { input: 'empty list', expected: '[1, 2, 3]', actual: 'Error', passed: false },
          ]
        });
      }
    }, 2000);
  };

  const handleTestRun = () => {
    onRunCode(testInput);
  };

  const closeModal = () => {
    setShowGradingModal(false);
    if (gradingResult?.passed) {
      onSubmitCode(code);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Problem Description */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-gray-800">{problem.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{problem.description}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0 ml-4">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>3000 ms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                <span>128 MB</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 border-t">
           <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm font-medium py-3">입출력 예시 보기</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 text-xs mt-2">
                  <div>
                    <div className="font-semibold text-gray-700 mb-1">📥 Input Example 1</div>
                    <div className="bg-gray-100 p-2 rounded border text-gray-600 font-mono">-</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700 mb-1">📤 Output Example 1</div>
                    <div className="bg-gray-100 p-2 rounded border text-gray-600 font-mono">ABCDEFGHIJKLMNOPQRSTUVWXY</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      {/* Code Editor Section */}
      <Card className="flex-1 bg-gray-800 text-white flex flex-col shadow-lg border-gray-700">
        <div className="flex items-center justify-between p-3 border-b border-gray-700/80">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-base text-gray-200">Give it a try!</h3>
            <div className="flex text-yellow-400">
              {[...Array(3)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              {[...Array(2)].map((_, i) => (
                <Star key={i+3} className="w-4 h-4 fill-gray-600" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-gray-800 border-none resize-none font-mono text-sm p-4 text-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="코드를 이곳에 작성하세요..."
          />
        </div>

        {/* Footer / Test Section */}
        <div className="border-t border-gray-700/80 bg-gray-800/50">
          <div className="flex items-center justify-between p-2.5">
            <button onClick={() => setIsTestVisible(!isTestVisible)} className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-md">
              Test with custom input
              {isTestVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-3">
               <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleSubmit} 
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold h-8 text-xs px-4 rounded-md shadow-lg transition-transform transform hover:scale-105"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                채점 요청
              </Button>
              <Button 
                onClick={handleTestRun} 
                size="sm" 
                className="bg-gray-700 hover:bg-gray-600 text-white h-8 text-xs font-semibold px-4"
              >
                <Play className="w-3 h-3 mr-1.5" />
                Run
              </Button>
            </div>
          </div>
          {isTestVisible && (
            <div className="p-3 border-t border-gray-700/80 bg-gray-700/60">
              <textarea
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="테스트 케이스를 위한 입력을 여기에 작성하세요."
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-xs mb-2 resize-none h-20 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="bg-black/30 p-3 rounded-md text-xs min-h-[60px] max-h-[120px] overflow-y-auto font-mono">
                <div className="text-gray-300 whitespace-pre-wrap">
                  {output || '코드를 실행하면 결과가 여기에 표시됩니다.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Grading Modal */}
      {showGradingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 max-w-[90vw] bg-white">
            <div className="p-6">
              {gradingState === 'loading' && (
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-semibold mb-2">채점 중...</h3>
                  <p className="text-gray-600 text-sm">코드를 분석하고 있습니다.</p>
                </div>
              )}

              {gradingState === 'success' && gradingResult && (
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-semibold mb-2 text-green-800">통과!</h3>
                  <div className="text-2xl font-bold mb-2 text-green-600">{gradingResult.score}점</div>
                  <p className="text-gray-700 text-sm mb-4">{gradingResult.feedback}</p>
                  
                  <div className="text-left mb-4">
                    <h4 className="font-medium text-sm mb-2">테스트 케이스 결과:</h4>
                    {gradingResult.testCases.map((testCase, index) => (
                      <div key={index} className="bg-green-50 p-2 rounded text-xs mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-medium">Test Case {index + 1}: Passed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={closeModal} className="w-full">다음 문제로</Button>
                </div>
              )}

              {gradingState === 'error' && gradingResult && (
                <div className="text-center">
                  <XCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
                  <h3 className="text-lg font-semibold mb-2 text-red-800">오답</h3>
                  <div className="text-2xl font-bold mb-2 text-red-600">{gradingResult.score}점</div>
                  <p className="text-gray-700 text-sm mb-4">{gradingResult.feedback}</p>
                  
                  <div className="text-left mb-4">
                    <h4 className="font-medium text-sm mb-2">테스트 케이스 결과:</h4>
                    {gradingResult.testCases.map((testCase, index) => (
                      <div key={index} className={`p-2 rounded text-xs mb-2 ${testCase.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="flex items-center gap-2">
                          {testCase.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="font-medium">Test Case {index + 1}: {testCase.passed ? 'Passed' : 'Failed'}</span>
                        </div>
                        {!testCase.passed && (
                          <div className="mt-2 pl-6 border-l-2 border-red-200 text-gray-600">
                            <p><strong>Input:</strong> {testCase.input}</p>
                            <p><strong>Expected:</strong> {testCase.expected}</p>
                            <p><strong>Actual:</strong> {testCase.actual}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button onClick={closeModal} className="w-full">다시 시도</Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
