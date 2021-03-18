import { 
    getProductMeasure,
    postProductMeasureApi
 } from "../../api/productmeasureapi";
import {
    FETCH_PRODUCT_MEASURE_START,
    FETCH_PRODUCT_MEASURE_SUCCESS,
    FETCH_PRODUCT_MEASURE_FAILURE,
    POST_PRODUCT_MEASURE_START,
    POST_PRODUCT_MEASURE_SUCCESS,
    POST_PRODUCT_MEASURE_FAILURE,
    REMOVE_ERROR_MEASURE
} from "./actionTypes";




export function fetchProductMeasure(id) {
  return dispatch => {
    dispatch(fetchProductMeasureBegin());
    return getProductMeasure(id)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(fetchProductMeasureSuccess(json));
        }
        else{
          dispatch(fetchProductMeasureFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(fetchProductMeasureFailure(error)));
  };
}


export function removeErrorMeasure(){
  return dispatch => {
    return dispatch(RemoveErrorMeasure(null))
  };
}


export function postProductMeasure(formdata,pid) {
  return dispatch => {
    dispatch(postProductMeasureBegin());
    return postProductMeasureApi(formdata,pid)
      .then(json => {
         if(!json.data.errorExists){
          dispatch(postProductMeasureSuccess(json))
         }
        else{
          dispatch(postProductMeasureFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(postProductMeasureFailure(error)));
  };
}

export const fetchProductMeasureBegin = () => ({
  type: FETCH_PRODUCT_MEASURE_START
});

export const fetchProductMeasureSuccess = data => ({
  type: FETCH_PRODUCT_MEASURE_SUCCESS,
  payload: { data }
});

export const fetchProductMeasureFailure = error => ({
  type: FETCH_PRODUCT_MEASURE_FAILURE,
  payload: { error }
});


export const RemoveErrorMeasure = error => ({
  type: REMOVE_ERROR_MEASURE,
  payload: { error }
});


//POST

export const postProductMeasureBegin = () => ({
    type: POST_PRODUCT_MEASURE_START
  });
  
export const postProductMeasureSuccess = data => ({
    type: POST_PRODUCT_MEASURE_SUCCESS,
    payload: { data }
  });
  
export const postProductMeasureFailure = error => ({
    type: POST_PRODUCT_MEASURE_FAILURE,
    payload: { error }
  });

