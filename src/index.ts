/* eslint-disable import/first */
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./database";
import { initializeServer } from "./server";

const port = process.env.PORT ?? "5000";

(async () => {
  try {
    await connectDB(process.env.MONGO_DB);
    await initializeServer(port);
  } catch (error) {
    process.exit(1);
  }
})();
