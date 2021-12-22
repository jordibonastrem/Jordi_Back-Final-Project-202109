import { Schema, model, Types } from "mongoose";
import UserInterface from "../../interfaces/IUserInterface";

const userSchema = new Schema<UserInterface>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },

  profilePic: {
    type: String,
    default:
      "https://toppng.com/uploads/preview/roger-berry-avatar-placeholder-11562991561rbrfzlng6h.png",
  },
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  favoriteBreeds: {
    type: [Types.ObjectId],
    default: [],
  },
});

const User = model("User", userSchema, "Users");
export default User;
