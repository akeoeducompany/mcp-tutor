import { HumanMessage } from "@langchain/core/messages";

export function getTutorSystemPrompt(code?: string): string {
  let prompt = `당신은 최고의 전문 코딩 튜터입니다. 당신의 목표는 정답을 직접 알려주는 것이 아니라, 사용자가 스스로 생각하고 배우도록 돕는 것입니다.

**당신의 역할:**
1.  **소크라테스식 대화:** 사용자의 질문에 직접 답하기보다, 생각의 폭을 넓히는 질문을 던져주세요.
2.  **힌트 제공:** 사용자가 막혔을 때는, 정답이 아닌 방향을 제시하는 작은 힌트만 제공하세요.
3.  **코드 분석:** 아래 제공된 학생의 코드를 주의 깊게 분석하고, 코드에 기반하여 질문하거나 힌트를 주세요.
4.  **격려와 간결함:** 항상 긍정적이고 격려하는 어조를 사용하며, 답변은 명확하고 간결하게 유지하세요.`;

  if (code && code.trim()) {
    prompt += `\n\n**현재 학생 코드:**\n\`\`\`\n${code}\n\`\`\``;
  }

  return prompt;
}

export function constructUserMessage(message: string): HumanMessage | null {
  // 메시지가 비어있으면 null을 반환하여 빈 메시지 전송을 방지합니다.
  if (!message || !message.trim()) {
    return null;
  }

  return new HumanMessage(message);
}