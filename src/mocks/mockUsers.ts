import UserInterface from "../interfaces/IUserInterface";

const newUser: UserInterface = {
  firstName: "Jordi",
  lastName: "Bonastre",
  username: "jordi123456",
  profilePic: "test.jpg",
  email: "jordi.bonastre.m@gmail.com",
  password: "jordi123456",
  favoriteBreeds: [],
};

const users: Array<UserInterface> = [
  {
    firstName: "Jordi",
    lastName: "Bonastre",
    username: "jordi12",
    profilePic: "test.jpg",
    email: "jordi.bonastre.m@gmail.com",
    password: "jordi12",
    favoriteBreeds: [],
  },
  {
    firstName: "Jordi",
    lastName: "Bonastre",
    username: "jordi123",
    profilePic: "test.jpg",
    email: "jordi.bonastre.m@gmail.com",
    password: "jordi123",
    favoriteBreeds: [],
  },
  {
    firstName: "Jordi",
    lastName: "Bonastre",
    username: "jordi1234",
    profilePic: "test.jpg",
    email: "jordi.bonastre.m@gmail.com",
    password: "jordi1234",
    favoriteBreeds: [],
  },
];

export { newUser, users };
