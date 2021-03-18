import {
  FETCH_TEMP_CART_START,
  FETCH_TEMP_CART_SUCCESS,
  FETCH_TEMP_CART_FAILURE,
  FETCH_USER_START,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  FETCH_PINCODE_START,
  FETCH_PINCODE_SUCCESS,
  FETCH_PINCODE_FAILURE,
  FETCH_REASONS_START,
  FETCH_REASONS_SUCCESS,
  FETCH_REASONS_FAILURE
} from "./actionTypes";
import {
  fetchTempCartApi,
  fetchUserApi,
  fetchPincodeApi,
  fetchReasonsApi
} from "../../api/callCenter";

export function fetchTempCart(userId, startdate, enddate, page, limit) {
  return dispatch => {
    dispatch(fetchTempCartBegin());
    return fetchTempCartApi(userId, startdate, enddate, page, limit)
      .then(json => {
        dispatch(fetchTempCartSuccess(json));
      })
      .catch(error => dispatch(fetchTempCartFailure(error)));
  };
}

export const fetchTempCartBegin = () => ({
  type: FETCH_TEMP_CART_START
});

export const fetchTempCartSuccess = data => ({
  type: FETCH_TEMP_CART_SUCCESS,
  payload: data
});

export const fetchTempCartFailure = error => ({
  type: FETCH_TEMP_CART_FAILURE,
  payload: error
});

export function fetchUser(userId, params) {
  return dispatch => {
    dispatch(fetchUserBegin());
    return fetchUserApi(userId, params)
      .then(json => {
        dispatch(fetchUserSuccess(json));
      })
      .catch(error => dispatch(fetchUserFailure(error)));
  };
}

export const fetchUserBegin = () => ({
  type: FETCH_USER_START
});

export const fetchUserSuccess = data => ({
  type: FETCH_USER_SUCCESS,
  payload: data
});

export const fetchUserFailure = error => ({
  type: FETCH_USER_FAILURE,
  payload: error
});

export function fetchPincode(userId, params) {
  return dispatch => {
    dispatch(fetchPincodeBegin());
    return fetchPincodeApi(userId, params)
      .then(json => {
        dispatch(fetchPincodeSuccess(json));
      })
      .catch(error => dispatch(fetchPincodeFailure(error)));
  };
}

export const fetchPincodeBegin = () => ({
  type: FETCH_PINCODE_START
});

export const fetchPincodeSuccess = data => ({
  type: FETCH_PINCODE_SUCCESS,
  payload: data
});

export const fetchPincodeFailure = error => ({
  type: FETCH_PINCODE_FAILURE,
  payload: error
});

export function fetchReasons(userId, params) {
  return dispatch => {
    dispatch(fetchReasonsBegin());
    return fetchReasonsApi(userId, params)
      .then(json => {
        dispatch(fetchReasonsSuccess(json));
      })
      .catch(error => dispatch(fetchReasonsFailure(error)));
  };
}

export const fetchReasonsBegin = () => ({
  type: FETCH_REASONS_START
});

export const fetchReasonsSuccess = data => ({
  type: FETCH_REASONS_SUCCESS,
  payload: data
});

export const fetchReasonsFailure = error => ({
  type: FETCH_REASONS_FAILURE,
  payload: error
});
