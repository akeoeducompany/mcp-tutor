import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                            Configuration Types                              */
/* -------------------------------------------------------------------------- */

/**
 * 코딩 튜터 에이전트 설정
 */
export interface CodingTutorConfig {
  // --- LLM 모델 설정 ---
  /** 요청 검증용 모델 */
  validation_model?: string;
  /** 검색 쿼리 생성용 모델 */
  search_model?: string;
  /** 문제 분석용 모델 */
  analysis_model?: string;
  /** 튜터링 콘텐츠 생성용 모델 */
  content_model?: string;

  // --- 검색 설정 ---
  /** 생성할 최대 검색 쿼리 개수 */
  max_search_queries?: number;

  // --- 데이터 소스 설정 ---
  /** BigQuery Project ID */
  projectId?: string;
  /** BigQuery Dataset */
  dataset?: string;
  /** BigQuery Table */
  table?: string;
  /** 조회 범위(일) */
  lookbackDays?: number;

  // --- 외부 서비스 설정 ---
  /** 이미지/리소스 업로드할 S3 버킷 이름 */
  s3Bucket?: string;
  /** FCM 푸시 알림 사용 여부 */
  fcmEnabled?: boolean;
  /** TTS 생성 여부 */
  ttsEnabled?: boolean;

  // --- 콘텐츠 설정 ---
  /** 생성할 튜터링 콘텐츠 단계 수 */
  tutoringStepCount?: number;
  /** 미니 트렌드 개수 */
  trendCount?: number;
}

/* -------------------------------------------------------------------------- */
/*                     Optional Zod Schema Helper (runtime)                    */
/* -------------------------------------------------------------------------- */

export const CodingTutorConfigSchema = z.object({
  validation_model: z.string().optional(),
  search_model: z.string().optional(),
  analysis_model: z.string().optional(),
  content_model: z.string().optional(),
  projectId: z.string().optional(),
  dataset: z.string().optional(),
  table: z.string().optional(),
  lookbackDays: z.number().optional(),
  s3Bucket: z.string().optional(),
  fcmEnabled: z.boolean().optional(),
  ttsEnabled: z.boolean().optional(),
  tutoringStepCount: z.number().optional(),
  trendCount: z.number().optional(),
  max_search_queries: z.number().optional(),
});
