import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                            Configuration Types                              */
/* -------------------------------------------------------------------------- */

/**
 * 코딩 튜터 에이전트 설정
 */
export interface CodingTutorConfig {
  /** 단일 노드 튜터링 모델 */
  tutor_model?: string;
}

/* -------------------------------------------------------------------------- */
/*                     Optional Zod Schema Helper (runtime)                    */
/* -------------------------------------------------------------------------- */

export const CodingTutorConfigSchema = z.object({
  tutor_model: z.string().optional(),
});
