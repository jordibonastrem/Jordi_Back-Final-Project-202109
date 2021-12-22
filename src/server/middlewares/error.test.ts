import { Request, Response } from "express";
import { notFoundErrorHandler, globalError } from "./errors";

describe("Given an notFoundErrorHandler middleware", () => {
  describe("When it recives a request", () => {
    test("Then it should send a response with a status code of 404 'Endpoint not found'", () => {
      const req = {} as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnThis();
      res.json = jest.fn().mockReturnThis();
      const expectedError = { ok: false, error: "Endpoint not found" };

      notFoundErrorHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a globalError middleware", () => {
  describe("When it recives a request with a error object that contains status code of 403 and a message of 'You cannot pass'", () => {
    test("Then it should return a response with the message and status code of the error (403,You cannot pass)", () => {
      const req = {} as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnThis();
      res.json = jest.fn().mockReturnThis();

      const code = 403;
      const error = {
        code,
        message: "You cannot pass",
      };
      const next = jest.fn();

      globalError(error, req, res, next);
      expect(res.status).toHaveBeenCalledWith(code);
      expect(res.json).toHaveBeenCalledWith({
        ok: false,
        error: error.message,
      });
    });
  });

  describe("When it recives a request with a error object error that doesn't contain neither status code or message", () => {
    test("Then it should return a response with an error that contains a status code of 500 and a message of Fatal error", () => {
      const req = {} as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnThis();
      res.json = jest.fn().mockReturnThis();
      const error = {};
      const next = jest.fn();
      const expectedErrorMsg = { ok: false, error: "Fatal error" };

      globalError(error, req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expectedErrorMsg);
    });
  });
});
