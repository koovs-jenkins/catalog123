import { 
    getPCategoryDetail,
    getPCategoryList,
    postPCategoryApi,
    putPCategoryApi,
    patchPCategoryApi,
 } from "../../api/parentcategoryapi";
import {
    FETCH_PCAT_DETAILS_START,
    FETCH_PCAT_DETAILS_SUCCESS,
    FETCH_PCAT_DETAILS_FAILURE,
    POST_PCAT_START,
    POST_PCAT_SUCCESS,
    POST_PCAT_FAILURE,
    PUT_PCAT_START,
    PUT_PCAT_SUCCESS,
    PUT_PCAT_FAILURE,
    PATCH_PCAT_START,
    PATCH_PCAT_SUCCESS,
    PATCH_PCAT_FAILURE,
    FETCH_ALL_PCATS_START,
    FETCH_ALL_PCATS_SUCCESS,
    FETCH_ALL_PCATS_FAILURE,
} from "./actionTypes";




export function fetchPCategoryDetail(id) {
  return dispatch => {
    dispatch(fetchPCategoryDetailBegin());
    return getPCategoryDetail(id)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(fetchPCategoryDetailSuccess(json));
        }
        else{
          dispatch(fetchPCategoryDetailFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(fetchPCategoryDetailFailure(error)));
  };
}



export function fetchAllPCategory(searched_text,status,current_page) {
  return dispatch => {
    dispatch(fetchAllPCategoryBegin());
    return getPCategoryList(searched_text,status,current_page)
      .then(json => {
        dispatch(fetchAllPCategorySuccess(json));
      })
      .catch(error => dispatch(fetchAllPCategoryFailure(error)));
  };
}


export function postPCategory(formdata) {
  return dispatch => {
    dispatch(postPCategoryBegin());
    return postPCategoryApi(formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(postPCategorySuccess(json));
        }
        else{
          dispatch(postPCategoryFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(postPCategoryFailure(error)));
  };
}


export function putPCategory(id,formdata) {
  return dispatch => {
    dispatch(putPCategoryBegin());
    return putPCategoryApi(id,formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(putPCategorySuccess(json));
        }
        else{
          dispatch(putPCategoryFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(putPCategoryFailure(error)));
  };
}

export function patchPCategory(id,formdata) {
  return dispatch => {
    dispatch(patchPCategoryBegin());
    return patchPCategoryApi(id,formdata)
      .then(json => {
        dispatch(patchPCategorySuccess(json));
      })
      .catch(error => dispatch(patchPCategoryFailure(error)));
  };
}




// Action Creators
//GET ALL
export const fetchAllPCategoryBegin = () => ({
  type: FETCH_ALL_PCATS_START
});

export const fetchAllPCategorySuccess = data => ({
  type: FETCH_ALL_PCATS_SUCCESS,
  payload: { data }
});

export const fetchAllPCategoryFailure = error => ({
  type: FETCH_ALL_PCATS_FAILURE,
  payload: { error }
});


// GET SINGLE PCAT

export const fetchPCategoryDetailBegin = () => ({
  type: FETCH_PCAT_DETAILS_START
});

export const fetchPCategoryDetailSuccess = data => ({
  type: FETCH_PCAT_DETAILS_SUCCESS,
  payload: { data }
});

export const fetchPCategoryDetailFailure = error => ({
  type: FETCH_PCAT_DETAILS_FAILURE,
  payload: { error }
});

//POST

export const postPCategoryBegin = () => ({
    type: POST_PCAT_START
  });
  
export const postPCategorySuccess = data => ({
    type: POST_PCAT_SUCCESS,
    payload: { data }
  });
  
export const postPCategoryFailure = error => ({
    type: POST_PCAT_FAILURE,
    payload: { error }
  });

//PUT
export const putPCategoryBegin = () => ({
    type: PUT_PCAT_START
  });
  
export const putPCategorySuccess = data => ({
    type: PUT_PCAT_SUCCESS,
    payload: { data }
  });
  
export const putPCategoryFailure = error => ({
    type: PUT_PCAT_FAILURE,
    payload: { error }
  });

//PATCH
export const patchPCategoryBegin = () => ({
  type: PATCH_PCAT_START
});

export const patchPCategorySuccess = data => ({
  type: PATCH_PCAT_SUCCESS,
  payload: { data }
});

export const patchPCategoryFailure = error => ({
  type: PATCH_PCAT_FAILURE,
  payload: { error }
});