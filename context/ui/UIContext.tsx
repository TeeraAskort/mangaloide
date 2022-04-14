import { createContext } from "react";

export interface ContextProps {
  sidemenuOpen: boolean;
  openSideMenu: () => void;
  closeSideMenu: () => void;
  showNSFW: boolean;
  toggleNSFW: () => void;
}

export const UIContext = createContext({} as ContextProps);
