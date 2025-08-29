import { createContext, useContext, useState } from "react";
import { initialState, useLayoutContextProps, WithChildren } from "./model";
 
const LayoutContext = createContext<useLayoutContextProps>(initialState);
 
const LayoutProvider = ({ children }: WithChildren) => {
  const [isLoadingScreen, setIsLoadingScreen] = useState(initialState.isLoadingScreen);
  const [menuFuncList, setMenuFuncList] = useState(initialState.menuFuncList);
  const [menuFunc, setMenuFunc] = useState(initialState.menuFunc);
 
  const value = {
    isLoadingScreen,
    setIsLoadingScreen,
    menuFuncList,
    setMenuFuncList,
    menuFunc,
    setMenuFunc
  };
 
  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};
const useLayout = () => useContext(LayoutContext);
 
export { LayoutProvider, useLayout };