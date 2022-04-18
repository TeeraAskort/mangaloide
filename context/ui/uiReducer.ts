import { UIState } from "./";

type UIActionType =
  | {
      type: "UI - Close Sidebar";
    }
  | {
      type: "UI - Open Sidebar";
    };

export const uiReducer = (state: UIState, action: UIActionType): UIState => {
  switch (action.type) {
    case "UI - Close Sidebar":
      return {
        ...state,
        sidemenuOpen: false,
      };

    case "UI - Open Sidebar":
      return {
        ...state,
        sidemenuOpen: true,
      };

    default:
      return state;
  }
};
