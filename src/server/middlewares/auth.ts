import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";

import CustomError from "../utils/CustomError";
import RequestAuth from "../../interfaces/IRequestAuth";

const auth = (req: RequestAuth, res: Response, next: NextFunction) => {
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

        next();
      } catch (error) {
        error.message = "Token not valid";
        error.code = 401;
        next(error);
      }
    }
  }
};

export default auth;
