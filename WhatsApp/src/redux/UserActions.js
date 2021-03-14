import { actionTypes } from "./UserReducer"

export const authLogin = (user) => {
  return {
    type: actionTypes.SET_USER,
    user: user,
  };
};

export function login(user = {}) {
  return (dispatch) => {
    dispatch(authLogin(user));
  };
}
