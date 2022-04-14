import { UIState } from "./";

type UIActionType =
  | {
      type: "UI - Close Sidebar";
    }
  | {
      type: "UI - Open Sidebar";
    }
  | {
      type: "UI - Toggle NSFW";
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

    case "UI - Toggle NSFW":
      return {
        ...state,
        showNSFW: !state.showNSFW,
      };

    default:
      return state;
  }
};
