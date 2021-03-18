import { getAsnDetailsByPono } from "../../api/asnapi";
import {
  FETCH_ASN_DETAILS_BYPO_START,
  FETCH_ASN_DETAILS_BYPO_SUCCESS,
  FETCH_ASN_DETAILS_BYPO_FAILURE,
} from "./actionTypes";

export function fetchAsnDetailsByPono(id) {
  return dispatch => {
    dispatch(fetchAsnDetailsByPonoBegin());
    return getAsnDetailsByPono(id)
      .then(json => {
        dispatch(fetchAsnDetailsByPonoSuccess(json));
      })
      .catch(error => dispatch(fetchAsnDetailsByPonoFailure(error)));
  };
}

export const fetchAsnDetailsByPonoBegin = () => ({
  type: FETCH_ASN_DETAILS_BYPO_START
});

export const fetchAsnDetailsByPonoSuccess = data => ({
  type: FETCH_ASN_DETAILS_BYPO_SUCCESS,
  payload: data
});

export const fetchAsnDetailsByPonoFailure = error => ({
  type: FETCH_ASN_DETAILS_BYPO_FAILURE,
  payload: error
});