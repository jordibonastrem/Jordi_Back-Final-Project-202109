import BreedInterface from "../interfaces/IBreedInterface";

const breeds: Array<BreedInterface> = [
  {
    breedName: "testDog1",
    breedPhoto: "dog.png",
    adaptability: 7,
    description: "testDescription1",
    friendliness: 5,
    healthNeeds: 3,
    physicalNeeds: 5,
    trainability: 4,
    vocality: 4,
  },
  {
    breedName: "testDog2",
    breedPhoto: "dog2.png",
    adaptability: 7,
    description: "testDescription2",
    friendliness: 5,
    healthNeeds: 3,
    physicalNeeds: 5,
    trainability: 4,
    vocality: 4,
  },
];
const newBreed: BreedInterface = {
  breedName: "testDog",
  adaptability: 7,
  description: "test description",
  friendliness: 5,
  healthNeeds: 3,
  physicalNeeds: 5,
  trainability: 4,
  vocality: 4,
  breedPhoto: "testphoto.jpg",
};

export { breeds, newBreed };
