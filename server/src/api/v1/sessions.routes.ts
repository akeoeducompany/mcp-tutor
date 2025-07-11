import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

interface Session {
  userId: string;
  topics: string[];
  persona: string;
  startTime: Date;
  history: any[];
  endTime?: Date;
}

export const sessions = new Map<string, Session>();

const router = Router();

router.post("/sessions/start", (req, res) => {
  const { userId, topics, persona } = req.body as {
    userId: string;
    topics: string[];
    persona: string;
  };

  if (!userId || !Array.isArray(topics) || topics.length === 0 || !persona) {
    return res.status(400).json({
      error: "Missing required fields: userId, topics (non-empty array), and persona are required.",
    });
  }

  const sessionId = uuidv4();
  const newSession: Session = {
    userId,
    topics,
    persona,
    startTime: new Date(),
    history: [],
  };
  sessions.set(sessionId, newSession);

  console.log(`Session started: ${sessionId} for user: ${userId}`);

  res.status(201).json({ sessionId });
});

router.post("/sessions/:sessionId/end", (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: "Session not found." });
  }

  session.endTime = new Date();
  sessions.set(sessionId, session);

  console.log(`Session ended: ${sessionId}`);

  res.status(200).json({ message: "Session ended successfully." });
});

export default router; 