import { 
    getGenericPromoDetail,
    getGenericPromoList,
    postGenericPromoApi,
    putGenericPromoApi,
    patchGenericPromoApi,
 } from "../../api/genericpromoapi";
import {
    FETCH_GENERIC_PROMO_DETAILS_START,
    FETCH_GENERIC_PROMO_DETAILS_SUCCESS,
    FETCH_GENERIC_PROMO_DETAILS_FAILURE,
    POST_GENERIC_PROMO_START,
    POST_GENERIC_PROMO_SUCCESS,
    POST_GENERIC_PROMO_FAILURE,
    PUT_GENERIC_PROMO_START,
    PUT_GENERIC_PROMO_SUCCESS,
    PUT_GENERIC_PROMO_FAILURE,
    PATCH_GENERIC_PROMO_START,
    PATCH_GENERIC_PROMO_SUCCESS,
    PATCH_GENERIC_PROMO_FAILURE,
    FETCH_ALL_GENERIC_PROMO_START,
    FETCH_ALL_GENERIC_PROMO_SUCCESS,
    FETCH_ALL_GENERIC_PROMO_FAILURE,
} from "./actionTypes";




export function fetchGenericPromoDetail(id) {
  return dispatch => {
    dispatch(fetchGenericPromoDetailBegin());
    return getGenericPromoDetail(id)
      .then(json => {
        console.log(json)
        if(!json.data.errorExists){
        dispatch(fetchGenericPromoDetailSuccess(json));
        }
        else{
          console.log("Error 1", json)
          dispatch(fetchGenericPromoDetailFailure(json.data.reason))
        }
      })
      .catch(error => {dispatch(fetchGenericPromoDetailFailure(error)); console.log("This is error",error)});
  };
}



export function fetchAllGenericPromo(searched_text,status,current_page) {
  return dispatch => {
    dispatch(fetchAllGenericPromoBegin());
    return getGenericPromoList(searched_text,status,current_page)
      .then(json => {
        dispatch(fetchAllGenericPromoSuccess(json));
      })
      .catch(error => dispatch(fetchAllGenericPromoFailure(error)));
  };
}


export function postGenericPromo(formdata) {
  return dispatch => {
    dispatch(postGenericPromoBegin());
    return postGenericPromoApi(formdata)
      .then(json => {
        if(!json.data.errorExists){
          dispatch(postGenericPromoSuccess(json));
        }
        else{
          dispatch(postGenericPromoFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(postGenericPromoFailure(error)));
  };
}


export function putGenericPromo(id,formdata) {
  return dispatch => {
    dispatch(putGenericPromoBegin());
    return putGenericPromoApi(id,formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(putGenericPromoSuccess(json));
        }
        else{
          dispatch(putGenericPromoFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(putGenericPromoFailure(error)));
  };
}

export function patchGenericPromo(id,formdata) {
  return dispatch => {
    dispatch(patchGenericPromoBegin());
    return patchGenericPromoApi(id,formdata)
      .then(json => {
        dispatch(patchGenericPromoSuccess(json));
      })
      .catch(error => dispatch(patchGenericPromoFailure(error)));
  };
}




// Action Creators
//GET ALL
export const fetchAllGenericPromoBegin = () => ({
  type: FETCH_ALL_GENERIC_PROMO_START
});

export const fetchAllGenericPromoSuccess = data => ({
  type: FETCH_ALL_GENERIC_PROMO_SUCCESS,
  payload: { data }
});

export const fetchAllGenericPromoFailure = error => ({
  type: FETCH_ALL_GENERIC_PROMO_FAILURE,
  payload: { error }
});


// GET SINGLE BRAND

export const fetchGenericPromoDetailBegin = () => ({
  type: FETCH_GENERIC_PROMO_DETAILS_START
});

export const fetchGenericPromoDetailSuccess = data => ({
  type: FETCH_GENERIC_PROMO_DETAILS_SUCCESS,
  payload: { data }
});

export const fetchGenericPromoDetailFailure = error => ({
  type: FETCH_GENERIC_PROMO_DETAILS_FAILURE,
  payload: { error }
});

//POST

export const postGenericPromoBegin = () => ({
    type: POST_GENERIC_PROMO_START
  });
  
export const postGenericPromoSuccess = data => ({
    type: POST_GENERIC_PROMO_SUCCESS,
    payload: { data }
  });
  
export const postGenericPromoFailure = error => ({
    type: POST_GENERIC_PROMO_FAILURE,
    payload: { error }
  });

//PUT
export const putGenericPromoBegin = () => ({
    type: PUT_GENERIC_PROMO_START
  });
  
export const putGenericPromoSuccess = data => ({
    type: PUT_GENERIC_PROMO_SUCCESS,
    payload: { data }
  });
  
export const putGenericPromoFailure = error => ({
    type: PUT_GENERIC_PROMO_FAILURE,
    payload: { error }
  });

//PATCH
export const patchGenericPromoBegin = () => ({
  type: PATCH_GENERIC_PROMO_START
});

export const patchGenericPromoSuccess = data => ({
  type: PATCH_GENERIC_PROMO_SUCCESS,
  payload: { data }
});

export const patchGenericPromoFailure = error => ({
  type: PATCH_GENERIC_PROMO_FAILURE,
  payload: { error }
});