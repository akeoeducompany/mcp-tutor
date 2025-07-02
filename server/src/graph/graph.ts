import {
  CodingTutorState,
  RequestValidationState,
} from "./state";
import { CodingTutorConfig } from "./config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import {
  SystemMessage,
  HumanMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { getRequestValidationPrompt, getSearchQueryPrompt } from "./prompts";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                               */
/* -------------------------------------------------------------------------- */

function getLatestUserMessage(messages: BaseMessage[]): string {
  // 마지막 HumanMessage 텍스트를 가져오거나 빈 문자열
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg._getType?.() === "human") {
      return msg.content as string;
    }
  }
  return "";
}

/* -------------------------------------------------------------------------- */
/*                         1. Request Validation Node                         */
/* -------------------------------------------------------------------------- */

export async function validateCodingQuestionRequest(
  state: CodingTutorState,
  config: RunnableConfig = {},
): Promise<Partial<CodingTutorState>> {
  const cfg = (config.configurable ?? {}) as CodingTutorConfig;
  const modelName = cfg.validation_model ?? "gemini-2.5-flash";

  const llm = new ChatGoogleGenerativeAI({
    model: modelName,
    temperature: 0.1,
    maxRetries: 2,
  });

  const ValidationSchema = z.object({
    is_specific: z.boolean(),
    clarification_question: z.string(),
    extracted_requirements: z.object({
      intent: z.string().optional(),
    }),
  });

  const structuredLLM = llm.withStructuredOutput(ValidationSchema);

  const userMsg = getLatestUserMessage(state.messages);
  const prompt = getRequestValidationPrompt(userMsg);

  const result = await structuredLLM.invoke(prompt, config);

  return {
    is_request_specific: result.is_specific,
    response_to_user: result.clarification_question ?? "",
    user_intent: result.extracted_requirements.intent ?? "",
  };
}

/* -------------------------------------------------------------------------- */
/*                         2. Search Query Generation Node                     */
/* -------------------------------------------------------------------------- */

export async function generateSearchQueries(
  state: CodingTutorState,
  config: RunnableConfig = {},
): Promise<Partial<CodingTutorState>> {
  const cfg = (config.configurable ?? {}) as CodingTutorConfig;
  const modelName = cfg.search_model ?? "gemini-2.5-flash";
  const maxQueries = cfg.max_search_queries ?? 3;

  const llm = new ChatGoogleGenerativeAI({
    model: modelName,
    temperature: 0.3,
    maxRetries: 2,
  });

  const SearchQuerySchema = z.object({
    rationale: z.string(),
    queries: z.array(z.string()),
  });

  const structuredLLM = llm.withStructuredOutput(SearchQuerySchema);

  const userMsg = getLatestUserMessage(state.messages);
  const userIntent = state.user_intent || "코딩 인터뷰 문제 분석";
  const prompt = getSearchQueryPrompt(userMsg, userIntent, maxQueries);

  const result = await structuredLLM.invoke(prompt, config);

  return {
    search_queries: result.queries,
    search_rationale: result.rationale,
  };
}

/* -------------------------------------------------------------------------- */
/*                         3. Validation-Only Graph Compile                    */
/* -------------------------------------------------------------------------- */

/* -------------------- Validation State Annotation ------------------------- */

const ValidationAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (curr, upd) => curr.concat(upd),
    default: () => [],
  }),
  // 결과 필드들 (overwrite)
  is_request_specific: Annotation<boolean>(),
  response_to_user: Annotation<string>(),
  user_intent: Annotation<string>(),
});

type ValidationState = typeof ValidationAnnotation.State;

/* ---------------------- Build validation graph ---------------------------- */

const validationBuilder = new StateGraph(ValidationAnnotation)
  .addNode("validate_request", validateCodingQuestionRequest as any)
  .addEdge(START, "validate_request")
  .addEdge("validate_request", END);

/* -------------------------------------------------------------------------- */
/*                      4. Enhanced Graph with Search Queries                  */
/* -------------------------------------------------------------------------- */

/* -------------------- Enhanced State Annotation --------------------------- */

const EnhancedAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (curr, upd) => curr.concat(upd),
    default: () => [],
  }),
  // Validation 결과 필드들
  is_request_specific: Annotation<boolean>(),
  response_to_user: Annotation<string>(),
  user_intent: Annotation<string>(),
  // Search Query 결과 필드들
  search_queries: Annotation<string[]>(),
  search_rationale: Annotation<string>(),
});

type EnhancedState = typeof EnhancedAnnotation.State;

/* ---------------------- Conditional Logic ---------------------------- */

function shouldProceedToSearch(state: EnhancedState): string {
  // 스미싱 메시지로 판단되면 검색 쿼리 생성으로 진행
  if (state.is_request_specific) {
    return "generate_queries";
  }
  // 아니면 바로 종료
  return END;
}

/* ---------------------- Build enhanced graph ---------------------------- */

const enhancedBuilder = new StateGraph(EnhancedAnnotation)
  .addNode("validate_request", validateCodingQuestionRequest as any)
  .addNode("generate_queries", generateSearchQueries as any)
  .addEdge(START, "validate_request")
  .addConditionalEdges("validate_request", shouldProceedToSearch)
  .addEdge("generate_queries", END);

export const coding_tutor_graph = enhancedBuilder.compile();

// 기존 validation-only 그래프도 유지 (하위 호환성)
export const request_validation_graph = validationBuilder.compile();