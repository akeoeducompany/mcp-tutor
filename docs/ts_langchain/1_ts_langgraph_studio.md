# TypeScript LangGraph Studio 개발 가이드 (2025.07 기준)

## 개요

LangGraph Studio는 LangGraph 애플리케이션을 시각화하고 디버깅할 수 있는 전용 IDE입니다. TypeScript/JavaScript 환경에서 `@langchain/langgraph-cli`를 사용하여 개발 서버를 실행하고 Studio에서 상호작용할 수 있습니다.

## 필수 조건

### 1. 시스템 요구사항 (macOS)
- **Node.js**: 버전 20 이상
- **Docker**: LangGraph Studio 연결을 위해 필요
- **LangSmith API Key**: 무료 계정으로도 사용 가능

### 2. 환경 설정
```bash
# Node.js 버전 확인
node --version  # v20.x.x 이상

# Docker 설치 확인
docker --version
```

## 설치 및 설정

### 1. LangGraph CLI 설치
```bash
# NPX로 실행 (권장 - 항상 최신 버전 사용)
npx @langchain/langgraph-cli

# 또는 전역 설치
npm install -g @langchain/langgraph-cli
```

### 2. 프로젝트 생성
```bash
# 새 프로젝트 생성
npx @langchain/langgraph-cli new my-langgraph-app --template new-langgraph-project-js

# 프로젝트 디렉토리로 이동
cd my-langgraph-app

# 의존성 설치
yarn install
# 또는 npm install
```

### 3. 환경 변수 설정
```bash
# .env.example을 .env로 복사
cp .env.example .env

# .env 파일 편집
# LANGSMITH_API_KEY=lsv2_your_api_key_here
# OPENAI_API_KEY=sk-your_openai_key_here
```

## 개발 서버 실행

### 1. 기본 개발 서버 실행
```bash
# 개발 모드로 서버 시작
npx @langchain/langgraph-cli dev

# 또는 전역 설치한 경우
langgraphjs dev
```

### 2. 개발 서버 옵션
```bash
# 커스텀 포트로 실행
npx @langchain/langgraph-cli dev --port 3000

# 특정 호스트 바인딩
npx @langchain/langgraph-cli dev --host 0.0.0.0 --port 3000

# 자동 리로드 비활성화
npx @langchain/langgraph-cli dev --no-reload

# 브라우저 자동 열기 비활성화
npx @langchain/langgraph-cli dev --no-browser

# Safari 호환성을 위한 터널 사용
npx @langchain/langgraph-cli dev --tunnel
```

### 3. 서버 실행 결과
```bash
>    Ready!
>
>    - API: http://localhost:2024/
>    - Docs: http://localhost:2024/docs
>    - LangGraph Studio Web UI: https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024
```

## LangGraph Studio 사용

### 1. Studio 접속
- 개발 서버 실행 후 출력된 Studio URL로 접속
- 기본 URL: `https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024`

### 2. Safari 사용 시 주의사항
Safari는 localhost HTTP 연결을 차단합니다. 다음 방법 중 하나를 사용하세요:

**방법 1: 터널 사용**
```bash
npx @langchain/langgraph-cli dev --tunnel
```

**방법 2: Chrome/Edge 브라우저 사용**
Chrome이나 Edge 브라우저에서는 localhost HTTP 연결이 허용됩니다.

### 3. Studio 기능
- **그래프 시각화**: 노드와 엣지 구조 확인
- **실시간 상호작용**: 에이전트와 채팅
- **상태 디버깅**: 각 단계별 상태 확인
- **시간 여행**: 과거 상태로 되돌아가기
- **핫 리로드**: 코드 변경 시 자동 업데이트

## 설정 파일 (langgraph.json)

### 기본 설정
```json
{
  "graphs": {
    "agent": "./src/graph.ts:graph"
  },
  "node_version": "20",
  "env": ".env"
}
```

### 고급 설정
```json
{
  "graphs": {
    "agent": "./src/graph.ts:graph",
    "chat": "./src/chat.ts:chatGraph"
  },
  "node_version": "20",
  "env": ".env",
  "dockerfile_lines": [
    "RUN apt-get update && apt-get install -y git"
  ]
}
```

## 프로덕션 배포

### 1. Docker 이미지 빌드
```bash
# Docker 이미지 빌드
npx @langchain/langgraph-cli build -t my-langgraph-app

# 멀티 플랫폼 빌드
npx @langchain/langgraph-cli build -t my-langgraph-app --platform linux/amd64,linux/arm64
```

### 2. Docker Compose로 실행
```bash
# Docker Compose로 서버 실행
npx @langchain/langgraph-cli up

# 커스텀 포트로 실행
npx @langchain/langgraph-cli up --port 8000

# 백그라운드 실행
npx @langchain/langgraph-cli up --wait
```

### 3. Dockerfile 생성
```bash
# 커스텀 배포용 Dockerfile 생성
npx @langchain/langgraph-cli dockerfile ./Dockerfile
```

## 트러블슈팅

### 1. 일반적인 문제
- **Docker 실행 확인**: `docker --version`
- **Node.js 버전 확인**: Node.js 20 이상 필요
- **포트 충돌**: `--port` 옵션으로 다른 포트 사용

### 2. 브라우저 호환성
- **Safari**: `--tunnel` 옵션 사용
- **Brave**: Brave Shields 비활성화 또는 `--tunnel` 사용

### 3. 환경 변수 문제
```bash
# 환경 변수 로드 확인
cat .env

# API 키 유효성 검사
curl -H "Authorization: Bearer $LANGSMITH_API_KEY" https://api.smith.langchain.com/info
```

## 참고 자료

### 공식 문서
- [LangGraph CLI 공식 문서](https://langchain-ai.github.io/langgraph/cloud/reference/cli/)
- [LangGraph Studio GitHub](https://github.com/langchain-ai/langgraph-studio)
- [LangGraph.js CLI NPM](https://www.npmjs.com/package/@langchain/langgraph-cli)

### 템플릿 및 예제
- [LangGraph.js Starter Template](https://github.com/langchain-ai/langgraphjs-studio-starter)
- [LangGraph 공식 예제](https://langchain-ai.github.io/langgraph/examples/)

### 커뮤니티
- [LangChain Discord](https://discord.gg/langchain)
- [LangChain Twitter](https://twitter.com/LangChainAI)

---

**작성일**: 2025년 7월  
**CLI 버전**: @langchain/langgraph-cli v0.0.41  
**Node.js 지원**: v20.x.x 이상  
**플랫폼**: macOS, Windows, Linux
