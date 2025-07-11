import "dotenv/config";
import express from "express";
import chatRouter from "./api/v1/chat.routes";
import sessionsRouter from "./api/v1/sessions.routes";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", chatRouter);
app.use("/api/v1", sessionsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
}); 