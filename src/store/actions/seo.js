import { 
    getSeoDetail,
    getSeoList,
    postSeoApi,
    putSeoApi,
    patchSeoApi,
 } from "../../api/seoapi";
import {
    FETCH_SEO_DETAILS_START,
    FETCH_SEO_DETAILS_SUCCESS,
    FETCH_SEO_DETAILS_FAILURE,
    POST_SEO_START,
    POST_SEO_SUCCESS,
    POST_SEO_FAILURE,
    PUT_SEO_START,
    PUT_SEO_SUCCESS,
    PUT_SEO_FAILURE,
    PATCH_SEO_START,
    PATCH_SEO_SUCCESS,
    PATCH_SEO_FAILURE,
    FETCH_ALL_SEOS_START,
    FETCH_ALL_SEOS_SUCCESS,
    FETCH_ALL_SEOS_FAILURE,
} from "./actionTypes";




export function fetchSeoDetail(id) {
  return dispatch => {
    dispatch(fetchSeoDetailBegin());
    return getSeoDetail(id)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(fetchSeoDetailSuccess(json));
        }
        else{
          console.log("Error 1", json)
          dispatch(fetchSeoDetailFailure(json.data.reason))
        }
      })
      .catch(error => {dispatch(fetchSeoDetailFailure(error)); console.log("This is error",error)});
  };
}



export function fetchAllSeo(searched_text,status,current_page) {
  return dispatch => {
    dispatch(fetchAllSeoBegin());
    return getSeoList(searched_text,status,current_page)
      .then(json => {
        dispatch(fetchAllSeoSuccess(json));
      })
      .catch(error => dispatch(fetchAllSeoFailure(error)));
  };
}


export function postSeo(formdata) {
  return dispatch => {
    dispatch(postSeoBegin());
    return postSeoApi(formdata)
      .then(json => {
        if(!json.data.errorExists){
          dispatch(postSeoSuccess(json));
        }
        else{
          dispatch(postSeoFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(postSeoFailure(error)));
  };
}


export function putSeo(id,formdata) {
  return dispatch => {
    dispatch(putSeoBegin());
    return putSeoApi(id,formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(putSeoSuccess(json));
        }
        else{
          dispatch(putSeoFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(putSeoFailure(error)));
  };
}

export function patchSeo(id,formdata) {
  return dispatch => {
    dispatch(patchSeoBegin());
    return patchSeoApi(id,formdata)
      .then(json => {
        dispatch(patchSeoSuccess(json));
      })
      .catch(error => dispatch(patchSeoFailure(error)));
  };
}




// Action Creators
//GET ALL
export const fetchAllSeoBegin = () => ({
  type: FETCH_ALL_SEOS_START
});

export const fetchAllSeoSuccess = data => ({
  type: FETCH_ALL_SEOS_SUCCESS,
  payload: { data }
});

export const fetchAllSeoFailure = error => ({
  type: FETCH_ALL_SEOS_FAILURE,
  payload: { error }
});


// GET SINGLE SEO

export const fetchSeoDetailBegin = () => ({
  type: FETCH_SEO_DETAILS_START
});

export const fetchSeoDetailSuccess = data => ({
  type: FETCH_SEO_DETAILS_SUCCESS,
  payload: { data }
});

export const fetchSeoDetailFailure = error => ({
  type: FETCH_SEO_DETAILS_FAILURE,
  payload: { error }
});

//POST

export const postSeoBegin = () => ({
    type: POST_SEO_START
  });
  
export const postSeoSuccess = data => ({
    type: POST_SEO_SUCCESS,
    payload: { data }
  });
  
export const postSeoFailure = error => ({
    type: POST_SEO_FAILURE,
    payload: { error }
  });

//PUT
export const putSeoBegin = () => ({
    type: PUT_SEO_START
  });
  
export const putSeoSuccess = data => ({
    type: PUT_SEO_SUCCESS,
    payload: { data }
  });
  
export const putSeoFailure = error => ({
    type: PUT_SEO_FAILURE,
    payload: { error }
  });

//PATCH
export const patchSeoBegin = () => ({
  type: PATCH_SEO_START
});

export const patchSeoSuccess = data => ({
  type: PATCH_SEO_SUCCESS,
  payload: { data }
});

export const patchSeoFailure = error => ({
  type: PATCH_SEO_FAILURE,
  payload: { error }
});