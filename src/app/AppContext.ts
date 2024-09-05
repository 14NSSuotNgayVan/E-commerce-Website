import React, { Dispatch, SetStateAction } from "react";

type IAppContext = {
  pageLoading: boolean;
  setPageLoading: Dispatch<SetStateAction<boolean>>
}

const initValue: IAppContext = {
  pageLoading: false,
  setPageLoading: () => {}
}

const AppContext = React.createContext(initValue);

export default AppContext;