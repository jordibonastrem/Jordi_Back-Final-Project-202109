import jwt from "jsonwebtoken";
import { Response } from "express";
import auth from "./auth";
import CustomError from "../utils/CustomError";

import IRequestAuth from "../../interfaces/IRequestAuth";

const mockResponse = () => {
  const res = {} as Response;
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequestAuth = (body?: any, header?: any, params?: any) => {
  const req = {} as IRequestAuth;
  req.body = body;
  req.header = jest.fn().mockReturnValue(header);
  req.userId = "";
  req.params = params;

  return req;
};

describe("Given an auth middleware", () => {
  describe("When there is no Authorisation header", () => {
    test("it should return a Error(401): 'Unauthorized' ", () => {
      const res = mockResponse();
      const req = mockRequestAuth();

      const next = jest.fn();
      const expectedError = Error("Unauthorized");

      auth(req, res, next);
      expect(next).toBeCalledWith(expectedError);
    });
  });
  describe("When there is a Authorisation header but bad formated, (Bearer token)", () => {
    test("it should return a Error(401): 'Missing token", () => {
      const res = mockResponse();
      const header = "ee";
      const req = mockRequestAuth(null, header);

      const next = jest.fn();
      const expectedError = Error("Missing token");

      auth(req, res, next);
      expect(next).toBeCalledWith(expectedError);
    });
  });
  describe("When there is a Authorisation, good formated (Bearer token)", () => {
    test("Then it should call req.userId and req.userName", () => {
      const res = mockResponse();
      const body = { userName: "Jordi" };
      const untokenizedUser = { id: "1", name: "Jordi" };
      const header = "Bearer token";
      const req = mockRequestAuth(body, header);
      const next = jest.fn();

      jwt.verify = jest.fn().mockReturnValue(untokenizedUser);
      auth(req, res, next);

      expect(req).toHaveProperty("userId");
      expect(req).toHaveProperty("userName");

      expect(next).toHaveBeenCalled();
    });
  });
  describe("When there is a Authorisation, good formated (Bearer token) but with incorrect token", () => {
    test("Then it should call next with an Error:401 Token not valid", () => {
      const header = "Bearer token";
      const req = mockRequestAuth(null, header);
      const next = jest.fn();
      const error = new CustomError("Token not valid");
      error.code = 401;

      jwt.verify = jest.fn().mockReturnValue(null);
      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
