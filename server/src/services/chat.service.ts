import { smishing_analysis_graph } from "../graph/graph";
import { HumanMessage } from "@langchain/core/messages";

export async function invokeGraph(threadId: string, message: string) {
  const startTime = Date.now();
  
  try {
    // For PoC, we ignore threadId persistence.
    const initialState = {
      messages: [new HumanMessage(message)]
    } as any;

    const result = await smishing_analysis_graph.invoke(initialState);
    const processingTime = (Date.now() - startTime) / 1000;

    // 스미싱으로 판단된 경우 검색 쿼리도 포함해서 응답
    if (result.is_request_specific) {
      return {
        message: `스미싱 메시지를 분석했습니다.\n\n검색 쿼리 생성 완료:\n${(result.search_queries || []).map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}\n\n근거: ${result.search_rationale || ''}`,
        thread_id: threadId,
        sources: [],
        processing_time: processingTime,
        search_queries_used: result.search_queries || [],
        is_clarification: false
      };
    } else {
      return {
        message: result.response_to_user || "스미싱 메시지만 리포트 작성 가능합니다.",
        thread_id: threadId,
        sources: [],
        processing_time: processingTime,
        search_queries_used: [],
        is_clarification: true
      };
    }
  } catch (error) {
    console.error("Graph invocation error:", error);
    const processingTime = (Date.now() - startTime) / 1000;
    
    return {
      message: "죄송합니다. 처리 중 오류가 발생했습니다. 다시 시도해 주세요.",
      thread_id: threadId,
      sources: [],
      processing_time: processingTime,
      search_queries_used: [],
      is_clarification: false
    };
  }
} 