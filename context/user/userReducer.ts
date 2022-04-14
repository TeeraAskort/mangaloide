import { User } from "../../interfaces/User";
import { USERState } from "./";

type USERActionType =
  | {
      type: "USER - Log in";
      payload: User;
    }
  | {
      type: "USER - Log out";
    };

export const userReducer = (
  state: USERState,
  action: USERActionType
): USERState => {
  switch (action.type) {
    case "USER - Log in":
      return {
        ...state,
        user: action.payload,
      };

    case "USER - Log out":
      return {
        ...state,
        user: undefined,
      };

    default:
      return state;
  }
};
