"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const chat_routes_1 = __importDefault(require("./api/v1/chat.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1", chat_routes_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
