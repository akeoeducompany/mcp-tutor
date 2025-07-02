"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidationPrompt = getValidationPrompt;
exports.getSmsAnalysisPrompt = getSmsAnalysisPrompt;
exports.getCardNewsPrompt = getCardNewsPrompt;
exports.getSearchQueryPrompt = getSearchQueryPrompt;
const messages_1 = require("@langchain/core/messages");
/* -------------------------------------------------------------------------- */
/*                           Validation Node Prompts                           */
/* -------------------------------------------------------------------------- */
function getValidationPrompt(userMessage) {
    const systemPrompt = `당신은 스미싱(SMS 피싱) 및 보안 전문가입니다. 사용자의 요청을 분석하여 스미싱 관련 주제인지 판단하고, 적절한 응답을 제공해주세요.

**허용되는 주제 (is_specific: true):**
- 스미싱 메시지 분석 요청
- 피싱 사기 신고 및 상담
- SMS 보안 관련 질문
- 의심스러운 문자 메시지 검증 요청
- 스미싱 대응 방법 문의
- 보안 관련 교육 및 정보 요청

**거부되는 주제 (is_specific: false):**
- 제품 추천 (스마트폰, 앱 등 포함)
- 일반적인 기술 지원
- 스미싱과 무관한 모든 주제
- 단순 잡담이나 인사
- 쇼핑몰, 게임, 엔터테인먼트 관련

**허용 예시:**
- "이 문자가 스미싱인지 확인해주세요: [Web발신] 택배 배송..."
- "스미싱 메시지를 받았을 때 어떻게 대응해야 하나요?"
- "최근 유행하는 스미싱 패턴이 궁금합니다"

**거부 예시:**
- "키보드 추천해주세요"
- "맛있는 식당 알려주세요"
- "날씨가 어때요?"
- "안녕하세요"

응답 형식:
- is_specific: true (스미싱 관련) / false (무관한 주제)
- clarification_question: 거부 시 정중한 안내 메시지, 허용 시 빈 문자열
- extracted_requirements: 스미싱 관련 요청일 경우 세부 의도 추출`;
    return [
        new messages_1.SystemMessage(systemPrompt),
        new messages_1.HumanMessage(`사용자 요청: ${userMessage}`)
    ];
}
/* -------------------------------------------------------------------------- */
/*                        Weekly Report Node Prompts                           */
/* -------------------------------------------------------------------------- */
function getSmsAnalysisPrompt(smsMessages) {
    const systemPrompt = `당신은 스미싱 메시지 분석 전문가입니다. 최근 수집된 SMS 메시지들을 분석하여 다음을 수행해주세요:

1. 가장 심각하거나 새로운 패턴의 스미싱 사례 1건을 선정
2. 주요 트렌드나 패턴 3가지를 추출

분석 기준:
- 새로운 피싱 기법이나 URL 패턴
- 사회적 이슈를 악용한 내용 (택배, 금융, 정부기관 등)
- 사용자에게 미치는 위험도
- 확산 가능성

응답 형식:
- deep_dive_case: 심층 분석할 메시지 (원문)
- mini_trends: 3가지 주요 트렌드 메시지들
- analysis_reason: 선정 이유`;
    const messagesText = smsMessages.map((msg, idx) => `${idx + 1}. ${msg}`).join('\n');
    return [
        new messages_1.SystemMessage(systemPrompt),
        new messages_1.HumanMessage(`분석할 SMS 메시지들:\n${messagesText}`)
    ];
}
function getCardNewsPrompt(deepDiveCase, miniTrends) {
    const systemPrompt = `당신은 보안 전문가이자 카드뉴스 콘텐츠 제작자입니다. 스미싱 사례를 일반 사용자가 이해하기 쉽게 6장의 카드뉴스로 구성해주세요.

카드뉴스 구성:
1. 표지 (제목, 주요 위험 요약)
2. 심층 분석 케이스 소개
3. 심층 분석: 위험 요소 분석
4. 미니 트렌드 1
5. 미니 트렌드 2  
6. 대응 방법 및 예방법

작성 가이드라인:
- 친근하고 따뜻한 톤앤매너
- 전문 용어 최소화, 쉬운 설명
- 구체적인 대응 방법 제시
- 사용자 불안감 조성 금지, 도움이 되는 정보 중심

각 카드는 100자 이내로 간결하게 작성해주세요.`;
    const trendsText = miniTrends.map((trend, idx) => `트렌드 ${idx + 1}: ${trend}`).join('\n');
    return [
        new messages_1.SystemMessage(systemPrompt),
        new messages_1.HumanMessage(`심층 분석 대상: ${deepDiveCase}\n\n주요 트렌드들:\n${trendsText}`)
    ];
}
/* -------------------------------------------------------------------------- */
/*                           Search Query Prompts                              */
/* -------------------------------------------------------------------------- */
function getSearchQueryPrompt(userMessage, userIntent, maxQueries) {
    const systemPrompt = `당신은 제품 검색 전문가입니다. 사용자의 요청을 분석하여 효과적인 검색어를 생성해주세요.

검색어 생성 원칙:
1. 한국 커뮤니티와 리뷰 사이트에서 잘 검색될 수 있는 키워드 사용
2. 각 검색어는 서로 다른 관점을 다뤄야 함
3. 최대 ${maxQueries}개까지 생성
4. 브랜드명, 가격대, 용도, 성능 등 다양한 각도에서 접근

검색어 예시:
- "가성비 게이밍 키보드 추천 2024 디시"
- "10만원 이하 기계식 키보드 후기 클리앙"
- "로지텍 레이저 키보드 리뷰 사용기"

응답 형식:
- queries: 검색어 리스트
- rationale: 각 검색어를 선택한 이유`;
    return [
        new messages_1.SystemMessage(systemPrompt),
        new messages_1.HumanMessage(`사용자 요청: ${userMessage}\n추출된 의도: ${userIntent}`)
    ];
}
