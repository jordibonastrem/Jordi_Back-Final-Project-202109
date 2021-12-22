import { Schema, model } from "mongoose";
import BreedInterface from "../../interfaces/IBreedInterface";

const breedSchema = new Schema<BreedInterface>({
  breedName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  breedPhoto: {
    type: String,
    required: true,
  },
  adaptability: {
    type: Number,
    required: true,
  },
  friendliness: {
    type: Number,
    required: true,
  },
  healthNeeds: {
    type: Number,
    required: true,
  },
  physicalNeeds: {
    type: Number,
    required: true,
  },
  trainability: {
    type: Number,
    required: true,
  },
  vocality: {
    type: Number,
    required: true,
  },
});

const Breed = model("Breed", breedSchema, "Breeds");

export default Breed;
