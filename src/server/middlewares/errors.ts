import chalk from "chalk";
import Debug from "debug";
import { Request, Response, NextFunction } from "express";

const debug = Debug("doggy:server:errors");

const notFoundErrorHandler = (req: Request, res: Response) => {
  res.status(404).json({ ok: false, error: "Endpoint not found" });
};

const globalError = (
  error: { message?: string; code?: number },
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  debug(chalk.red("An error has ocurred: "), chalk.red(error.message));
  const message = error.code ? error.message : "Fatal error";
  res.status(error.code || 500).json({ ok: false, error: message });
};

export { notFoundErrorHandler, globalError };
