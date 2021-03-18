import {
  FETCH_PO_LIST_START,
  FETCH_PO_LIST_SUCCESS,
  FETCH_PO_LIST_FAILURE
} from "./actionTypes";
import { getPoWithLocation } from "../../api/asnapi";

export function fetchPoList(id) {
  return dispatch => {
    dispatch(fetchPoListBegin());
    return getPoWithLocation(id)
      .then(json => {
        dispatch(fetchPoListSuccess(json.value));
      })
      .catch(error => dispatch(fetchPoListFailure(error)));
  };
}

export const fetchPoListBegin = () => ({
  type: FETCH_PO_LIST_START
});

export const fetchPoListSuccess = data => ({
  type: FETCH_PO_LIST_SUCCESS,
  payload: { data }
});

export const fetchPoListFailure = error => ({
  type: FETCH_PO_LIST_FAILURE,
  payload: error
});
