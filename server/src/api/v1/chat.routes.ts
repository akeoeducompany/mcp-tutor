import { Router, Request, Response } from "express";
import { invokeGraph } from "../../services/chat.service";

const router = Router();

router.post("/graph/invoke", async (req: Request, res: Response) => {
  try {
    const { threadId, message } = req.body as { threadId: string; message: string };
    const result = await invokeGraph(threadId, message);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router; 