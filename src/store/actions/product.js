import { 
    getProductDetail,
    getProductList,
    postProductApi,
    putProductApi,
    patchProductApi,
    getMetadata,
    batchValidateApi,
    makeProductLiveApi,
    batchValidateServicablePincodeApi,
    batchPincodeValidateApi
 } from "../../api/productapi";
import {
    FETCH_PRODUCT_DETAILS_START,
    FETCH_PRODUCT_DETAILS_SUCCESS,
    FETCH_PRODUCT_DETAILS_FAILURE,
    POST_PRODUCT_START,
    POST_PRODUCT_SUCCESS,
    POST_PRODUCT_FAILURE,
    POST_PRODUCT_LIVE_START,
    POST_PRODUCT_LIVE_SUCCESS,
    POST_PRODUCT_LIVE_FAILURE,
    PUT_PRODUCT_START,
    PUT_PRODUCT_SUCCESS,
    PUT_PRODUCT_FAILURE,
    PATCH_PRODUCT_START,
    PATCH_PRODUCT_SUCCESS,
    PATCH_PRODUCT_FAILURE,
    FETCH_ALL_PRODUCTS_START,
    FETCH_ALL_PRODUCTS_SUCCESS,
    FETCH_ALL_PRODUCTS_FAILURE,
    FETCH_ALL_METADATA_START,
    FETCH_ALL_METADATA_SUCCESS,
    FETCH_ALL_METADATA_FAILURE,
    BATCH_PRODUCT_START,
    BATCH_PRODUCT_SUCCESS,
    BATCH_PRODUCT_FAILURE,
    BATCH_SERVICABLE_PINCODE_PRODUCT_START,
    BATCH_SERVICABLE_PINCODE_PRODUCT_SUCCESS,
    BATCH_SERVICABLE_PINCODE_PRODUCT_FAILURE,
    BATCH_PINCODE_PRODUCT_START,
    BATCH_PINCODE_PRODUCT_SUCCESS,
    BATCH_PINCODE_PRODUCT_FAILURE
} from "./actionTypes";




export function fetchProductDetail(id) {
  return dispatch => {
    dispatch(fetchProductDetailBegin());
    return getProductDetail(id)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(fetchProductDetailSuccess(json));
        }
        else{
          dispatch(fetchProductDetailFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(fetchProductDetailFailure(error)));
  };
}
export function makeProductLive(id, email) {
  return dispatch => {
    dispatch(makeProductLiveBegin());
    return makeProductLiveApi(id, email)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(makeProductLiveSuccess(json));
        }
        else{
          dispatch(makeProductLiveFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(makeProductLiveFailure(error)));
  };
}


export function fetchMetadata() {
  return dispatch => {
    dispatch(fetchMetadataBegin());
    return getMetadata()
      .then(json => {
        dispatch(fetchMetadataSuccess(json));
      })
      .catch(error => dispatch(fetchMetadataFailure(error)));
  };
}



export function fetchAllProduct(searched_text,status,current_page) {
  return dispatch => {
    dispatch(fetchAllProductBegin());
    return getProductList(searched_text,status,current_page)
      .then(json => {
        dispatch(fetchAllProductSuccess(json));
      })
      .catch(error => dispatch(fetchAllProductFailure(error)));
  };
}


