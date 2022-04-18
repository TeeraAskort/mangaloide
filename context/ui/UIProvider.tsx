import Cookies from "js-cookie";
import { ReactNode } from "react";
import { useReducer } from "react";
import { FC } from "react";
import { UIContext, uiReducer } from "./";

export interface UIState {
  sidemenuOpen: boolean;
  showNSFW: boolean;
}

const UI_INITIAL_STATE: UIState = {
  sidemenuOpen: false,
  showNSFW: Cookies.get("nsfw") === "true" ? true : false,
};

interface Props {
  children: ReactNode;
}

export const UIProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const openSideMenu = () => {
    dispatch({
      type: "UI - Open Sidebar",
    });
  };

  const closeSideMenu = () => {
    dispatch({
      type: "UI - Close Sidebar",
    });
  };

  const toggleNSFW = () => {
    dispatch({
      type: "UI - Toggle NSFW",
    });
  };

  return (
    <UIContext.Provider
      value={{ ...state, openSideMenu, closeSideMenu, toggleNSFW }}
    >
      {children}
    </UIContext.Provider>
  );
};
