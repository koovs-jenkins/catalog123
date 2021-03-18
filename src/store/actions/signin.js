import { signInUserApi, signOutUserApi } from "../../api/login";
import {
  SIGNIN_USER_START,
  SIGNIN_USER_SUCCESS,
  SIGNIN_USER_FAILURE,
  SIGN_OUT_USER_START,
  SIGN_OUT_USER_SUCCESS,
  SIGN_OUT_USER_FAILURE
} from "./actionTypes";

export function fetchSigninUser(credentials) {
  return dispatch => {
    dispatch(fetchSigninUserBegin());
    return signInUserApi(credentials)
      .then(data => {
        dispatch(fetchSigninUserSuccess(data));
      })
      .catch(error => dispatch(fetchSigninUserFailure(error)));
  };
}

export function handleSignOut() {
  return dispatch => {
    dispatch(fetchSignOutUserBegin());
    return signOutUserApi()
      .then(data => {
        delete localStorage["modules"]
        dispatch(fetchSignOutUserSuccess(data));
      })
      .catch(error => dispatch(fetchSignOutUserFailure(error)));
  };
}

export const fetchSigninUserBegin = () => ({
  type: SIGNIN_USER_START
});

export const fetchSigninUserSuccess = data => ({
  type: SIGNIN_USER_SUCCESS,
  payload: data
});

export const fetchSigninUserFailure = error => ({
  type: SIGNIN_USER_FAILURE,
  payload: error
});

export const fetchSignOutUserBegin = () => ({
  type: SIGN_OUT_USER_START
});

export const fetchSignOutUserSuccess = data => ({
  type: SIGN_OUT_USER_SUCCESS,
  payload: data
});

export const fetchSignOutUserFailure = error => ({
  type: SIGN_OUT_USER_FAILURE,
  payload: error
});
