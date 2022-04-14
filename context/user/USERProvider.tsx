import { ReactNode } from "react";
import { useReducer } from "react";
import { FC } from "react";
import { User } from "../../interfaces/User";
import { USERContext, userReducer } from "./";

export interface USERState {
  user: User | undefined;
}

const USER_INITIAL_STATE: USERState = {
  user: undefined,
};

interface Props {
  children: ReactNode;
}

export const USERProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, USER_INITIAL_STATE);

  const logIn = (user: User) => {
    dispatch({
      type: "USER - Log in",
      payload: user,
    });
  };

  const logOut = () => {
    dispatch({
      type: "USER - Log out",
    });
  };

  return (
    <USERContext.Provider value={{ ...state, logIn, logOut }}>
      {children}
    </USERContext.Provider>
  );
};
