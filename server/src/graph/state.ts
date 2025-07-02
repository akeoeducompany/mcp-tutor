import { BaseMessage } from "@langchain/core/messages";

/* -------------------------------------------------------------------------- */
/*                           Core State Interfaces                             */
/* -------------------------------------------------------------------------- */

/**
 * 코딩 튜터 에이전트의 메인 상태
 * 사용자 요청 검증부터 튜터링 콘텐츠 생성까지 전 과정의 데이터를 관리
 */
export interface CodingTutorState {
  /** LangGraph 표준 대화 기록 */
  messages: BaseMessage[];

  // --- 요청 검증 관련 ---
  /** 코딩 질문 관련 요청인지 여부 */
  is_request_specific?: boolean;
  /** 사용자에게 보낼 응답 (거부 메시지 또는 최종 결과) */
  response_to_user?: string;
  /** 추출된 사용자 의도 */
  user_intent?: string;

  // --- 검색 쿼리 생성 ---
  /** 생성된 검색 쿼리 목록 */
  search_queries?: string[];
  /** 검색 쿼리 선택 근거 */
  search_rationale?: string;

  // --- 질문 데이터 수집 ---
  /** 최근 N일 동안 BigQuery에서 조회한 질문 원문 */
  recentQuestions?: string[];
  /** 수집된 질문 총 개수 */
  questionCount?: number;
  /** 데이터 수집 시작/종료 날짜 */
  dataRange?: {
    startDate: string;
    endDate: string;
  };

  // --- 분석 결과 ---
  /** 심층 분석 대상으로 선택된 1건 */
  deepDiveCase?: string;
  /** 미니 트렌드 3건 */
  miniTrends?: string[];
  /** 분석 결과 요약 */
  analysisReason?: string;

  // --- 콘텐츠 생성 ---
  /** 튜터링 콘텐츠용 텍스트 (총 6단계) */
  tutoringContent?: string[];
  /** 각 콘텐츠에 대한 이미지 URL */
  imageUrls?: string[];
  /** TTS 오디오 URL (선택사항) */
  ttsUrls?: string[];

  // --- 배포 및 완료 ---
  /** S3에 업로드된 결과 WebView URL */
  publishedUrl?: string;
  /** FCM 푸시 알림 전송 결과 */
  pushNotificationSent?: boolean;
  /** 전체 처리 완료 여부 */
  isCompleted?: boolean;

  // --- 오류 처리 ---
  /** 처리 중 발생한 오류 정보 */
  error?: {
    step: string;
    message: string;
    details?: any;
  };
}

/**
 * 일회성 요청 검증 전용 상태 (validateRequest 노드 결과)
 */
export interface RequestValidationState {
  is_specific: boolean;
  clarification_question: string;
  extracted_requirements: {
    intent?: string;
    messageType?: "analysis" | "inquiry" | "report";
    urgency?: "high" | "medium" | "low";
    [key: string]: unknown;
  };
}

/**
 * 코딩 질문 분석 결과 전용 상태
 */
export interface QuestionAnalysisResult {
  deep_dive_case: string;
  mini_trends: string[];
  analysis_reason: string;
  confidence_score?: number;
}

/* (Config interfaces moved to config.ts) */
