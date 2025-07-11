import { coding_tutor_graph } from "../graph/graph";
import { constructUserMessage } from "../graph/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { sessions } from "../api/v1/sessions.routes";

export const handleChatMessage = async (
  sessionId: string,
  message: string,
  code: string
) => {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  const { userId, selectedTopics, persona, history } = session;

  console.log(
    `Processing chat for session: ${sessionId}, user: ${userId}, persona: ${persona}`
  );

  // TODO: Pass persona to the graph
  const graphResponse = await coding_tutor_graph.invoke(
    {
      messages: [new HumanMessage(message)],
      code,
      topics: selectedTopics,
    },
    {
      messages: [new HumanMessage(message)],
      code,
      topics: selectedTopics,
    },
  );

  const tutorResponseText = graphResponse.response_to_user || "죄송합니다. 코딩과 관련된 질문만 답변해드릴 수 있어요. 어떤 것을 도와드릴까요?";

  return {
    response: {
      sender: "tutor",
      text: tutorResponseText,
    },
  };
};

export async function invokeGraph(threadId: string, message: string, code?: string) {
  // For PoC, we ignore threadId persistence.
  
  // prompt.ts의 헬퍼 함수를 사용해 사용자 메시지 객체를 생성합니다.
  const userMessage = constructUserMessage(message);

  const initialState = {
    // userMessage가 null이 아닐 경우에만 배열에 담아 전달합니다.
    messages: userMessage ? [userMessage] : [],
    current_code: code,
  };

  try {
    const result = await coding_tutor_graph.invoke(initialState);

    const tutorResponseText = result.response_to_user || "죄송합니다. 코딩과 관련된 질문만 답변해드릴 수 있어요. 어떤 것을 도와드릴까요?";

    return {
      response: {
        sender: "tutor",
        text: tutorResponseText,
      },
    };

  } catch (error) {
    console.error("Graph invocation error:", error);
    return {
      response: {
        sender: "tutor",
        text: "죄송합니다. 답변을 생성하는 중 오류가 발생했어요. 다시 시도해 주세요.",
      },
    };
  }
} 