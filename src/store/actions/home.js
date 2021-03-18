import { getAsnList } from "../../api/asnapi";
import {
  FETCH_ASN_LIST_START,
  FETCH_ASN_LIST_SUCCESS,
  FETCH_ASN_LIST_FAILURE
} from "./actionTypes";

export function fetchAsnList(vendorId) {
  return dispatch => {
    dispatch(fetchAsnListBegin());
    return getAsnList(vendorId)
      .then(json => {
        dispatch(fetchAsnListSuccess(json.value));
      })
      .catch(error => dispatch(fetchAsnListFailure(error)));
  };
}

export const fetchAsnListBegin = () => ({
  type: FETCH_ASN_LIST_START
});

export const fetchAsnListSuccess = data => ({
  type: FETCH_ASN_LIST_SUCCESS,
  payload: data
});

export const fetchAsnListFailure = error => ({
  type: FETCH_ASN_LIST_FAILURE,
  payload: error
});
