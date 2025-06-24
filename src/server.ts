import { Server } from "http";
import mongoose from "mongoose";
import config from "./config";
import app from "./app";

let server: Server;
async function bootstrap() {
  try {
    await mongoose.connect(config.databaseUrl as string);
    console.log("Database connected");
    server = app.listen(config.port, () => {
      console.log(`App listening on port ${config.port}`);
    });
  } catch (error) {
    console.log("Error during bootstrap:", error);
  }
}

bootstrap();
