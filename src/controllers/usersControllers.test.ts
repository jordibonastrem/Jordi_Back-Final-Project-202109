import { Response, Request } from "express";
import User from "../database/models/user";
import { loginUser, signUpUser } from "./usersControllers";
import { newUser } from "../mocks/mockUsers";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../database/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

class ErrorCode extends Error {
  code: number | undefined;
}
const mockResponse = () => {
  const res = {} as Response;
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = () => {
  const req = {} as Request;
  return req;
};

describe("Given a loginUser function", () => {
  describe("When it receives a a username that doesnt exist", () => {
    test("Then it should call next function with the error 'Wrong credentials' and status code of 401", async () => {
      const username = "jordi123";
      const res = mockResponse();
      const req = mockRequest();
      const error: any = new Error("Wrong credentials");
      const next = jest.fn();

      req.body = {
        username,
      };

      User.findOne = jest.fn().mockResolvedValue(null);
      error.code = 401;

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
  describe("When it recives a username with a incorrect password", () => {
    test("Then it should call next function with the error 'Wrong credentials' and status code of 401", async () => {
      const res = mockResponse();
      const req = mockRequest();
      const error: any = new Error("Wrong credentials");
      const next = jest.fn();
      error.code = 401;
      req.body = {
        username: "Jordi",
        password: "aaaaaa",
      };
      User.findOne = jest.fn().mockResolvedValue({
        username: "Jordi",
        password: "Jordi123",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
  describe("When it recives a username with a correct password", () => {
    test("Then it should tokenize the user with jwt.sing and return the token in tes.json", async () => {
      const res = mockResponse();
      const req = mockRequest();
      const error: any = new Error("Wrong credentials");
      const next = jest.fn();
      const expectedtoken = "D";
      const expectedRes = {
        ok: true,
        username: "Jordi",
        user: "D",
      };
      error.code = 401;
      req.body = {
        username: "Jordi",
        password: "1234",
      };
      User.findOne = jest.fn().mockResolvedValue({
        username: "Jordi",
        password: "Jordi123",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      jwt.sign = jest.fn().mockReturnValue(expectedtoken);

      await loginUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expectedRes);
    });
  });
});

describe("Given a SignUp function", () => {
  describe("When it recives a request with a new user,and his username is already taken", () => {
    test("it should invoke the function next with an Error(400):username already taken", async () => {
      const res = mockResponse();
      const req = mockRequest();
      const next = jest.fn();
      const error = new ErrorCode("Username already taken");
      error.code = 400;
      req.body = newUser;

      User.findOne = jest.fn().mockResolvedValue(true);

      await signUpUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
    });
  });
  describe("When it recives a new user and its username is not taken", () => {
    test("it should return a response(201) and the json with ok(true) and the tokenized user", async () => {
      const res = mockResponse();
      const req = mockRequest();
      const expectedRes = {
        ok: true,
        user: "D",
      };
      const expectedStatus = 201;
      req.body = newUser;

      User.findOne = jest.fn().mockResolvedValue(false);

      await signUpUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedRes);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });
});
