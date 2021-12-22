import express from "express";
import chalk from "chalk";
import morgan from "morgan";
import Debug from "debug";
import cors from "cors";
import breedsRoutes from "../routes/breedsRoutes";
import usersRoutes from "../routes/usersRoutes";
import { notFoundErrorHandler, globalError } from "./middlewares/errors";

const debug = Debug("doggy:server");

const app = express();

let server;
const initializeServer = (port: string) =>
  new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      debug(chalk.magentaBright(`Listening to port ${port}`));
      resolve(server);
    });

    server.on("error", (error: { code: string }) => {
      debug(chalk.bgRedBright("Error when initializing server."));
      if (error.code === "EADDRINUSE") {
        debug(chalk.bgRedBright(`Port ${port} already in use.`));
      }
      reject(error);
    });
  });

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

app.use("/breeds", breedsRoutes);
app.use("/users", usersRoutes);

app.use(notFoundErrorHandler);
app.use(globalError);

export { app, initializeServer };
