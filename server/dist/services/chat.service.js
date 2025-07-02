"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeGraph = invokeGraph;
const graph_1 = require("../graph/graph");
const messages_1 = require("@langchain/core/messages");
async function invokeGraph(threadId, message) {
    // For PoC, we ignore threadId persistence.
    const initialState = {
        messages: [new messages_1.HumanMessage(message)]
    };
    const result = await graph_1.smishing_validation_graph.invoke(initialState);
    return result;
}
