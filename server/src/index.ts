import "dotenv/config";
import express from "express";
import chatRouter from "./api/v1/chat.routes";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", chatRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
}); 