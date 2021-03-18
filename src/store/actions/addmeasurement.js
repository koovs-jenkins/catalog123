import { 
    getMeasurementDetail,
    getMeasurementList,
    postMeasurementApi,
    putMeasurementApi,
    patchMeasurementApi,
 } from "../../api/addmeasurementapi";
import {
    FETCH_MEASURE_DETAILS_START,
    FETCH_MEASURE_DETAILS_SUCCESS,
    FETCH_MEASURE_DETAILS_FAILURE,
    POST_MEASURE_START,
    POST_MEASURE_SUCCESS,
    POST_MEASURE_FAILURE,
    PUT_MEASURE_START,
    PUT_MEASURE_SUCCESS,
    PUT_MEASURE_FAILURE,
    PATCH_MEASURE_START,
    PATCH_MEASURE_SUCCESS,
    PATCH_MEASURE_FAILURE,
    FETCH_ALL_MEASURES_START,
    FETCH_ALL_MEASURES_SUCCESS,
    FETCH_ALL_MEASURES_FAILURE,
} from "./actionTypes";




export function fetchMeasurementDetail(id) {
  return dispatch => {
    dispatch(fetchMeasurementDetailBegin());
    return getMeasurementDetail(id)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(fetchMeasurementDetailSuccess(json));
        }
        else{
          dispatch(fetchMeasurementDetailFailure(json.data.reason))
        }
      })
      .catch(error => {dispatch(fetchMeasurementDetailFailure(error))});
  };
}



export function fetchAllMeasurement(searched_text,status,current_page) {
  return dispatch => {
    dispatch(fetchAllMeasurementBegin());
    return getMeasurementList(searched_text,status,current_page)
      .then(json => {
        dispatch(fetchAllMeasurementSuccess(json));
      })
      .catch(error => dispatch(fetchAllMeasurementFailure(error)));
  };
}


export function postMeasurement(formdata) {
  return dispatch => {
    dispatch(postMeasurementBegin());
    return postMeasurementApi(formdata)
      .then(json => {
        if(!json.data.errorExists){
          dispatch(postMeasurementSuccess(json));
        }
        else{
          dispatch(postMeasurementFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(postMeasurementFailure(error)));
  };
}


export function putMeasurement(id,formdata) {
  return dispatch => {
    dispatch(putMeasurementBegin());
    return putMeasurementApi(id,formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(putMeasurementSuccess(json));
        }
        else{
          dispatch(putMeasurementFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(putMeasurementFailure(error)));
  };
}

export function patchMeasurement(id,formdata) {
  return dispatch => {
    dispatch(patchMeasurementBegin());
    return patchMeasurementApi(id,formdata)
      .then(json => {
        dispatch(patchMeasurementSuccess(json));
      })
      .catch(error => dispatch(patchMeasurementFailure(error)));
  };
}




// Action Creators
//GET ALL
export const fetchAllMeasurementBegin = () => ({
  type: FETCH_ALL_MEASURES_START
});

export const fetchAllMeasurementSuccess = data => ({
  type: FETCH_ALL_MEASURES_SUCCESS,
  payload: { data }
});

export const fetchAllMeasurementFailure = error => ({
  type: FETCH_ALL_MEASURES_FAILURE,
  payload: { error }
});


// GET SINGLE MEASURE

export const fetchMeasurementDetailBegin = () => ({
  type: FETCH_MEASURE_DETAILS_START
});

export const fetchMeasurementDetailSuccess = data => ({
  type: FETCH_MEASURE_DETAILS_SUCCESS,
  payload: { data }
});

export const fetchMeasurementDetailFailure = error => ({
  type: FETCH_MEASURE_DETAILS_FAILURE,
  payload: { error }
});

//POST

export const postMeasurementBegin = () => ({
    type: POST_MEASURE_START
  });
  
export const postMeasurementSuccess = data => ({
    type: POST_MEASURE_SUCCESS,
    payload: { data }
  });
  
export const postMeasurementFailure = error => ({
    type: POST_MEASURE_FAILURE,
    payload: { error }
  });

//PUT
export const putMeasurementBegin = () => ({
    type: PUT_MEASURE_START
  });
  
export const putMeasurementSuccess = data => ({
    type: PUT_MEASURE_SUCCESS,
    payload: { data }
  });
  
export const putMeasurementFailure = error => ({
    type: PUT_MEASURE_FAILURE,
    payload: { error }
  });

//PATCH
export const patchMeasurementBegin = () => ({
  type: PATCH_MEASURE_START
});

export const patchMeasurementSuccess = data => ({
  type: PATCH_MEASURE_SUCCESS,
  payload: { data }
});

export const patchMeasurementFailure = error => ({
  type: PATCH_MEASURE_FAILURE,
  payload: { error }
});