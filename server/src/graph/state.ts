import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
export interface ProblemContext {
  title: string;
  description: string;
}

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

export const TutorAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (curr, upd) => curr.concat(upd),
    default: () => [],
  }),
  // 현재 문제 컨텍스트
  current_problem: Annotation<ProblemContext | undefined>(),
  // 학생의 현재 코드
  current_code: Annotation<string | undefined>(),
  // 사용자에게 보낼 최종 응답
  response_to_user: Annotation<string>(),
});

export type TutorState = typeof TutorAnnotation.State;
