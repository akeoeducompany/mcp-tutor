import { SystemMessage, HumanMessage, BaseMessage } from "@langchain/core/messages";

/* -------------------------------------------------------------------------- */
/*                           Validation Node Prompts                           */
/* -------------------------------------------------------------------------- */

export function getRequestValidationPrompt(userMessage: string): BaseMessage[] {
  const systemPrompt = `당신은 코딩 인터뷰 질문 분석 전문가입니다. 입력된 텍스트가 코딩 인터뷰 질문인지 판단하세요:

**허용 조건 (is_specific: true):**
입력된 텍스트가 실제 코딩 인터뷰 질문인 경우:
- 알고리즘 질문
- 자료구조 질문
- 시스템 디자인 질문
- 코딩 테스트 문제
- 기술 면접 질문
- 라이브 코딩 문제

**허용 예시:**
- "배열이 주어졌을 때, 중복된 숫자를 찾아주세요."
- "연결 리스트의 중간 노드를 찾는 함수를 작성하세요."
- "대규모 소셜 미디어 서비스의 뉴스피드를 어떻게 설계할 것인가요?"

**거부 조건 (is_specific: false):**
- 코딩 질문이 아닌 모든 텍스트 (일반 대화, 인사 등)

응답 형식:
- is_specific: true (코딩 질문) / false (일반 텍스트)
- clarification_question: 거부 시 "코딩 인터뷰 질문에 대해서만 답변할 수 있습니다.", 허용 시 빈 문자열
- extracted_requirements: 허용 시 "코딩 인터뷰 문제 풀이"`;

  return [
    new SystemMessage(systemPrompt),
    new HumanMessage(`분석할 텍스트: ${userMessage}`),
  ];
}

/* -------------------------------------------------------------------------- */
/*                        Weekly Report Node Prompts                           */
/* -------------------------------------------------------------------------- */

export function getWeeklyAnalysisPrompt(questions: string[]): BaseMessage[] {
  const systemPrompt = `당신은 코딩 인터뷰 질문 분석 전문가입니다. 최근 수집된 코딩 질문들을 분석하여 다음을 수행해주세요:

1. 가장 흥미롭거나 교육적인 가치가 높은 질문 1건을 선정
2. 주요 질문 유형이나 카테고리 3가지를 추출

분석 기준:
- 새로운 알고리즘 접근 방식이나 자료구조 활용
- 기술 트렌드를 반영하는 내용
- 학생에게 미치는 교육적 가치
- 문제의 난이도 및 해결 과정의 복잡성

응답 형식:
- deep_dive_case: 심층 분석할 질문 (원문)
- mini_trends: 3가지 주요 트렌드 질문들
- analysis_reason: 선정 이유`;

  const messagesText = questions.map((msg, idx) => `${idx + 1}. ${msg}`).join("\n");

  return [
    new SystemMessage(systemPrompt),
    new HumanMessage(`분석할 코딩 질문들:\n${messagesText}`),
  ];
}

export function getTutoringContentPrompt(deepDiveQuestion: string, questionTrends: string[]): BaseMessage[] {
  const systemPrompt = `당신은 코딩 교육 전문가이자 콘텐츠 제작자입니다. 코딩 인터뷰 사례를 학생이 이해하기 쉽게 6단계의 튜터링 콘텐츠로 구성해주세요.

튜터링 콘텐츠 구성:
1. 문제 이해 (제목, 핵심 요구사항 요약)
2. 심층 분석: 문제 접근 방법 제안
3. 심층 분석: 핵심 로직 및 코드 구현
4. 유사 문제 1
5. 유사 문제 2  
6. 핵심 개념 및 추가 학습 자료

작성 가이드라인:
- 친근하고 격려하는 톤앤매너
- 전문 용어를 쉽게 풀어서 설명
- 구체적인 문제 해결 과정 제시
- 학생의 자신감을 북돋아주는 내용 중심

각 단계는 100자 이내로 간결하게 작성해주세요.`;

  const trendsText = questionTrends.map((trend, idx) => `트렌드 ${idx + 1}: ${trend}`).join("\n");

  return [
    new SystemMessage(systemPrompt),
    new HumanMessage(`심층 분석 대상: ${deepDiveQuestion}\n\n주요 트렌드들:\n${trendsText}`),
  ];
}

/* -------------------------------------------------------------------------- */
/*                           Search Query Prompts                              */
/* -------------------------------------------------------------------------- */

export function getSearchQueryPrompt(userMessage: string, userIntent: string, maxQueries: number): BaseMessage[] {
  const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  const systemPrompt = `당신은 코딩 학습 정보 검색 전문가입니다. 코딩 인터뷰 문제 분석을 위한 효과적인 검색어를 생성해주세요.

검색어 생성 원칙:
1. 코딩 문제 풀이 및 관련 정보를 효과적으로 찾을 수 있는 키워드 사용
2. 각 검색어는 서로 다른 관점을 다뤄야 함
3. 최대 ${maxQueries}개까지 생성
4. 코딩 학습 플랫폼, 기술 블로그, 공식 문서 등 다양한 각도에서 접근
5. 현재 날짜는 ${currentDate}입니다. 최신 정보를 얻을 수 있는 검색어를 생성하세요.

검색 카테고리:
1. 코딩 학습 플랫폼 및 커뮤니티 (프로그래머스, LeetCode, 스택 오버플로우 등)
2. 유사 문제 및 해법 탐색
3. 문제 해결 전략 및 최적화 방법
4. 최신 기술 면접 트렌드

검색어 예시:
- "파이썬 배열 중복 제거 알고리즘 LeetCode"
- "연결 리스트 시간 복잡도 최적화"
- "카카오 코딩 테스트 최신 기출 문제"

응답 형식을 JSON으로 제공하세요:
{
  "rationale": "각 검색어를 선택한 이유에 대한 간단한 설명",
  "queries": ["검색어1", "검색어2", "검색어3"]
}`;

  return [
    new SystemMessage(systemPrompt),
    new HumanMessage(`코딩 인터뷰 문제 분석을 위한 검색어를 생성해주세요:\n분석 대상: ${userMessage}\n추출된 의도: ${userIntent}`),
  ];
}

/* -------------------------------------------------------------------------- */
/*                           Helper Functions                                  */
/* -------------------------------------------------------------------------- */

export function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
}