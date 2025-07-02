import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Database, Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';

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
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradingState, setGradingState] = useState<'loading' | 'success' | 'error'>('loading');
  const [gradingResult, setGradingResult] = useState<{
    passed: boolean;
    score: number;
    feedback: string;
    testCases: { input: string; expected: string; actual: string; passed: boolean }[];
  } | null>(null);

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
    <div className="h-full flex flex-col">
      {/* Problem Description with integrated Input/Output/Example */}
      <Card className="p-4 mb-3 bg-white border-l-4 border-l-yellow-400">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-800 text-base">{problem.title}</h3>
          <div className="flex items-center gap-3 ml-auto text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>3000 ms</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>128 MB</span>
            </div>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed mb-3 text-sm">{problem.description}</p>
        
        {/* Compact Input/Output/Example */}
        <div className="bg-gray-50 p-2.5 rounded-lg">
          <div className="grid grid-cols-3 gap-2.5 text-xs">
            <div>
              <div className="font-medium text-gray-600 mb-1 text-xs">📥 Input</div>
              <div className="bg-white p-1.5 rounded border text-gray-500">-</div>
            </div>
            <div>
              <div className="font-medium text-gray-600 mb-1 text-xs">📤 Output</div>
              <div className="bg-white p-1.5 rounded border text-gray-500">ABCDEFGHIJKLMNOPQRSTUVWXY</div>
            </div>
            <div>
              <div className="font-medium text-gray-600 mb-1 text-xs">📝 Example</div>
              <div className="bg-white p-1.5 rounded border">
                <div className="text-gray-400 text-xs">Input: -</div>
                <div className="text-gray-400 text-xs">Output: ABCDEFGHIJKLMNOPQRSTUVWXY</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Code Editor Section with integrated Test */}
      <Card className="flex-1 bg-gray-900 text-white flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-28 bg-gray-800 border-gray-600 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSubmit}
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-xs"
          >
            Submit
          </Button>
        </div>

        <div className="flex-1">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-56 bg-transparent border-none resize-none font-mono text-xs p-3 text-white focus:ring-0"
            placeholder="여기에 코드를 작성하세요..."
          />
        </div>

        {/* Test Section - Integrated at bottom */}
        <div className="border-t border-gray-700">
          <div className="flex items-center justify-between p-2.5 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-base">⚡</span>
              <span className="font-medium text-xs">Test it out</span>
            </div>
            <Button onClick={handleTestRun} size="sm" variant="outline" className="border-gray-600 h-6 text-xs">
              <Play className="w-3 h-3 mr-1" />
              Run
            </Button>
          </div>
          <div className="p-2.5">
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="테스트 케이스 입력"
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs mb-2"
            />
            <div className="bg-gray-800 p-2 rounded text-xs min-h-[50px] max-h-[70px] overflow-y-auto">
              <div className="text-gray-300 whitespace-pre-wrap">
                {output || '코드를 실행하면 결과가 여기에 표시됩니다.'}
              </div>
            </div>
          </div>
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
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="font-medium">테스트 {index + 1}: 통과</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button onClick={closeModal} className="w-full bg-green-600 hover:bg-green-700">
                    다음 문제로
                  </Button>
                </div>
              )}

              {gradingState === 'error' && gradingResult && (
                <div className="text-center">
                  <XCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
                  <h3 className="text-lg font-semibold mb-2 text-red-800">실패</h3>
                  <div className="text-2xl font-bold mb-2 text-red-600">{gradingResult.score}점</div>
                  <p className="text-gray-700 text-sm mb-4">{gradingResult.feedback}</p>
                  
                  <div className="text-left mb-4">
                    <h4 className="font-medium text-sm mb-2">테스트 케이스 결과:</h4>
                    {gradingResult.testCases.map((testCase, index) => (
                      <div key={index} className="bg-red-50 p-2 rounded text-xs mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <XCircle className="w-3 h-3 text-red-600" />
                          <span className="font-medium">테스트 {index + 1}: 실패</span>
                        </div>
                        <div className="text-gray-600">
                          <div>기대값: {testCase.expected}</div>
                          <div>실제값: {testCase.actual}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={closeModal} variant="outline" className="flex-1">
                      다시 시도
                    </Button>
                    <Button onClick={closeModal} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      힌트 요청
                    </Button>
                  </div>
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
