# LangGraph.js를 이용한 장기(20분) 멀티턴 챗봇 구현 가이드

LangChain.js의 `LangGraph`를 사용하여 20분 이상 지속되는 장기 대화를 처리하는 챗봇을 구현할 때 고려해야 할 주요 사항과 기술적 전략을 정리합니다.

## 1. 핵심 과제: 왜 긴 대화가 어려운가?

긴 대화형 AI를 구현하는 것은 단순한 질의응답을 넘어 다음과 같은 과제를 해결해야 합니다.

-   **상태 관리 (State Management)**: 대화가 길어질수록 사용자의 의도, 이전 발언, 생성된 정보 등 추적해야 할 상태가 기하급수적으로 늘어납니다. 단순한 채팅 기록(Chat History)만으로는 복잡한 맥락을 유지하기 어렵습니다.
-   **컨텍스트 윈도우 한계 (Context Window Limitation)**: LLM 모델은 한 번에 처리할 수 있는 토큰의 양(컨텍스트 윈도우)에 제약이 있습니다. 20분 길이의 대화는 필연적으로 이 한계를 초과하므로, 모든 대화 내용을 매번 프롬프트에 넣을 수 없습니다.
-   **동적인 대화 흐름 (Dynamic Conversation Flow)**: 사용자는 대화 도중 의도를 바꾸거나, 이전 정보를 정정하거나, 여러 주제를 넘나들 수 있습니다. 정해진 시나리오 기반의 챗봇으로는 이러한 유연성에 대응하기 힘듭니다.

## 2. LangGraph를 사용하는 이유: 상태 기계(State Machine)로서의 장점

`LangGraph`는 이러한 문제를 해결하기 위해 대화의 흐름을 **상태 기계(State Machine)** 로 모델링합니다.

-   **명시적 상태 관리**: `LangGraph`의 각 노드는 대화의 '상태(State)'를 명시적으로 업데이트합니다. `ChatHistory` 뿐만 아니라, `user_intent`, `retrieved_documents`, `intermediate_steps` 등 대화에 필요한 모든 데이터를 구조화된 상태 객체로 관리할 수 있습니다.
-   **조건부 흐름 제어**: `Conditional Edges`를 통해 상태에 따라 다음 단계를 동적으로 결정할 수 있습니다. 예를 들어, 사용자의 의도가 '질문'이면 `retrieval` 노드를, '요약'이면 `summarization` 노드를 호출하는 등 유연한 분기가 가능합니다.
-   **지속성 및 복원력**: 그래프의 상태를 외부 DB(예: Redis, PostgreSQL)에 저장하면, 사용자가 나중에 돌아와도 이전 대화 상태를 그대로 복원하여 대화를 이어갈 수 있습니다.

## 3. 구현 전략 및 주의사항

### 3.1. `StateGraph` 설계: 어떤 데이터를 추적할 것인가?

가장 중요한 첫 단계는 `State` 객체를 정의하는 것입니다. 20분간의 대화를 위해서는 단순한 메시지 리스트 이상이 필요합니다.

```typescript
// server/src/graph/state.ts 예시

import { BaseMessage } from "@langchain/core/messages";

export interface LongTermChatState {
  // 1. 기본 대화 기록 (필수)
  messages: BaseMessage[];

  // 2. 대화의 핵심 요약 (컨텍스트 압축용)
  conversation_summary?: string;

  // 3. 사용자의 현재 및 과거 의도
  user_intent?: string;
  past_intents?: string[];

  // 4. 검색 또는 API 호출 결과
  retrieved_documents?: any[];
  tool_outputs?: Record<string, any>;

  // 5. 사용자가 제공한 주요 정보
  user_profile?: {
    name?: string;
    interests?: string[];
  };

  // 6. 대화 흐름 제어를 위한 플래그
  is_clarification_needed?: boolean;
}
```

**주의사항**:
-   **상태는 덮어쓰기(overwrite)가 아닌 추가(append) 방식으로 관리**: `Reducer`를 활용하여 `messages`나 `past_intents`와 같은 필드는 새로운 내용이 들어올 때마다 덮어쓰는 것이 아니라 리스트에 추가되도록 설계해야 합니다.
-   **직렬화 가능해야 함**: 상태 객체는 DB에 저장하고 불러올 수 있도록 JSON으로 직렬화(Serializable) 가능해야 합니다. 복잡한 클래스 인스턴스보다는 순수 데이터 객체(POJO)로 유지하는 것이 좋습니다.

### 3.2. 그래프 구조 설계: 노드(Node)와 엣지(Edge)

