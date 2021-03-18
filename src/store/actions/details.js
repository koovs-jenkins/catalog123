import { getAsnDetails, postAsnDetailsApi } from "../../api/asnapi";
import {
  FETCH_ASN_DETAILS_START,
  FETCH_ASN_DETAILS_SUCCESS,
  FETCH_ASN_DETAILS_FAILURE,
  POST_ASN_DETAILS_START,
  POST_ASN_DETAILS_SUCCESS,
  POST_ASN_DETAILS_FAILURE
} from "./actionTypes";
import { getDate, getTime } from "../../helpers";

export function fetchAsnDetails(id) {
  return dispatch => {
    dispatch(fetchAsnDetailsBegin());
    return getAsnDetails(id)
      .then(json => {
        dispatch(fetchAsnDetailsSuccess(json));
      })
      .catch(error => dispatch(fetchAsnDetailsFailure(error)));
  };
}

export function postAsnDetails(data) {
  return dispatch => {
    dispatch(postAsnDetailsBegin());
    return postAsnDetailsApi(data)
      .then(json => {
        dispatch(postAsnDetailsSuccess(json));
      })
      .catch(error => dispatch(postAsnDetailsFailure(error)));
  };
}

export const fetchAsnDetailsBegin = () => ({
  type: FETCH_ASN_DETAILS_START
});

export const fetchAsnDetailsSuccess = data => ({
  type: FETCH_ASN_DETAILS_SUCCESS,
  payload: { data }
});

export const fetchAsnDetailsFailure = error => ({
  type: FETCH_ASN_DETAILS_FAILURE,
  payload: error
});

export const postAsnDetailsBegin = () => ({
  type: POST_ASN_DETAILS_START
});

export const postAsnDetailsSuccess = data => ({
  type: POST_ASN_DETAILS_SUCCESS,
  payload: { data }
});

export const postAsnDetailsFailure = error => ({
  type: POST_ASN_DETAILS_FAILURE,
  payload: error
});
