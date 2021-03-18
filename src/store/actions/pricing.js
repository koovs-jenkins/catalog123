import {
  FETCH_SCHEDULED_PRICES_START,
  FETCH_SCHEDULED_PRICES_SUCCESS,
  FETCH_SCHEDULED_PRICES_FAILURE
} from "./actionTypes";
import { fetchScheduledPriceApi } from "../../api/pricing";

export function fetchScheduledPrice(userId, params) {
  return dispatch => {
    dispatch(fetchScheduledPriceBegin());
    return fetchScheduledPriceApi(userId, params)
      .then(json => {
        dispatch(fetchScheduledPriceSuccess(json));
      })
      .catch(error => dispatch(fetchScheduledPriceFailure(error)));
  };
}

export const fetchScheduledPriceBegin = () => ({
  type: FETCH_SCHEDULED_PRICES_START
});

export const fetchScheduledPriceSuccess = data => ({
  type: FETCH_SCHEDULED_PRICES_SUCCESS,
  payload: data
});

export const fetchScheduledPriceFailure = error => ({
  type: FETCH_SCHEDULED_PRICES_FAILURE,
  payload: error
});
