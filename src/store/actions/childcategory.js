import { 
    getCCategoryDetail,
    getCCategoryList,
    postCCategoryApi,
    putCCategoryApi,
    patchCCategoryApi,
 } from "../../api/childcategoryapi";
import {
    FETCH_CCAT_DETAILS_START,
    FETCH_CCAT_DETAILS_SUCCESS,
    FETCH_CCAT_DETAILS_FAILURE,
    POST_CCAT_START,
    POST_CCAT_SUCCESS,
    POST_CCAT_FAILURE,
    PUT_CCAT_START,
    PUT_CCAT_SUCCESS,
    PUT_CCAT_FAILURE,
    PATCH_CCAT_START,
    PATCH_CCAT_SUCCESS,
    PATCH_CCAT_FAILURE,
    FETCH_ALL_CCATS_START,
    FETCH_ALL_CCATS_SUCCESS,
    FETCH_ALL_CCATS_FAILURE,
} from "./actionTypes";




export function fetchCCategoryDetail(id) {
  return dispatch => {
    dispatch(fetchCCategoryDetailBegin());
    return getCCategoryDetail(id)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(fetchCCategoryDetailSuccess(json));
        }
        else{
          dispatch(fetchCCategoryDetailFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(fetchCCategoryDetailFailure(error)));
  };
}



export function fetchAllCCategory(parent_id,searched_text,status,current_page) {
  return dispatch => {
    dispatch(fetchAllCCategoryBegin());
    return getCCategoryList(parent_id,searched_text,status,current_page)
      .then(json => {
        dispatch(fetchAllCCategorySuccess(json));
      })
      .catch(error => dispatch(fetchAllCCategoryFailure(error)));
  };
}


export function postCCategory(formdata) {
  return dispatch => {
    dispatch(postCCategoryBegin());
    return postCCategoryApi(formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(postCCategorySuccess(json));
        }
        else{
          dispatch(postCCategoryFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(postCCategoryFailure(error)));
  };
}


export function putCCategory(id,formdata) {
  return dispatch => {
    dispatch(putCCategoryBegin());
    return putCCategoryApi(id,formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(putCCategorySuccess(json));
        }
        else{
          dispatch(putCCategoryFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(putCCategoryFailure(error)));
  };
}

export function patchCCategory(id,formdata) {
  return dispatch => {
    dispatch(patchCCategoryBegin());
    return patchCCategoryApi(id,formdata)
      .then(json => {
        dispatch(patchCCategorySuccess(json));
      })
      .catch(error => dispatch(patchCCategoryFailure(error)));
  };
}




// Action Creators
//GET ALL
export const fetchAllCCategoryBegin = () => ({
  type: FETCH_ALL_CCATS_START
});

export const fetchAllCCategorySuccess = data => ({
  type: FETCH_ALL_CCATS_SUCCESS,
  payload: { data }
});

export const fetchAllCCategoryFailure = error => ({
  type: FETCH_ALL_CCATS_FAILURE,
  payload: { error }
});


// GET SINGLE CCAT

export const fetchCCategoryDetailBegin = () => ({
  type: FETCH_CCAT_DETAILS_START
});

export const fetchCCategoryDetailSuccess = data => ({
  type: FETCH_CCAT_DETAILS_SUCCESS,
  payload: { data }
});

export const fetchCCategoryDetailFailure = error => ({
  type: FETCH_CCAT_DETAILS_FAILURE,
  payload: { error }
});

//POST

export const postCCategoryBegin = () => ({
    type: POST_CCAT_START
  });
  
export const postCCategorySuccess = data => ({
    type: POST_CCAT_SUCCESS,
    payload: { data }
  });
  
export const postCCategoryFailure = error => ({
    type: POST_CCAT_FAILURE,
    payload: { error }
  });

//PUT
export const putCCategoryBegin = () => ({
    type: PUT_CCAT_START
  });
  
export const putCCategorySuccess = data => ({
    type: PUT_CCAT_SUCCESS,
    payload: { data }
  });
  
export const putCCategoryFailure = error => ({
    type: PUT_CCAT_FAILURE,
    payload: { error }
  });

//PATCH
export const patchCCategoryBegin = () => ({
  type: PATCH_CCAT_START
});

export const patchCCategorySuccess = data => ({
  type: PATCH_CCAT_SUCCESS,
  payload: { data }
});

export const patchCCategoryFailure = error => ({
  type: PATCH_CCAT_FAILURE,
  payload: { error }
});