-   **노드(Node)**: 각 노드는 특정 작업을 수행하는 함수여야 합니다. 너무 많은 일을 하는 거대한 노드 하나보다는, 작은 단위의 여러 노드로 분리하는 것이 테스트와 유지보수에 용이합니다.
    -   `validate_request`: 사용자 입력이 유효한지, 의도가 무엇인지 파악
    -   `generate_search_queries`: 의도에 따라 검색 쿼리 생성
    -   `execute_tools`: 검색이나 API 호출 실행
    -   `update_summary`: 대화가 진행됨에 따라 요약본 업데이트
    -   `generate_response`: 최종 답변 생성
-   **엣지(Edge)**: 노드 간의 연결을 정의합니다.
    -   **`START` -> `validate_request`**: 항상 첫 입력은 검증 노드로 시작합니다.
    -   **`Conditional Edges`**: `validate_request` 노드 이후, `state.user_intent` 값에 따라 `generate_search_queries`로 갈지, `generate_response`로 갈지 등을 결정합니다.
    -   **사이클(Cycle) 허용**: 사용자의 정정 요청(`is_clarification_needed`)이 있다면, 다시 `validate_request`나 `execute_tools` 노드로 돌아가는 순환 구조를 만들어야 합니다.

### 3.3. 메모리 및 컨텍스트 관리 (가장 중요)

20분 분량의 대화 기록 전체를 LLM에 전달하는 것은 불가능합니다. 따라서 컨텍스트를 압축하고 관리하는 전략이 필수적입니다.

-   **대화 요약(Conversation Summarization)**:
    -   **주기적인 요약 노드 추가**: 5~10 턴마다 대화 내용을 요약하여 `state.conversation_summary` 필드를 업데이트하는 노드를 그래프에 추가합니다.
    -   **`ConversationSummaryMemory` 활용**: LangChain에서 제공하는 메모리 모듈을 활용하여, LLM을 통해 이전 대화 내용을 자동으로 요약하고 관리할 수 있습니다.
-   **선별적 메시지 전달**:
    -   프롬프트에 전체 `messages` 리스트를 전달하는 대신, **최근 N개의 메시지**와 **대화 요약본**을 함께 전달합니다.
    -   `prompt = [recent_messages] + [conversation_summary] + [current_user_input]`
-   **임베딩 기반 검색 (RAG)**:
    -   전체 대화 기록을 벡터 DB(e.g., Pinecone, Chroma)에 임베딩하여 저장합니다.
    -   사용자의 현재 질문과 가장 관련성 높은 과거 대화 조각을 의미 기반 검색으로 찾아내 프롬프트에 포함시킵니다. 이는 단순 요약보다 훨씬 정확한 컨텍스트를 제공할 수 있습니다.

### 3.4. 복잡한 상호작용 처리

-   **사용자 의도 변경**: `validate_request` 노드는 단순히 입력을 검증하는 것을 넘어, 현재 입력이 이전 대화의 연장선인지, 아니면 완전히 새로운 주제인지 판단해야 합니다.
-   **정보 정정**: 사용자가 "아니, 그게 아니라..." 와 같이 이전 정보를 정정할 경우, 이를 감지하고 관련 `state` 필드(예: `retrieved_documents`)를 수정하거나 초기화하는 로직이 필요합니다. 조건부 엣지를 통해 이전 노드로 돌아가는 흐름을 구현할 수 있습니다.

## 4. LangChain.js 코드 예시 (기본 구조)

```typescript
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

// 1. 상태 객체 정의 (Annotation 사용)
const ChatAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (curr, upd) => curr.concat(upd),
    default: () => [],
  }),
  // ... 기타 상태 필드들
});

type ChatState = typeof ChatAnnotation.State;

// 2. 그래프 빌더 생성
const graphBuilder = new StateGraph(ChatAnnotation);

// 3. 노드 함수 정의 (async 함수)
async function validateRequest(state: ChatState) {
  // ... 사용자 의도 분석 로직
  return { user_intent: "some_intent" };
}

async function generateResponse(state: ChatState) {
  // ... LLM을 호출하여 답변 생성 로직
  const lastMessage = "Final response";
  return { messages: [new AIMessage(lastMessage)] };
}

// 4. 조건부 엣지 함수 정의
function shouldContinue(state: ChatState): "generate_response" | typeof END {
  if (state.messages.length > 20) { // 예시: 20턴 이상이면 종료
    return END;
  }
  return "generate_response";
}

// 5. 그래프 구성
graphBuilder
  .addNode("validate", validateRequest)
  .addNode("generate", generateResponse)
  .addEdge(START, "validate")
  .addConditionalEdges("validate", shouldContinue) // 이 부분은 실제 로직에 맞게 수정 필요
  .addEdge("generate", "validate"); // Cycle: 답변 생성 후 다시 입력 대기

// 6. 그래프 컴파일
const runnableGraph = graphBuilder.compile();
```

이 가이드가 LangGraph.js를 사용하여 견고하고 확장 가능한 장기 멀티턴 챗봇을 구축하는 데 도움이 되기를 바랍니다.
