# TypeScript + React 기반 코드 에디터 구현 가이드

이 문서는 TypeScript와 React 환경에서 웹 기반 코드 에디터를 구현하는 다양한 방법과 각 선택지의 장단점을 설명합니다.

## 1. 개요

웹 애플리케이션에 내장된 코드 에디터는 사용자가 직접 코드를 작성하고, 실행하며, 제출할 수 있게 해주는 핵심적인 기능입니다. 특히 코딩 교육 플랫폼, 개발자용 툴, 인터랙티브 문서 등에서 중요한 역할을 담당합니다. 좋은 코드 에디터는 구문 강조(Syntax Highlighting), 자동 완성, 에러 표시 등 다양한 기능을 제공하여 사용자 경험을 크게 향상시킵니다.

## 2. 구현 방법 선택

코드 에디터를 구현하는 방법은 요구사항의 복잡성에 따라 크게 두 가지로 나눌 수 있습니다.

| 접근 방식 | 추천 라이브러리 | 장점 | 단점 | 추천 사용 사례 |
| :--- | :--- | :--- | :--- | :--- |
| **기본 에디터** | HTML `<textarea>` | - 별도 라이브러리 불필요<br>- 가볍고 구현이 매우 간단함 | - 구문 강조, 자동 완성 등 기능 부재<br>- 코드 라인 번호, 들여쓰기 등 수동 구현 필요 | 간단한 텍스트 입력이나 코드 스니펫을 붙여넣는 용도 |
| **고급 에디터** | `@monaco-editor/react` | - VS Code와 동일한 강력한 기능 제공<br>- 구문 강조, 자동 완성, 인텔리센스 지원<br>- 다양한 언어 및 테마 지원 | - 라이브러리 크기가 큼<br>- React 버전 호환성 등 초기 설정 시 주의 필요 |本格的な 코딩 학습 환경, 온라인 IDE |

## 3. 구현 상세 가이드

### 3.1. 기본 `<textarea>`를 사용한 에디터 (현재 프로젝트 방식)

가장 간단한 방법으로, 별도 라이브러리 없이 React의 `useState`와 HTML `<textarea>` 엘리먼트를 사용합니다.

**특징**:
-   구현이 매우 간단하고 직관적입니다.
-   별도 의존성이 추가되지 않아 애플리케이션 용량이 가볍게 유지됩니다.

**구현 예시 (`CodeEditor.tsx`)**

```tsx
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea'; // shadcn/ui 컴포넌트
import { Button } from '@/components/ui/button';

const SimpleCodeEditor = () => {
  const [code, setCode] = useState('// 여기에 코드를 작성하세요.');

  const handleRunCode = () => {
    console.log('실행할 코드:', code);
    // 실제 코드 실행 로직 (API 호출 등)
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full resize-none font-mono bg-gray-900 text-white border-gray-700"
        />
      </div>
      <div className="p-2 border-t border-gray-700">
        <Button onClick={handleRunCode}>코드 실행</Button>
      </div>
    </div>
  );
};

export default SimpleCodeEditor;
```

### 3.2. `@monaco-editor/react`를 사용한 고급 에디터

VS Code의 핵심 엔진("Monaco Editor")을 React에서 쉽게 사용할 수 있도록 만든 라이브러리입니다. 풍부한 기능을 제공하여 전문적인 개발 환경을 구축할 수 있습니다.

**1) 설치**
```bash
npm install @monaco-editor/react
```

**2) 구현 예시 (`AdvancedCodeEditor.tsx`)**

```tsx
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';

const AdvancedCodeEditor = () => {
  const [code, setCode] = useState('function hello() {\n  console.log("Hello, world!");\n}');
  const [language, setLanguage] = useState('javascript');

  const handleEditorChange = (value, event) => {
    setCode(value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark" // vs-dark, light 등 테마 선택 가능
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false }, // 미니맵 비활성화
            fontSize: 14,
            wordWrap: 'on',
          }}
        />
      </div>
      <div className="p-2 border-t border-gray-700">
        <Button>코드 제출</Button>
      </div>
    </div>
  );
};

export default AdvancedCodeEditor;
```

**3) 주요 문제 해결 및 팁**

`@monaco-editor/react` 사용 시 발생할 수 있는 주요 문제와 해결 방법입니다.

-   **문제: `TypeError: Cannot read properties of null (reading 'useState')`**
    -   **원인**: React 버전 비호환. `@monaco-editor/react`의 최신 버전은 프로젝트의 React 버전과 맞지 않을 수 있습니다. (예: 라이브러리는 React 19 필요, 프로젝트는 React 18 사용)
    -   **해결**: 프로젝트의 React 버전에 맞는 `@monaco-editor/react`의 특정 버전을 명시하여 설치합니다.
      ```bash
      # React 18 버전을 사용하는 프로젝트의 경우
      npm install @monaco-editor/react@4.6.0
      ```

-   **문제: `ENOENT: no such file or directory, open '.../@monaco-editor/react/dist/index.mjs'`**
    -   **원인**: 라이브러리를 삭제하거나 버전을 변경한 후 Vite 개발 서버의 의존성 캐시가 갱신되지 않아 발생합니다.
    -   **해결**: `node_modules/.vite` 캐시 폴더를 삭제하고 개발 서버를 재시작합니다.
      1.  **캐시 삭제**: `rm -rf front/node_modules/.vite` (프로젝트 구조에 맞게 경로 수정)
      2.  **서버 재시작**: 실행 중인 Vite 서버를 중지(`Ctrl + C`)하고 다시 시작(`npm run dev`).

## 4. 결론

-   **간단한 기능**이나 프로토타입을 제작할 때는 **`<textarea>`**로 시작하는 것이 빠르고 효율적입니다.
-   **실제 사용자에게 코딩 환경을 제공**하고 구문 강조, 자동 완성 등 높은 수준의 기능이 필요하다면 **`@monaco-editor/react`** 가 강력한 솔루션입니다. 단, 도입 시 발생할 수 있는 버전 호환성 및 캐시 문제를 인지하고 대응해야 합니다.
