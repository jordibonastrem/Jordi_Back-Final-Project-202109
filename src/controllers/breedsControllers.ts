import { NextFunction, Request, Response } from "express";
import Breed from "../database/models/breed";
import CustomError from "../server/utils/CustomError";

const getBreeds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const breeds = await Breed.find();
    res.json(breeds);
  } catch (error) {
    next(error);
  }
};

const getBreedsPage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const breeds = await Breed.find()
      .limit(+limit * 1)
      .skip((+page - 1) * +limit);

    res.json({ total: breeds.length, breeds });
  } catch (error) {
    next(error);
  }
};

const getBreedById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idBreed } = req.params;

  try {
    const searchedBreed = await Breed.findById(idBreed);
    if (searchedBreed) {
      res.json(searchedBreed);
    } else {
      const error = new CustomError("Breed not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.message = `Cannot found the dog breed, bad id format`;
    error.code = 400;
    next(error);
  }
};

const createBreed = async (req, res: Response, next: NextFunction) => {
  const { file } = req;

  const breedContent = req.body;
  if (file) {
    breedContent.breedPhoto = file.fileURL;
  }

  try {
    const newBreed = await Breed.create(breedContent);
    res.status(201).json(newBreed);
  } catch (error) {
    error.message = `Failed to create a new Breed`;
    error.code = 400;
    next(error);
  }
};

const updateBreed = async (req, res: Response, next: NextFunction) => {
  const { file } = req;
  const { idBreed } = req.params;

  const breedContent = req.body;
  if (file) {
    breedContent.breedPhoto = file.fileURL;
  }

  try {
    const newBreed = await Breed.findByIdAndUpdate(idBreed, breedContent, {
      new: true,
    });
    res.status(201).json(newBreed);
  } catch (error) {
    error.message = `Error trying to update the breed`;
    error.code = 400;
    next(error);
  }
};

const deleteBreed = async (req: Request, res: Response, next: NextFunction) => {
  const { idBreed } = req.params;
  try {
    const foundBreed = await Breed.findByIdAndDelete(idBreed);
    if (foundBreed) {
      res.status(202).json(foundBreed);
    } else {
      const error = new CustomError("Breed not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

export {
  getBreeds,
  getBreedsPage,
  getBreedById,
  createBreed,
  updateBreed,
  deleteBreed,
};
