import { User } from "../interfaces";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IUser extends User {}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "user"],
      message: "{VALUE} is not a valid role",
    },
    default: "user",
    required: true,
  },
  comicsFollowing: [
    {
      _id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      chaptersRead: [
        {
          name: {
            type: String,
            required: true,
          },
          language: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
  uploadedComics: [
    {
      _id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
