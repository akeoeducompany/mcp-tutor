# AI 코딩 튜터 API 설계

이 문서는 AI 코딩 튜터 프로젝트의 백엔드 API 사양을 정의합니다. API는 세션 관리, 챗봇 상호작용, 코드 실행 및 채점, 결과 리포트 기능을 중심으로 설계되었습니다.

**Base URL**: `/api/v1`

---

## 1. 세션 관리 (Session Management)

### 1.1. `POST /sessions/start`

튜터링 세션을 시작하고, 고유한 세션 ID를 생성합니다.

-   **Description**: 사용자가 학습할 주제와 ID를 선택한 후 튜터링을 시작할 때 호출됩니다.
-   **Request Body**:
    ```json
    {
      "userId": "string",
      "selectedTopics": ["string"]
    }
    ```
-   **Request Example**:
    ```json
    {
      "userId": "악어학생",
      "selectedTopics": ["list", "function"]
    }
    ```
-   **Response (Success)**:
    ```json
    {
      "sessionId": "unique-session-id-12345",
      "message": "Tutoring session started successfully."
    }
    ```

### 1.2. `POST /sessions/:sessionId/end`

현재 진행 중인 튜터링 세션을 종료합니다.

-   **Description**: 사용자가 '튜터링 종료' 버튼을 클릭할 때 호출됩니다. 세션 데이터를 요약하여 리포트를 생성하고, 리포트 ID를 반환합니다.
-   **URL Parameters**:
    -   `sessionId`: `string` (UUID)
-   **Response (Success)**:
    ```json
    {
      "message": "Session ended successfully.",
      "reportId": "unique-report-id-abcde"
    }
    ```

---

## 2. 챗봇 상호작용 (Chat Interaction)

### 2.1. `POST /chat`

사용자와 AI 튜터 간의 대화를 처리합니다.

-   **Description**: 사용자가 채팅 메시지를 보낼 때 호출됩니다. LangGraph 기반의 튜터링 에이전트가 이 엔드포인트를 통해 응답을 생성합니다. 세션 시작 직후, 프론트엔드에서 이 API를 호출하여 튜터의 첫 환영 메시지를 받아올 수 있습니다.
-   **Request Body**:
    ```json
    {
      "sessionId": "string", // UUID
      "message": "string",
      "context": {
        "currentCode": "string" // (Optional) 현재 코드 에디터의 코드
      }
    }
    ```
-   **Request Example**:
    ```json
    {
      "sessionId": "c2a7e7f6-1234-4567-8901-23456789abcd",
      "message": "리스트는 어떻게 만드나요?",
      "context": {
        "currentCode": "my_list = []"
      }
    }
    ```
-   **Response (Success)**:
    ```json
    {
      "response": {
        "sender": "tutor",
        "text": "좋은 질문이에요! 파이썬에서 리스트는 대괄호 `[]`를 사용해서 만들 수 있어요. 직접 코드를 완성해보시겠어요?"
        // 필요시, 문제 수정, 힌트, 다음 단계 제안 등 추가 데이터 포함 가능
      }
    }
    ```

---

## 3. 코드 실행 및 채점 (Code Execution & Grading)

### 3.1. `POST /code/run`

사용자 코드를 특정 입력값으로 실행하고 결과를 즉시 반환합니다.

-   **Description**: 코드 에디터의 'Run' 또는 'Test it out' 기능에 사용됩니다. 전체 채점 없이 단일 테스트 케이스에 대한 실행 결과를 확인하는 용도입니다.
-   **Request Body**:
    ```json
    {
      "sessionId": "string", // UUID
      "language": "string", // e.g., "python"
      "code": "string",
      "input": "string" // 테스트 케이스 입력값
    }
    ```
-   **Response (Success)**:
    ```json
    {
      "stdout": "[1, 2, 3]\n",
      "stderr": "",
      "executionTimeMs": 15
    }
    ```

### 3.2. `POST /code/submit`

사용자 코드를 모든 테스트 케이스에 대해 채점합니다.

-   **Description**: 사용자가 'Submit' 버튼을 클릭하여 최종 코드를 제출할 때 호출됩니다.
-   **Request Body**:
    ```json
    {
      "sessionId": "string", // UUID
      "language": "string",
      "problemId": "string", // 현재 풀고 있는 문제의 ID
      "code": "string"
    }
    ```
-   **Response (Success)**: (프론트엔드의 채점 모달 UI와 동일한 구조)
    ```json
    {
      "passed": true,
      "score": 100,
      "feedback": "완벽합니다! 모든 테스트 케이스를 통과했습니다.",
      "testCases": [
        { "input": "...", "expected": "...", "actual": "...", "passed": true },
        { "input": "...", "expected": "...", "actual": "...", "passed": true }
      ]
    }
    ```
    
---

## 4. 학습 리포트 (Learning Report)

### 4.1. `GET /reports/:reportId`

완료된 튜터링 세션의 상세 리포트를 조회합니다.

-   **Description**: 튜터링 종료 후 결과 페이지에서 호출됩니다.
-   **URL Parameters**:
    -   `reportId`: `string` (리포트 ID)
-   **Response (Success)**:
    ```json
    {
      "reportId": "unique-report-id-abcde",
      "userId": "악어학생",
      "sessionStartTime": "2024-08-01T10:00:00Z",
      "sessionEndTime": "2024-08-01T10:45:00Z",
      "totalDurationMinutes": 45,
      "completedTopics": [
        { "topic": "list", "label": "리스트", "performance": "Excellent" },
        { "topic": "function", "label": "함수", "performance": "Good" }
      ],
      "summary": "리스트와 함수 기본 개념을 성공적으로 학습했으며, 관련 문제를 모두 해결했습니다.",
      "chatHistory": [
        // 전체 대화 기록
      ]
    }
    ```
