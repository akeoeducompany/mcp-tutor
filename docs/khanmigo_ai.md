# Khanmigo AI 서비스 리서치 보고서

> 마지막 업데이트: 2025-07-01

## 1. 서비스 개요

| 항목 | 내용 |
| --- | --- |
| 서비스명 | **Khanmigo** (칸미고) |
| 제공사 | Khan Academy (미국 비영리 교육 플랫폼) |
| 출시 | 2023년 3월(Closed Alpha) → 2023년 9월(Waitlist Beta) |
| 기술 기반 | OpenAI GPT-4 Turbo (Khan Academy 전용 API 파트너십) |
| 형태 | 웹 기반 AI 튜터 & 코딩 어시스턴트(Chrome/Edge 등 브라우저) |
| 핵심 목표 | "모든 학습자를 위한 1:1 개인화 과외교사" 제공 |

## 2. 주요 기능

1. **인터랙티브 튜터링**  
   • 학습자 질문에 단계별 힌트, 오답 분석, 추가 연습문제 제안  
   • "Socratic questioning" 기법으로 직접 답을 주기보다 사고 유도  
2. **코딩 컴패니언**  
   • JavaScript/Python 코드 작성, 디버깅, 스타일 가이드 피드백  
   • Khan Academy "음성 기반 JS 콘솔(ProcessingJS)" 환경과 연동  
3. **에세이 피드백**  
   • 글 구조, 논거, 어휘를 기준으로 개선점 제시  
4. **교사용 모드**  
   • 수업 플래닝, 퀴즈 생성, 학생 맞춤 피드백 초안 작성  
   • Classroom dashboard 에 AI 프롬프트 템플릿 제공  
5. **대화 컨텍스트 유지**  
   • 세션 내 학습 기록을 Thread memory 로 전달해 일관성 확보  
6. **학습 안전 가이드**  
   • 부정확 정보, 해로운 콘텐츠 필터링 + 인간 감독 리뷰 워크플로 

## 3. 아키텍처 & 기술 스택(공개 정보 기반 추정)

```mermaid
flowchart TD
    subgraph Frontend
      A[React (Mithril↔React 마이그레이션 중)]
      B[Khan Academy Exercises & LIVE Editor]
    end

    subgraph Backend
      C[GraphQL Gateway] --> D[Service Mesh]
      D -->|LLM Req| E[OpenAI GPT-4 Turbo API]
      D --> F[S3 / RDS : 학습 로그]
    end

    A -- WebSocket/SSE --> C
    B -- REST --> C
```

• **Prompt Engineering**: 내부 "Socratic Tutor System Prompt + 안전 룰셋 + 학습자 프로필" 3-스택  
• **Rate Limiting**: 분당 토큰/쿼리 제한, 교사 계정 우선순위  
• **LLM Instrumentation**: 로그 → Snowflake → Tableau 대시보드

## 4. 요금 모델

| 구분 | 가격(2025Q2) | 비고 |
| --- | --- | --- |
| 학습자(학생) | 무료(기본) / 월 10~14 USD("Khanmigo Pro") | 무료 버전은 데일리 한도제, Pro 는 무제한 채팅 & 코딩 어시스턴트 |
| 교사용 | 월 4 USD | Classroom 관리 기능 포함 |

## 5. 개인정보·윤리

- **COPPA & FERPA** 준수: <13세 학생 데이터 보호, 학부모 동의 절차 내장  
- **데이터 사용**: 챗 로그는 모델 개선 목적 *미사용* (OpenAI 정책 예외 계약)  
- **해로운 콘텐츠 필터**: OpenAI Moderation + 자체 교육 룰셋 2단계 필터  

## 6. 경쟁 서비스 비교

| 항목 | Khanmigo | Duolingo Max | ChatGPT Edu | CodeCombat AI |
| --- | --- | --- | --- | --- |
| 주력 과목 | 수학·과학·코딩 | 외국어 | 범과목 | 코딩(게임형) |
| 메인 기법 | Socratic QA | In-context explain | 일반 문답 | 실습형 퀘스트 |
| 가격 | $10~14 / 월 | $10 / 월 | 캠퍼스 계약 | $9 / 월 |
| 차별점 | 비영리·Open Curriculum | 캐릭터·스토리 | GPT-4 Turbo | 게임화 집중 |

## 7. 벤치마킹 포인트

1. **Socratic 힌트 체계** → 사용자가 스스로 답 찾게 유도  
2. **학생·교사 분리 UX** → 동일 LLM 기능이라도 페르소나별 UI 차등  
3. **LLM + 실시간 코드 실행** → 코딩 피드백 품질 향상  
4. **강력한 안전 필터** → 교육 도메인 특화 금지 목록, 나이별 제한  
5. **투명한 지표 공개** → Chat 품질·Latency·안전 정책을 주기적으로 블로그 공개

## 8. 우리 서비스 적용 시 고려사항

| 영역 | 시사점 | 적용 아이디어 |
| --- | --- | --- |
| 튜터링 방식 | 단계별 질문 → 힌트 → 정답 확인 | `PromptChain` 에 단계 태그 삽입 |
| 교사 지원 | 과제·퀴즈 자동 생성 API | 학습 경로 추천 페이지 연동 |
| 안전성 | 2-Tier Moderation + 인간 검수 | Studio 모드 리뷰 큐 구축 |
| 요금 전략 | 낮은 진입장벽 + Pro 구독 | "Free 5 대화/일" + $8 Pro |

---
**요약**: Khanmigo 는 GPT-4 Turbo 를 활용해 "대화형 과외"를 실현한 대표적 EDU-LLM 사례다. Socratic 대화 설계, 교사용 생성형 도구, 안전 필터가 강점이며, 비영리 모델로 가격 접근성을 확보했다. 우리의 AI 튜터 서비스도 단계별 힌트, 코드 실행 연동, 교사 대시보드, 그리고 엄격한 안전 규정 설계를 벤치마킹할 필요가 있다.
