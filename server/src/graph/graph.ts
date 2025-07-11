import { CodingTutorConfig } from "./config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  SystemMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { StateGraph, START, END } from "@langchain/langgraph";
import { TutorAnnotation, TutorState } from "./state";
import { getTutorSystemPrompt } from "./prompts";

/* -------------------------------------------------------------------------- */
/*                                    Node                                    */
/* -------------------------------------------------------------------------- */

export async function invokeTutor(
  state: TutorState,
  config: RunnableConfig = {},
): Promise<Partial<TutorState>> {
  // 사용자의 메시지가 비어있는지 확인합니다.
  const hasHumanMessage = state.messages.some(
    (m) => m._getType() === "human" && m.content
  );

  // 사용자의 메시지가 없으면, LLM을 호출하는 대신 기본 인사말을 반환합니다.
  if (!hasHumanMessage) {
    const greeting = "안녕하세요! 코딩 학습을 도와드릴 AI 튜터입니다. 무엇을 도와드릴까요?";
    return {
      response_to_user: greeting,
    };
  }
  
  const cfg = (config.configurable ?? {}) as CodingTutorConfig;
  const modelName = cfg.tutor_model ?? "gemini-2.0-flash";

  const llm = new ChatGoogleGenerativeAI({
    model: modelName,
    temperature: 0.3,
    maxRetries: 2,
  });

  const systemPrompt = getTutorSystemPrompt(state.current_code);

  const conversation: BaseMessage[] = [
    new SystemMessage(systemPrompt),
    ...state.messages,
  ];

  const result = await llm.invoke(conversation, config);

  return {
    messages: [result],
    response_to_user: result.content as string,
  };
}


/* -------------------------------------------------------------------------- */
/*                                    Graph                                   */
/* -------------------------------------------------------------------------- */

const builder = new StateGraph(TutorAnnotation)
  .addNode("tutor", invokeTutor as any)
  .addEdge(START, "tutor")
  .addEdge("tutor", END);

export const coding_tutor_graph = builder.compile();