"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_service_1 = require("../../services/chat.service");
const router = (0, express_1.Router)();
router.post("/graph/invoke", async (req, res) => {
    try {
        const { threadId, message } = req.body;
        const result = await (0, chat_service_1.invokeGraph)(threadId, message);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = router;
