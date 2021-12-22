interface IUserInterface {
  firstName: string;
  lastName: string;
  username: string;
  profilePic?: string;
  email: string;
  password: string;
  favoriteBreeds?: Array<string>;
}

export default IUserInterface;
