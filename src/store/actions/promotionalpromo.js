import { 
    getPromotionalPromoDetail,
    getPromotionalPromoList,
    postPromotionalPromoApi,
    putPromotionalPromoApi,
    patchPromotionalPromoApi,
 } from "../../api/promotionalpromoapi";
import {
    FETCH_PROMOTIONAL_PROMO_DETAILS_START,
    FETCH_PROMOTIONAL_PROMO_DETAILS_SUCCESS,
    FETCH_PROMOTIONAL_PROMO_DETAILS_FAILURE,
    POST_PROMOTIONAL_PROMO_START,
    POST_PROMOTIONAL_PROMO_SUCCESS,
    POST_PROMOTIONAL_PROMO_FAILURE,
    PUT_PROMOTIONAL_PROMO_START,
    PUT_PROMOTIONAL_PROMO_SUCCESS,
    PUT_PROMOTIONAL_PROMO_FAILURE,
    PATCH_PROMOTIONAL_PROMO_START,
    PATCH_PROMOTIONAL_PROMO_SUCCESS,
    PATCH_PROMOTIONAL_PROMO_FAILURE,
    FETCH_ALL_PROMOTIONAL_PROMO_START,
    FETCH_ALL_PROMOTIONAL_PROMO_SUCCESS,
    FETCH_ALL_PROMOTIONAL_PROMO_FAILURE,
} from "./actionTypes";




export function fetchPromotionalPromoDetail(id) {
  return dispatch => {
    dispatch(fetchPromotionalPromoDetailBegin());
    return getPromotionalPromoDetail(id)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(fetchPromotionalPromoDetailSuccess(json));
        }
        else{
          console.log("Error 1", json)
          dispatch(fetchPromotionalPromoDetailFailure(json.data.reason))
        }
      })
      .catch(error => {dispatch(fetchPromotionalPromoDetailFailure(error)); console.log("This is error",error)});
  };
}



export function fetchAllPromotionalPromo(searched_text,status,current_page,from="") {
  return dispatch => {
    dispatch(fetchAllPromotionalPromoBegin());
    return getPromotionalPromoList(searched_text,status,current_page,from)
      .then(json => {
        dispatch(fetchAllPromotionalPromoSuccess(json));
      })
      .catch(error => dispatch(fetchAllPromotionalPromoFailure(error)));
  };
}


export function postPromotionalPromo(formdata) {
  return dispatch => {
    dispatch(postPromotionalPromoBegin());
    return postPromotionalPromoApi(formdata)
      .then(json => {
        if(!json.data.errorExists){
          dispatch(postPromotionalPromoSuccess(json));
        }
        else{
          dispatch(postPromotionalPromoFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(postPromotionalPromoFailure(error)));
  };
}


export function putPromotionalPromo(id,formdata) {
  return dispatch => {
    dispatch(putPromotionalPromoBegin());
    return putPromotionalPromoApi(id,formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(putPromotionalPromoSuccess(json));
        }
        else{
          dispatch(putPromotionalPromoFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(putPromotionalPromoFailure(error)));
  };
}

export function patchPromotionalPromo(id,formdata) {
  return dispatch => {
    dispatch(patchPromotionalPromoBegin());
    return patchPromotionalPromoApi(id,formdata)
      .then(json => {
        dispatch(patchPromotionalPromoSuccess(json));
      })
      .catch(error => dispatch(patchPromotionalPromoFailure(error)));
  };
}




// Action Creators
//GET ALL
export const fetchAllPromotionalPromoBegin = () => ({
  type: FETCH_ALL_PROMOTIONAL_PROMO_START
});

export const fetchAllPromotionalPromoSuccess = data => ({
  type: FETCH_ALL_PROMOTIONAL_PROMO_SUCCESS,
  payload: { data }
});

export const fetchAllPromotionalPromoFailure = error => ({
  type: FETCH_ALL_PROMOTIONAL_PROMO_FAILURE,
  payload: { error }
});


// GET SINGLE BRAND

export const fetchPromotionalPromoDetailBegin = () => ({
  type: FETCH_PROMOTIONAL_PROMO_DETAILS_START
});

export const fetchPromotionalPromoDetailSuccess = data => ({
  type: FETCH_PROMOTIONAL_PROMO_DETAILS_SUCCESS,
  payload: { data }
});

export const fetchPromotionalPromoDetailFailure = error => ({
  type: FETCH_PROMOTIONAL_PROMO_DETAILS_FAILURE,
  payload: { error }
});

//POST

export const postPromotionalPromoBegin = () => ({
    type: POST_PROMOTIONAL_PROMO_START
  });
  
export const postPromotionalPromoSuccess = data => ({
    type: POST_PROMOTIONAL_PROMO_SUCCESS,
    payload: { data }
  });
  
export const postPromotionalPromoFailure = error => ({
    type: POST_PROMOTIONAL_PROMO_FAILURE,
    payload: { error }
  });

//PUT
export const putPromotionalPromoBegin = () => ({
    type: PUT_PROMOTIONAL_PROMO_START
  });
  
export const putPromotionalPromoSuccess = data => ({
    type: PUT_PROMOTIONAL_PROMO_SUCCESS,
    payload: { data }
  });
  
export const putPromotionalPromoFailure = error => ({
    type: PUT_PROMOTIONAL_PROMO_FAILURE,
    payload: { error }
  });

//PATCH
export const patchPromotionalPromoBegin = () => ({
  type: PATCH_PROMOTIONAL_PROMO_START
});

export const patchPromotionalPromoSuccess = data => ({
  type: PATCH_PROMOTIONAL_PROMO_SUCCESS,
  payload: { data }
});

export const patchPromotionalPromoFailure = error => ({
  type: PATCH_PROMOTIONAL_PROMO_FAILURE,
  payload: { error }
});