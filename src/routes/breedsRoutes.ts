import express from "express";
import auth from "../server/middlewares/auth";
import {
  getBreeds,
  getBreedsPage,
  getBreedById,
  createBreed,
  updateBreed,
  deleteBreed,
} from "../controllers/breedsControllers";

import upload from "../server/middlewares/upload";
import firebase from "../server/middlewares/firebase";

const router = express.Router();

router.get("/", auth, getBreeds);
router.get("/pagination", auth, getBreedsPage);
router.post("/", auth, upload.single("breedPhoto"), firebase, createBreed);
router.put("/:idBreed", auth, updateBreed);
router.get("/:idBreed", auth, getBreedById);
router.delete("/:idBreed", auth, deleteBreed);

export default router;
