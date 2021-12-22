import Debug from "debug";
import bcrypt from "bcrypt";
import chalk from "chalk";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../database/models/user";
import CustomError from "../server/utils/CustomError";

const debug = Debug("doggy:user:controller");

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    debug(chalk.redBright("Wrong credentials"));
    const error = new CustomError("Wrong credentials");
    error.code = 401;

    next(error);
  } else {
    const correctPassword: string = await bcrypt.compare(
      password,
      user.password
    );
    if (!correctPassword) {
      debug(chalk.redBright("Wrong credentials"));
      const error = new CustomError("Wrong credentials");
      error.code = 401;

      next(error);
    } else {
      const token: JsonWebKey = jwt.sign(
        {
          id: user.id,
          name: user.username,
        },
        process.env.SECRET,
        {
          expiresIn: 72 * 60 * 60,
        }
      );
      res.json({
        ok: true,
        username: user.username,
        user: token,
      });
    }
  }
};

const renewUser = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    const error = new CustomError("Unauthorized");
    error.code = 401;
    next(error);
  } else {
    const token = authHeader.split(" ")[1];

    if (!token) {
      const error = new CustomError("Missing token");
      error.code = 401;
      next(error);
    } else {
      try {
        const userData = jwt.verify(token, process.env.SECRET);

        req.userId = userData.id;
        req.userName = userData.name;

        res.json({
          ok: true,
          username: userData.name,
          user: token,
        });
      } catch (error) {
        error.message = "Token not valid";
        error.code = 401;
        next(error);
      }
    }
  }
};

const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
  const newUser = req.body;
  const user = await User.findOne({ username: newUser.username });
  if (user) {
    const error = new CustomError("Username already taken");
    error.code = 400;
    next(error);
  } else {
    newUser.password = await bcrypt.hash(newUser.password, 10);

    await User.create(newUser);

    const userRegistered = await User.findOne({ username: newUser.username });

    const token: JsonWebKey = jwt.sign(
      {
        id: userRegistered.id,
        name: userRegistered.username,
      },
      process.env.SECRET,
      {
        expiresIn: 72 * 60 * 60,
      }
    );

    res.status(201).json({
      ok: true,
      fistName: userRegistered.firstName,
      username: userRegistered.username,
      email: userRegistered.email,
      user: token,
    });
  }
};

export { loginUser, signUpUser, renewUser };
