import { Router, Request, Response } from "express";
import { invokeGraph } from "../../services/chat.service";

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: API for chat interactions with the AI Tutor
 */

const router = Router();

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Send a message to the AI tutor
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *                 format: uuid
 *                 description: The current session ID
 *               message:
 *                 type: string
 *                 description: The user's message. Can be empty for initial greeting.
 *               context:
 *                 type: object
 *                 properties:
 *                   currentCode:
 *                     type: string
 *     responses:
 *       '200':
 *         description: AI tutor's response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: object
 *                   properties:
 *                      sender:
 *                          type: string
 *                          example: "tutor"
 *                      text:
 *                          type: string
 *                          example: "좋은 질문이에요!..."
 *       '500':
 *         description: Internal ServerError
 */
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { sessionId, message, code } = req.body as { sessionId: string; message: string; code?: string };
    const result = await invokeGraph(sessionId, message, code);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router; 