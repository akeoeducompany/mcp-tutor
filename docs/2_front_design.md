# 화면 설계 (UI/UX Design)

**참고**: 이 화면 설계는 **[1_code_interview_prd.md](./1_code_interview_prd.md)의 기능 요구사항**을 기반으로 합니다.

## 1. 핵심 화면 구성

사용자 플로우에 따라 다음과 같은 핵심 화면들로 구성됩니다.

1.  **학습 목표 설정 화면**: 튜터링 세션을 시작하기 전에 학습할 주제를 설정하는 화면입니다.
2.  **메인 튜터링 화면**: AI 튜터와 함께 코딩 학습을 진행하는 핵심 화면입니다.
3.  **학습 리포트 화면**: 튜터링 세션 종료 후, 학습 내용을 요약해서 보여주는 화면입니다.

---

## 2. 화면 상세 설계

### 2.1. 학습 목표 설정 화면

- **목적**: 사용자가 튜터링을 통해 배우고 싶은 구체적인 학습 목표를 설정합니다.
- **구성 요소**:
    - "AI 코딩 튜터" 서비스 제목
    - "무엇을 배우고 싶으신가요?" 와 같은 안내 문구
    - **추천 학습 주제 태그 목록**: 사용자는 이 목록에서 학습하고 싶은 주제를 클릭하여 목표를 설정합니다. (예: `#리스트`, `#함수`, `#반복문`, `#재귀함수`)
    - "튜터링 시작하기" 버튼: 학습 주제가 선택되면 활성화됩니다.

### 2.2. 메인 튜터링 화면 (3-Column Layout)

전체적으로 상단 헤더, 좌측 사이드바, 중앙 컨텐츠, 우측 사이드바로 구성된 3단 레이아웃을 가집니다.

#### **상단 헤더**
- **제목**: `AI Coding Tutor`
- **타이머**: `20:00` 부터 시간이 흐르며, 학습 집중을 돕는 역할을 합니다. (PRD 2.4. 참고)
- **종료 버튼**: "튜터링 종료" 버튼 클릭 시, 세션을 마치고 학습 리포트 화면으로 이동합니다.

#### **좌측 사이드바: 학습 진행도**
- **목적**: 현재 튜터링 세션의 전체적인 흐름과 진도를 보여줍니다.
- **구성 요소**:
    - 현재 학습 목표 (예: "파이썬 리스트 마스터하기")
    - 학습할 문제/개념 목록 (예: "1. 리스트 생성하기", "2. 리스트 아이템 접근", "3. 리스트 슬라이싱")
    - 각 항목별 **학습 완료** 여부 표시 (예: ✅)
    - 클릭 시, 해당 문제와 코드, 대화 내용으로 돌아가 **복습**할 수 있는 기능

#### **중앙: 문제 및 코드 에디터**
- **목적**: 문제가 제시되고, 사용자가 직접 코드를 작성하며 학습하는 공간입니다.
- **구성 요소**:
    - **문제 설명 영역**:
        - AI 튜터가 제시하는 문제나 개념에 대한 설명이 표시됩니다.
    - **코드 에디터 영역**:
        - **기본 코드 스니펫**: 튜터가 이해를 돕기 위해 기본적인 코드 템플릿을 제공할 수 있습니다. 사용자는 이 코드를 수정하거나 처음부터 작성합니다.
        - **실행 버튼**: 작성한 코드를 실행하고, 결과(Output)를 터미널 창에서 바로 확인할 수 있습니다.
        - **제출 버튼**: 작성을 완료한 코드에 대해 AI 튜터의 최종 피드백을 요청합니다.

#### **우측 사이드바: AI 튜터 채팅**
- **목적**: AI 튜터와 실시간으로 대화하며 상호작용하는 공간입니다. 코드에 대해 막히는 부분이나 궁금한 점은 이곳의 채팅창을 통해 언제든지 질문할 수 있습니다.
- **구성 요소**:
    - **대화창**: AI 튜터와 사용자의 대화가 시간 순서대로 표시됩니다.
        - 튜터는 코드에 대한 힌트, 개념 설명, 질문 등을 통해 학습을 유도합니다.
    - **메시지 입력창**: 사용자가 튜터에게 질문이나 코드에 대한 설명을 입력합니다.
- **대화 예시**:
    - **(튜터링 시작 시)**
        - **AI 튜터 🤖**: 안녕하세요! '파이썬 리스트'에 대해 함께 배워볼까요? 첫 번째 문제로, 비어있는 리스트를 만들고 `1`, `2`, `3` 세 개의 숫자를 추가해보세요.
    - **(사용자가 막혔을 때)**
        - **사용자 🧑‍💻**: `AttributeError: 'list' object has no attribute 'add'` 오류가 나는데 어떻게 해야할까요?
        - **AI 튜터 🤖**: 좋은 질문이에요! 파이썬 리스트에 요소를 추가할 때는 `add`가 아니라 다른 메소드를 사용해요. '덧붙이다'라는 뜻을 가진 영어 단어를 떠올려볼까요? 힌트: `app...`로 시작해요.

### 2.3. 학습 리포트 화면
- **목적**: 종료된 튜터링 세션의 내용을 요약하여 제공하고, 사용자의 복습을 돕습니다.
- **구성 요소**:
    - 세션 날짜 및 학습 시간
    - 학습한 주제 목록
    - **핵심 피드백**: AI 튜터가 세션 전반에 대해 요약한 긍정적인 점과 개선점.
    - **코드 및 대화 다시보기**: 학습했던 문제별 최종 코드와 주요 대화 내용을 다시 볼 수 있는 기능.