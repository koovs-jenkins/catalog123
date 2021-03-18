import { 
    getProductLog,
 } from "../../api/productlogapi";
import {
    FETCH_PRODUCT_LOG_START,
    FETCH_PRODUCT_LOG_SUCCESS,
    FETCH_PRODUCT_LOG_FAILURE,
} from "./actionTypes";

export function fetchProductLog(id,pageNumber) {
  return dispatch => {
    dispatch(fetchProductLogBegin());
    return getProductLog(id,pageNumber)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(fetchProductLogSuccess(json));
        }
        else{
          dispatch(fetchProductLogFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(fetchProductLogFailure(error)));
  };
}

export const fetchProductLogBegin = () => ({
  type: FETCH_PRODUCT_LOG_START
});

export const fetchProductLogSuccess = data => ({
  type: FETCH_PRODUCT_LOG_SUCCESS,
  payload: { data }
});

export const fetchProductLogFailure = error => ({
  type: FETCH_PRODUCT_LOG_FAILURE,
  payload: { error }
});