export function postProduct(formdata) {
  return dispatch => {
    dispatch(postProductBegin());
    return postProductApi(formdata)
      .then(json => {
         if(!json.data.errorExists){
          dispatch(postProductSuccess(json))
         }
        else{
          dispatch(postProductFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(postProductFailure(error)));
  };
}


export function batchValidate(formdata,url="") {
  return dispatch => {
    dispatch(batchValidateBegin());
    return batchValidateApi(formdata,url)
      .then(json => {
         if(!json.data.errorExists){
          dispatch(batchValidateSuccess(json))
         }
        else{
          dispatch(batchValidateFailure(json.data.text))
        }
      })
      .catch(error => dispatch(batchValidateFailure(error)));
  };
}



export function putProduct(id,formdata) {
  return dispatch => {
    dispatch(putProductBegin());
    return putProductApi(id,formdata)
      .then(json => {
        if(!json.data.errorExists){
          dispatch(putProductSuccess(json))
        }
        else{
          dispatch(putProductFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(putProductFailure(error)));
  };
}

export function patchProduct(id,formdata) {
  return dispatch => {
    dispatch(patchProductBegin());
    return patchProductApi(id,formdata)
      .then(json => {
        dispatch(patchProductSuccess(json));
      })
      .catch(error => dispatch(patchProductFailure(error)));
  };
}


export function batchValidateServicablePinCode(formdata,url="") {
  return dispatch => {
    dispatch(batchValidateServicablePincodeBegin());
    return batchValidateServicablePincodeApi(formdata,url)
      .then(json => {
         if(!json.data.errorExists){
          dispatch(batchValidateServicablePincodeSuccess(json))
         }
        else{
          dispatch(batchValidateServicablePincodeFailure(json.data.text))
        }
      })
      .catch(error => dispatch(batchValidateServicablePincodeFailure(error)));
  };
}

export function batchValidatePincode(formdata,url="") {
  return dispatch => {
    dispatch(batchPincodeValidateBegin());
    return batchPincodeValidateApi(formdata,url)
      .then(json => {
         if(!json.data.errorExists){
          dispatch(batchPincodeValidateSuccess(json))
         }
        else{
          dispatch(batchPincodeValidateFailure(json.data.text))
        }
      })
      .catch(error => dispatch(batchPincodeValidateFailure(error)));
  };
}





// Action Creators
//GET ALL
export const fetchAllProductBegin = () => ({
  type: FETCH_ALL_PRODUCTS_START
});

export const fetchAllProductSuccess = data => ({
  type: FETCH_ALL_PRODUCTS_SUCCESS,
  payload: { data }
});

export const fetchAllProductFailure = error => ({
  type: FETCH_ALL_PRODUCTS_FAILURE,
  payload: { error }
});


// GET SINGLE PRODUCT

export const fetchProductDetailBegin = () => ({
  type: FETCH_PRODUCT_DETAILS_START
});

export const fetchProductDetailSuccess = data => ({
  type: FETCH_PRODUCT_DETAILS_SUCCESS,
  payload: { data }
});

export const fetchProductDetailFailure = error => ({
  type: FETCH_PRODUCT_DETAILS_FAILURE,
  payload: { error }
});


// GET SINGLE PRODUCT

export const makeProductLiveBegin = () => ({
  type: POST_PRODUCT_LIVE_START
});

export const makeProductLiveSuccess = data => ({
  type: POST_PRODUCT_LIVE_SUCCESS,
  payload: { data }
});

export const makeProductLiveFailure = error => ({
  type: POST_PRODUCT_LIVE_FAILURE,
  payload: { error }
});

// GET METADATA PRODUCT

export const fetchMetadataBegin = () => ({
  type: FETCH_ALL_METADATA_START
});

export const fetchMetadataSuccess = data => ({
  type: FETCH_ALL_METADATA_SUCCESS,
  payload: { data }
});

export const fetchMetadataFailure = error => ({
  type: FETCH_ALL_METADATA_FAILURE,
  payload: { error }
});

//POST

export const postProductBegin = () => ({
    type: POST_PRODUCT_START
  });
  
export const postProductSuccess = data => ({
    type: POST_PRODUCT_SUCCESS,
    payload: { data }
  });
  
export const postProductFailure = error => ({
    type: POST_PRODUCT_FAILURE,
    payload: { error }
  });

//PUT
export const putProductBegin = () => ({
    type: PUT_PRODUCT_START
  });
  
export const putProductSuccess = data => ({
    type: PUT_PRODUCT_SUCCESS,
    payload: { data }
  });
  
export const putProductFailure = error => ({
    type: PUT_PRODUCT_FAILURE,
    payload: { error }
  });

//PATCH
export const patchProductBegin = () => ({
  type: PATCH_PRODUCT_START
});

export const patchProductSuccess = data => ({
  type: PATCH_PRODUCT_SUCCESS,
  payload: { data }
});

export const patchProductFailure = error => ({
  type: PATCH_PRODUCT_FAILURE,
  payload: { error }
});



//BATCH

export const batchValidateBegin = () => ({
  type: BATCH_PRODUCT_START
});

export const batchValidateSuccess = data => ({
  type: BATCH_PRODUCT_SUCCESS,
  payload: { data }
});

export const batchValidateFailure = error => ({
  type: BATCH_PRODUCT_FAILURE,
  payload: { error }
});






export const batchValidateServicablePincodeBegin = () => ({
  type: BATCH_SERVICABLE_PINCODE_PRODUCT_START
});

export const batchValidateServicablePincodeSuccess = data => ({
  type: BATCH_SERVICABLE_PINCODE_PRODUCT_SUCCESS,
  payload: { data }
});

export const batchValidateServicablePincodeFailure = error => ({
  type: BATCH_SERVICABLE_PINCODE_PRODUCT_FAILURE,
  payload: { error }
});
//BATCH

export const batchPincodeValidateBegin = () => ({
  type: BATCH_PINCODE_PRODUCT_START
});

export const batchPincodeValidateSuccess = data => ({
  type: BATCH_PINCODE_PRODUCT_SUCCESS,
  payload: { data }
});

export const batchPincodeValidateFailure = error => ({
  type: BATCH_PINCODE_PRODUCT_FAILURE,
  payload: { error }
});