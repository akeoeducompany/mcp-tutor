"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smishing_validation_graph = exports.weekly_report_graph = void 0;
exports.validateSmishingRequest = validateSmishingRequest;
const google_genai_1 = require("@langchain/google-genai");
const prompts_1 = require("./prompts");
const langgraph_1 = require("@langchain/langgraph");
// Temporary placeholder graph until full logic is implemented.
exports.weekly_report_graph = {
    async invoke(state) {
        return {
            ok: true,
            note: "weekly_report_graph is not yet implemented.",
            state,
        };
    },
};
/* -------------------------------------------------------------------------- */
/*                           Helper Functions                                  */
/* -------------------------------------------------------------------------- */
function getLatestUserMessage(messages) {
    // 마지막 HumanMessage 텍스트를 가져오거나 빈 문자열
    for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (msg._getType?.() === "human") {
            return msg.content;
        }
    }
    return "";
}
/* -------------------------------------------------------------------------- */
/*                         Smishing Validation Node                            */
/* -------------------------------------------------------------------------- */
async function validateSmishingRequest(state, config = {}) {
    const cfg = (config.configurable ?? {});
    const modelName = cfg.validation_model ?? "gemini-2.5-flash";
    const llm = new google_genai_1.ChatGoogleGenerativeAI({
        model: modelName,
        temperature: 0.1,
        maxRetries: 2,
    });
    const structuredLLM = llm.withStructuredOutput({
        name: "request_validation",
        schema: {
            type: "object",
            properties: {
                is_specific: { type: "boolean" },
                clarification_question: { type: "string" },
                extracted_requirements: {
                    type: "object",
                    properties: {
                        intent: { type: "string" }
                    }
                }
            },
            required: ["is_specific", "clarification_question", "extracted_requirements"]
        }
    });
    const userMsg = getLatestUserMessage(state.messages);
    const prompt = (0, prompts_1.getValidationPrompt)(userMsg);
    const result = await structuredLLM.invoke(prompt, config);
    return {
        is_request_specific: result.is_specific,
        response_to_user: result.clarification_question ?? "",
        user_intent: result.extracted_requirements.intent ?? "",
    };
}
/* -------------------------------------------------------------------------- */
/*                      4. Validation-Only Graph Compile                       */
/* -------------------------------------------------------------------------- */
/* -------------------- Validation State Annotation ------------------------- */
const ValidationAnnotation = langgraph_1.Annotation.Root({
    messages: (0, langgraph_1.Annotation)({
        reducer: (curr, upd) => curr.concat(upd),
        default: () => [],
    }),
    // 결과 필드들 (overwrite)
    is_request_specific: (0, langgraph_1.Annotation)(),
    response_to_user: (0, langgraph_1.Annotation)(),
    user_intent: (0, langgraph_1.Annotation)(),
});
/* ---------------------- Build validation graph ---------------------------- */
const validationBuilder = new langgraph_1.StateGraph(ValidationAnnotation)
    .addNode("validate_request", validateSmishingRequest)
    .addEdge(langgraph_1.START, "validate_request")
    .addEdge("validate_request", langgraph_1.END);
exports.smishing_validation_graph = validationBuilder.compile();
