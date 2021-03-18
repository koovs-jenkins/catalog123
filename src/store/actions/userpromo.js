import { 
    getUserPromoDetail,
    getUserPromoList,
    postUserPromoApi,
    postMultiUserPromoApi,
    putUserPromoApi,
    patchUserPromoApi,
 } from "../../api/userpromoapi";
import {
    FETCH_USER_PROMO_DETAILS_START,
    FETCH_USER_PROMO_DETAILS_SUCCESS,
    FETCH_USER_PROMO_DETAILS_FAILURE,
    POST_USER_PROMO_START,
    POST_USER_PROMO_SUCCESS,
    POST_USER_PROMO_FAILURE,
    POST_MULTIUSER_PROMO_START,
    POST_MULTIUSER_PROMO_SUCCESS,
    POST_MULTIUSER_PROMO_FAILURE,
    PUT_USER_PROMO_START,
    PUT_USER_PROMO_SUCCESS,
    PUT_USER_PROMO_FAILURE,
    PATCH_USER_PROMO_START,
    PATCH_USER_PROMO_SUCCESS,
    PATCH_USER_PROMO_FAILURE,
    FETCH_ALL_USER_PROMO_START,
    FETCH_ALL_USER_PROMO_SUCCESS,
    FETCH_ALL_USER_PROMO_FAILURE,
} from "./actionTypes";




export function fetchUserPromoDetail(id) {
  return dispatch => {
    dispatch(fetchUserPromoDetailBegin());
    return getUserPromoDetail(id)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(fetchUserPromoDetailSuccess(json));
        }
        else{
          console.log("Error 1", json)
          dispatch(fetchUserPromoDetailFailure(json.data.reason))
        }
      })
      .catch(error => {dispatch(fetchUserPromoDetailFailure(error)); console.log("This is error",error)});
  };
}



export function fetchAllUserPromo(searched_text,status,current_page) {
  return dispatch => {
    dispatch(fetchAllUserPromoBegin());
    return getUserPromoList(searched_text,status,current_page)
      .then(json => {
        dispatch(fetchAllUserPromoSuccess(json));
      })
      .catch(error => dispatch(fetchAllUserPromoFailure(error)));
  };
}


export function postUserPromo(formdata) {
  return dispatch => {
    dispatch(postUserPromoBegin());
    return postUserPromoApi(formdata)
      .then(json => {
        if(!json.data.errorExists){
          dispatch(postUserPromoSuccess(json));
        }
        else{
          dispatch(postUserPromoFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(postUserPromoFailure(error)));
  };
}

export function postMultiUserPromo(formdata) {
  return dispatch => {
    dispatch(postMultiUserPromoBegin());
    return postMultiUserPromoApi(formdata)
      .then(json => {
        if(!json.data.errorExists){
          dispatch(postMultiUserPromoSuccess(json));
        }
        else{
          dispatch(postMultiUserPromoFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(postMultiUserPromoFailure(error)));
  };
}


export function putUserPromo(id,formdata) {
  return dispatch => {
    dispatch(putUserPromoBegin());
    return putUserPromoApi(id,formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(putUserPromoSuccess(json));
        }
        else{
          dispatch(putUserPromoFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(putUserPromoFailure(error)));
  };
}

export function patchUserPromo(id,formdata) {
  return dispatch => {
    dispatch(patchUserPromoBegin());
    return patchUserPromoApi(id,formdata)
      .then(json => {
        dispatch(patchUserPromoSuccess(json));
      })
      .catch(error => dispatch(patchUserPromoFailure(error)));
  };
}




// Action Creators
//GET ALL
export const fetchAllUserPromoBegin = () => ({
  type: FETCH_ALL_USER_PROMO_START
});

export const fetchAllUserPromoSuccess = data => ({
  type: FETCH_ALL_USER_PROMO_SUCCESS,
  payload: { data }
});

export const fetchAllUserPromoFailure = error => ({
  type: FETCH_ALL_USER_PROMO_FAILURE,
  payload: { error }
});


// GET SINGLE BRAND

export const fetchUserPromoDetailBegin = () => ({
  type: FETCH_USER_PROMO_DETAILS_START
});

export const fetchUserPromoDetailSuccess = data => ({
  type: FETCH_USER_PROMO_DETAILS_SUCCESS,
  payload: { data }
});

export const fetchUserPromoDetailFailure = error => ({
  type: FETCH_USER_PROMO_DETAILS_FAILURE,
  payload: { error }
});

//POST

export const postUserPromoBegin = () => ({
    type: POST_USER_PROMO_START
  });
  
export const postUserPromoSuccess = data => ({
    type: POST_USER_PROMO_SUCCESS,
    payload: { data }
  });
  
export const postUserPromoFailure = error => ({
    type: POST_USER_PROMO_FAILURE,
    payload: { error }
  });


//POST MULTIUSER

export const postMultiUserPromoBegin = () => ({
    type: POST_MULTIUSER_PROMO_START
  });
  
export const postMultiUserPromoSuccess = data => ({
    type: POST_MULTIUSER_PROMO_SUCCESS,
    payload: { data }
  });
  
export const postMultiUserPromoFailure = error => ({
    type: POST_MULTIUSER_PROMO_FAILURE,
    payload: { error }
  });

//PUT
export const putUserPromoBegin = () => ({
    type: PUT_USER_PROMO_START
  });
  
export const putUserPromoSuccess = data => ({
    type: PUT_USER_PROMO_SUCCESS,
    payload: { data }
  });
  
export const putUserPromoFailure = error => ({
    type: PUT_USER_PROMO_FAILURE,
    payload: { error }
  });

//PATCH
export const patchUserPromoBegin = () => ({
  type: PATCH_USER_PROMO_START
});

export const patchUserPromoSuccess = data => ({
  type: PATCH_USER_PROMO_SUCCESS,
  payload: { data }
});

export const patchUserPromoFailure = error => ({
  type: PATCH_USER_PROMO_FAILURE,
  payload: { error }
});