import { Request, Response } from "express";

import Breed from "../database/models/breed";
import CustomError from "../server/utils/CustomError";
import {
  createBreed,
  deleteBreed,
  getBreedById,
  getBreeds,
  updateBreed,
} from "./breedsControllers";
import { breeds, newBreed } from "../mocks/mockBreeds";

jest.mock("../database/models/breed");

describe("Given a getBreeds function", () => {
  describe("When its called", () => {
    test("Then it should invoke the method json and call the Breed.find function", async () => {
      const res = {} as Response;
      const req = {} as Request;
      const next = jest.fn();
      res.json = jest.fn();
      Breed.find = jest.fn().mockResolvedValue(breeds);

      await getBreeds(req, res, next);

      expect(Breed.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(breeds);
    });
  });
  describe("When dont recives a array of breeds", () => {
    test("Is sould invoke next function with an error", async () => {
      const res = {} as Response;
      const req = {} as Request;
      const next = jest.fn();
      const error = new Error();
      res.json = jest.fn();

      Breed.find = jest.fn().mockRejectedValue(error);

      await getBreeds(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getBreedById function", () => {
  describe("When it recives a request with an existing id", () => {
    test("Then it should call the Breed.findById with the existing id", async () => {
      const idBreed = "1";
      const res = {} as Response;
      const req = {} as Request;
      req.params = { idBreed };

      const next = () => jest.fn();
      Breed.findById = jest.fn().mockResolvedValue({});

      await getBreedById(req, res, next);
      expect(Breed.findById).toHaveBeenCalledWith(idBreed);
    });
    test("Then it should return the response with the breed in the response", async () => {
      const idBreed = "1";
      const res = {} as Response;
      const req = {} as Request;
      res.status = jest.fn().mockReturnThis();
      res.json = jest.fn().mockReturnThis();
      req.params = { idBreed };

      const next = () => jest.fn();
      Breed.findById = jest.fn().mockResolvedValue(newBreed);

      await getBreedById(req, res, next);
      expect(res.json).toHaveBeenCalledWith(newBreed);
    });
  });
  describe("If Breed.findById returns null", () => {
    test("Then should call next with an error", async () => {
      const idBreed = "1";
      const req = {} as Request;
      const res = {} as Response;
      const error = new Error("Breed not found");
      const next = jest.fn();
      req.params = { idBreed };
      Breed.findById = jest.fn().mockResolvedValue(null);

      await getBreedById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe("If Breed.findById rejects", () => {
    test("Then should call next with an error with the message 'Cannot found the dog breed, bad id format'", async () => {
      const idBreed = "1";
      const req = {} as Request;
      const res = {} as Response;
      const error = new CustomError(
        "Cannot found the dog breed, bad id format"
      );
      error.code = 400;
      const next = jest.fn();
      req.params = { idBreed };
      Breed.findById = jest.fn().mockRejectedValue(error);

      await getBreedById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a createBreed controller", () => {
  describe("When it recives a req with a dog breed object", () => {
    test("Then it should respond with a status code 200 and a response containing a json with the new breed", async () => {
      const res = {} as Response;
      res.status = jest.fn().mockReturnThis();
      res.json = jest.fn().mockReturnThis();

      const req = {} as Request;
      req.body = { newBreed };

      Breed.create = jest.fn().mockResolvedValue(newBreed);

      const next = jest.fn();

      await createBreed(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newBreed);
    });
  });
  describe("When Breed.create rejects", () => {
    test("Then it should invoke the next functon", async () => {
      const req = {} as Request;
      const res = {} as Response;
      req.body = {
        newBreed,
      };

      const next = jest.fn();
      const error = new CustomError();

      Breed.create = jest.fn().mockRejectedValue(error);

      await createBreed(req, res, next);

      expect(next).toHaveBeenCalled();
    });
    test("Then it should invoke the next function with an error with code 404", async () => {
      const req = {} as Request;
      const res = {} as Response;

      req.body = { newBreed };
      const errorCode = 400;

      const next = jest.fn();
      const error = new CustomError();
      error.code = errorCode;
      Breed.create = jest.fn().mockRejectedValue(error);
      await createBreed(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].code).toBe(errorCode);
    });
    test("Then it should invoke the next function with an error with the message 'Failed to create a new Breed'", async () => {
      const req = {} as Request;
      const res = {} as Response;
      req.body = { newBreed };
      const errorMessage = "Failed to create a new Breed";

      const next = jest.fn();
      const error = new CustomError();
      error.message = errorMessage;
      Breed.create = jest.fn().mockRejectedValue(error);
      await createBreed(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });
});

describe("Given a updateBreed controller", () => {
  describe("When it recives a request with an existing id", () => {
    test("Then it should call the method json with the updated breed", async () => {
      const idBreed = "61ab644e8b3ed2349da8eef2";
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn();
      const breedContent = {
        adaptability: 5,
        healthNeeds: 3,
      };

      req.params = { idBreed };
      req.body = { breedContent };

      res.json = jest.fn();

      Breed.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      await updateBreed(req, res, next);

      expect(next).toHaveBeenCalled();
    });
    describe("When it recieves a request and it rejects", () => {
      test("Then it should call next with an error", async () => {
        const idBreed = "1";
        const req = {} as Request;
        const res = {} as Response;
        const next = jest.fn();
        const error = new CustomError("Error trying to update the breed");
        error.code = 400;
        req.params = { idBreed };

        Breed.findByIdAndUpdate = jest.fn().mockRejectedValue({});
        await updateBreed(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
        expect(next.mock.calls[0][0]).toHaveProperty(
          "message",
          "Error trying to update the breed"
        );
      });
    });
  });
});

describe("Given a deleteBreed controller", () => {
  describe("When it recives a request with an existing id", () => {
    test("Then it should call the Breed.findByIdAndDelete with the id", async () => {
      const idBreed = "1";
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn();
      req.params = { idBreed };

      Breed.findByIdAndDelete = jest.fn().mockResolvedValue({});

      await deleteBreed(req, res, next);
      expect(Breed.findByIdAndDelete).toHaveBeenCalledWith(idBreed);
    });
  });
  describe("And if Breed.findByIdAndDelete rejects", () => {
    test("Then it should call next with an error", async () => {
      const idBreed = "1";
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn();
      const error = new CustomError("Error trying to delete the breed");
      error.code = 400;
      req.params = { idBreed };
      res.json = jest.fn();

      Breed.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      await deleteBreed(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        "Error trying to delete the breed"
      );
    });
  });
  describe("When it recives a non existing id", () => {
    test("Then invokes the next function with the error 'Breed not found '", async () => {
      const idBreed = "2";
      const req = {} as Request;
      req.params = { idBreed };
      const res = {} as Response;
      const next = jest.fn();
      const error = new CustomError("Breed not found");
      Breed.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await deleteBreed(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
