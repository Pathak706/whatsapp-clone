import React, { createContext, useContext, useReducer, useEffect } from "react";

export const StateContext = createContext();
export const StateProvider = ({ reducer, initialState, children }) => {
  console.log(reducer, initialState, children);
  const localState = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useReducer(reducer, localState || initialState);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
}, [user]);

  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
