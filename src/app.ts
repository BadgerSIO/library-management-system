import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import routes from "./app/routes";
import globalErrorHandler from "./middlewares/error.handler";
const app: Application = express();

// Middleware
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Library server running 🥳");
});
app.use("/api", routes);
//global error handler
app.use(globalErrorHandler);
export default app;
