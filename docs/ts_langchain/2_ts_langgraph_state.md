# TypeScript에서 LangGraph State 객체 정의 방법

## 개요

LangGraph TypeScript에서는 상태 관리를 위해 **두 가지 형태의 상태 정의**가 필요합니다:
1. **LangGraph 내부용 상태 정의** (reducer 함수 포함)
2. **TypeScript 타입 정의** (개발자용 타입 힌트)

이는 LangGraph의 상태 병합 메커니즘과 TypeScript의 타입 안전성을 동시에 지원하기 위한 설계입니다.

## 1. LangGraph 상태 정의 구조

### 기본 구조
```typescript
const graphState = {
  fieldName: {
    value: (oldValue, newValue) => mergedValue,
    default: () => defaultValue
  }
}
```

**출처**: LangGraph 공식 문서
> "Each key in the state schema defines how that particular field should be updated when multiple nodes return values for the same key."

### 실제 예제
```typescript
import { BaseMessage } from "@langchain/core/messages";
import { Send } from "@langchain/langgraph";

const graphState = {
  // 메시지 배열 - 새 메시지를 기존 배열에 연결
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
  
  // 단순 문자열 - 새 값으로 덮어쓰기
  target_message: {
    value: (x: string, y: string) => y,
    default: () => "",
  },
  
  // 선택적 필드 - 새 값이 있으면 덮어쓰기, 없으면 기존 값 유지
  case_analysis_report: {
    value: (x: string | undefined, y: string | undefined) => y ?? x,
    default: () => undefined,
  },
  
  // 배열 필드 - Send 객체들의 배열
  next_tasks: {
    value: (x: Send[] | undefined, y: Send[] | undefined) => y ?? x,
    default: () => undefined,
  },
};
```

## 2. TypeScript 타입 정의

### 수동 타입 정의 방식
```typescript
export interface GraphState {
  messages: BaseMessage[];
  target_message: string;
  case_analysis_report?: string;
  next_tasks?: Send[];
}
```

### Zod를 활용한 스키마 기반 방식 (권장)
```typescript
import { z } from "zod";

// Zod 스키마 정의
const GraphStateSchema = z.object({
  messages: z.array(z.any()).default([]),
  target_message: z.string().default(""),
  preliminary_check_result: z.enum(["smishing", "not_smishing", "error"]).optional(),
  case_analysis_report: z.string().optional(),
  next_tasks: z.array(z.any()).optional(),
  error: z.string().optional(),
});

// 타입 추출
export type GraphState = z.infer<typeof GraphStateSchema>;

// 검증 함수
export function validateGraphState(state: unknown): GraphState {
  return GraphStateSchema.parse(state);
}
```

## 3. StateGraph 생성

### 기본 생성 방법
```typescript
import { StateGraph } from "@langchain/langgraph";

// @ts-ignore로 타입 오류 우회 (현재 TypeScript 구현의 한계)
const workflow = new StateGraph(graphState);
```

**출처**: LangChain TypeScript 구현
> "LangChain is written in TypeScript and provides type definitions for all of its public APIs."

하지만 현재 LangGraph TypeScript 구현에서는 복잡한 타입 추론으로 인해 `@ts-ignore`가 필요한 경우가 많습니다.

## 4. 상태 병합 로직 (State Reduction)

### 병합 함수 타입들

#### 1. 배열 연결 (Array Concatenation)
```typescript
messages: {
  value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
  default: () => [],
}
```

#### 2. 값 덮어쓰기 (Value Override)
```typescript
target_message: {
  value: (x: string, y: string) => y, // 새 값으로 덮어쓰기
  default: () => "",
}
```

#### 3. 조건부 업데이트 (Conditional Update)
```typescript
error: {
  value: (x: string | undefined, y: string | undefined) => y ?? x, // 새 값이 있으면 사용, 없으면 기존 값 유지
  default: () => undefined,
}
```

## 5. 노드 함수에서 상태 사용

### 노드 함수 시그니처
```typescript
async function analysisNode(
  state: GraphState, 
  config?: RunnableConfig
): Promise<Partial<GraphState>> {
  // 상태 처리 로직
  return {
    case_analysis_report: "분석 결과",
    error: undefined
  };
}
```

