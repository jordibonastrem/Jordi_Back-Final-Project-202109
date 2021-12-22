import Debug from "debug";
import mongoose from "mongoose";

import chalk from "chalk";

const debug = Debug("doggy:database-index");

const connectDB = (dataBase: string) =>
  new Promise<void>((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-underscore-dangle
        delete ret.__v;
      },
    });

    mongoose.connect(dataBase, (error: { message: string }) => {
      if (error) {
        debug(chalk.redBright("Couldn't connect to database"));
        debug(chalk.redBright(error.message));
        reject();
        return;
      }
      debug(chalk.greenBright("Connected to database"));
      resolve();
    });

    mongoose.connection.on("close", () => {
      debug(chalk.green("Connection to database closed"));
    });
  });

export default connectDB;
