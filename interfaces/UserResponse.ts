import { IUser } from "./../models/User";

export interface UserResponse {
  token?: string;
  user?: IUser;
  message?: string;
}
