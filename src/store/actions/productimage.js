import { 
  getProductImage,
  getLineImage,
  postProductImageApi,
  uploadProductImageApi,
  uploadBulkProductImageApi
} from "../../api/productimageapi";

import {
  FETCH_PRODUCT_IMAGE_START,
  FETCH_PRODUCT_IMAGE_SUCCESS,
  FETCH_PRODUCT_IMAGE_FAILURE,
  FETCH_LINE_IMAGE_START,
  FETCH_LINE_IMAGE_SUCCESS,
  FETCH_LINE_IMAGE_FAILURE,
  POST_PRODUCT_IMAGE_START,
  POST_PRODUCT_IMAGE_SUCCESS,
  POST_PRODUCT_IMAGE_FAILURE,
  REMOVE_ERROR,
  UPLOAD_PRODUCT_IMAGE_START,
  UPLOAD_PRODUCT_IMAGE_SUCCESS,
  UPLOAD_PRODUCT_IMAGE_FAILURE,
} from "./actionTypes";




export function fetchProductImage(id,lineid) {
return dispatch => {
  dispatch(fetchProductImageBegin());
  return getProductImage(id,lineid)
    .then(json => {
      if(!json.data.errorExists){
      dispatch(fetchProductImageSuccess(json));
      }
      else{
        dispatch(fetchProductImageFailure(json.data.reason))
      }
    })
    .catch(error => dispatch(fetchProductImageFailure(error)));
};
}


export function fetchLineImage(id) {
return dispatch => {
  dispatch(fetchLineImageBegin());
  return getLineImage(id)
    .then(json => {
      if(!json.data.errorExists){
      dispatch(fetchLineImageSuccess(json));
      }
      else{
        dispatch(fetchLineImageFailure(json.data.reason))
      }
    })
    .catch(error => dispatch(fetchLineImageFailure(error)));
};
}


export function removeError(){
return dispatch => {
  return dispatch(RemoveError(null))
};
}


export function uploadProductImage(formdata) {
return dispatch => {
  dispatch(uploadProductImageBegin());
  return uploadProductImageApi(formdata)
    .then(json => {
       if(!json.data.errorExists){
        dispatch(uploadProductImageSuccess(json))
       }
      else{
        dispatch(uploadProductImageFailure(json.data.reason))
      }
    })
    .catch(error => dispatch(uploadProductImageFailure(error)));
};
}


export function uploadBulkProductImages(formdata,data){
return dispatch =>{
  dispatch(uploadProductImageBegin());
  return uploadBulkProductImageApi(formdata,data)
  .then(response => {
    if(!response.data.errorExists){
      dispatch(uploadProductImageSuccess(response))
    }
    else{
      dispatch(uploadProductImageFailure(response.data.reason))
    }
  })
  .catch(error => dispatch(uploadProductImageFailure(error)));
}
}




export function postProductImage(formdata,pid) {
return dispatch => {
  dispatch(postProductImageBegin());
  return postProductImageApi(formdata,pid)
    .then(json => {
       if(!json.data.errorExists){
        dispatch(postProductImageSuccess(json))
       }
      else{
        dispatch(postProductImageFailure(json.data.reason))
      }
    })
    .catch(error => dispatch(postProductImageFailure(error)));
};
}

export const fetchProductImageBegin = () => ({
type: FETCH_PRODUCT_IMAGE_START
});

export const fetchProductImageSuccess = data => ({
type: FETCH_PRODUCT_IMAGE_SUCCESS,
payload: { data }
});

export const fetchProductImageFailure = error => ({
type: FETCH_PRODUCT_IMAGE_FAILURE,
payload: { error }
});


export const RemoveError = error => ({
type: REMOVE_ERROR,
payload: { error }
});


export const fetchLineImageBegin = () => ({
type: FETCH_LINE_IMAGE_START
});

export const fetchLineImageSuccess = data => ({
type: FETCH_LINE_IMAGE_SUCCESS,
payload: { data }
});

export const fetchLineImageFailure = error => ({
type: FETCH_LINE_IMAGE_FAILURE,
payload: { error }
});




//POST

export const postProductImageBegin = () => ({
  type: POST_PRODUCT_IMAGE_START
});

export const postProductImageSuccess = data => ({
  type: POST_PRODUCT_IMAGE_SUCCESS,
  payload: { data }
});

export const postProductImageFailure = error => ({
  type: POST_PRODUCT_IMAGE_FAILURE,
  payload: { error }
});



//Upload

export const uploadProductImageBegin = () => ({
  type: UPLOAD_PRODUCT_IMAGE_START
});

export const uploadProductImageSuccess = data => ({
  type: UPLOAD_PRODUCT_IMAGE_SUCCESS,
  payload: { data }
});

export const uploadProductImageFailure = error => ({
  type: UPLOAD_PRODUCT_IMAGE_FAILURE,
  payload: { error }
});
