import { Dispatch, ReactNode, SetStateAction } from "react";
 
export type WithChildren = {
  children?: ReactNode
}
 
export type useLayoutContextProps = {
  isLoadingScreen: boolean;
  setIsLoadingScreen: (isLoading: boolean) => void;
  menuFuncList: any;
  setMenuFuncList: Dispatch<SetStateAction<any>>
  menuFunc: any;
  setMenuFunc: Dispatch<SetStateAction<any>>
};
 
export const initialState: useLayoutContextProps = {
  isLoadingScreen: false,
  setIsLoadingScreen: () => {},
  menuFuncList: [],
  setMenuFuncList: () => {},
  menuFunc: [],
  setMenuFunc: () => {}
};