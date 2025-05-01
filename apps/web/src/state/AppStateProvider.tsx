import React, { useState, ReactNode } from "react";
import { AppStateContext } from "./AppStateContext";

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
}) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const appState = {
    loggedIn,
    setLoggedIn,
  };

  return (
    <AppStateContext.Provider value={appState}>
      {children}
    </AppStateContext.Provider>
  );
};