### 상태 검증
```typescript
function validateState(state: GraphState): boolean {
  if (!state.target_message) {
    throw new Error("분석 대상 메시지가 없습니다.");
  }
  return true;
}
```

## 6. 메모리와 상태 관리

**출처**: LangChain 메모리 문서
> "Chains can be initialized with a Memory object, which will persist data across calls to the chain. This makes a Chain stateful."

LangGraph에서는 상태가 자동으로 노드 간에 전달되며, 각 노드는 부분 상태를 반환하여 전체 상태를 업데이트합니다.

```typescript
// 메모리 유지 예제
const state1 = await node1(initialState);
const state2 = await node2({ ...initialState, ...state1 });
const finalState = { ...initialState, ...state1, ...state2 };
```

## 7. 실제 구현 예제

### 완전한 상태 정의
```typescript
import { END, StateGraph } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { Send } from "@langchain/langgraph";
import { z } from "zod";

// 1. Zod 스키마
const SmishingAnalysisStateSchema = z.object({
  messages: z.array(z.any()).default([]),
  target_message: z.string().default(""),
  preliminary_check_result: z.enum(["smishing", "not_smishing", "error"]).optional(),
  case_analysis_report: z.string().optional(),
  news_summary_report: z.string().optional(),
  scenario_report: z.string().optional(),
  final_report: z.string().optional(),
  next_tasks: z.array(z.any()).optional(),
  error: z.string().optional(),
});

// 2. 타입 추출
export type SmishingAnalysisState = z.infer<typeof SmishingAnalysisStateSchema>;

// 3. LangGraph용 상태 정의
const graphState = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
  target_message: {
    value: (x: string, y: string) => y,
    default: () => "",
  },
  preliminary_check_result: {
    value: (x: "smishing" | "not_smishing" | "error" | undefined, 
           y: "smishing" | "not_smishing" | "error" | undefined) => y ?? x,
    default: () => undefined,
  },
  case_analysis_report: {
    value: (x: string | undefined, y: string | undefined) => y ?? x,
    default: () => undefined,
  },
  final_report: {
    value: (x: string | undefined, y: string | undefined) => y ?? x,
    default: () => undefined,
  },
  next_tasks: {
    value: (x: Send[] | undefined, y: Send[] | undefined) => y ?? x,
    default: () => undefined,
  },
  error: {
    value: (x: string | undefined, y: string | undefined) => y ?? x,
    default: () => undefined,
  },
};

// 4. StateGraph 생성
const workflow = new StateGraph(graphState);
```

## 8. 주의사항 및 제한사항

### TypeScript 타입 오류
현재 LangGraph TypeScript 구현에서는 복잡한 타입 추론으로 인해 다음과 같은 해결책이 필요할 수 있습니다:

```typescript
// @ts-ignore를 사용한 타입 오류 우회
// @ts-ignore
workflow.addNode("nodeName", nodeFunction);
```

**출처**: LangChain 기여 가이드라인
> "we do enforce certain linting, formatting, and documentation standards in the codebase. If you are finding these difficult (or even just annoying) to work with, feel free to contact a maintainer for help"

### 상태 불변성
LangGraph는 상태의 불변성을 보장하지 않으므로, 노드에서 상태를 직접 수정하지 말고 새로운 객체를 반환해야 합니다:

```typescript
// ❌ 잘못된 방법
function badNode(state: GraphState): Partial<GraphState> {
  state.messages.push(newMessage); // 직접 수정
  return state;
}

// ✅ 올바른 방법
function goodNode(state: GraphState): Partial<GraphState> {
  return {
    messages: [...state.messages, newMessage] // 새 배열 생성
  };
}
```

## 9. 결론

LangGraph TypeScript에서의 상태 정의는 다음과 같은 이유로 이중 구조를 가집니다:

1. **상태 병합 로직**: LangGraph 엔진이 여러 노드의 결과를 병합하는 방법을 정의
2. **타입 안전성**: TypeScript 개발 환경에서의 타입 체크와 IntelliSense 지원
3. **런타임 검증**: Zod를 통한 런타임 상태 검증

이러한 구조는 복잡해 보이지만, 대규모 멀티에이전트 시스템에서 상태 일관성과 타입 안전성을 보장하는 데 필수적입니다.
