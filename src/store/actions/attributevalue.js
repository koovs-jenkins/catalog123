import { 
    getAttributeValueDetail,
    getAttributeValueList,
    postAttributeValueApi,
    putAttributeValueApi,
    patchAttributeValueApi,
 } from "../../api/attributevalueapi";
import {
    FETCH_ATTRIBUTEVALUE_DETAILS_START,
    FETCH_ATTRIBUTEVALUE_DETAILS_SUCCESS,
    FETCH_ATTRIBUTEVALUE_DETAILS_FAILURE,
    POST_ATTRIBUTEVALUE_START,
    POST_ATTRIBUTEVALUE_SUCCESS,
    POST_ATTRIBUTEVALUE_FAILURE,
    PUT_ATTRIBUTEVALUE_START,
    PUT_ATTRIBUTEVALUE_SUCCESS,
    PUT_ATTRIBUTEVALUE_FAILURE,
    PATCH_ATTRIBUTEVALUE_START,
    PATCH_ATTRIBUTEVALUE_SUCCESS,
    PATCH_ATTRIBUTEVALUE_FAILURE,
    FETCH_ALL_ATTRIBUTEVALUES_START,
    FETCH_ALL_ATTRIBUTEVALUES_SUCCESS,
    FETCH_ALL_ATTRIBUTEVALUES_FAILURE,
} from "./actionTypes";




export function fetchAttributeValueDetail(id) {
  return dispatch => {
    dispatch(fetchAttributeValueDetailBegin());
    return getAttributeValueDetail(id)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(fetchAttributeValueDetailSuccess(json));
        }
        else{
          dispatch(fetchAttributeValueDetailFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(fetchAttributeValueDetailFailure(error)));
  };
}



export function fetchAllAttributeValue(attr_id,searched_text,status,current_page) {
  return dispatch => {
    dispatch(fetchAllAttributeValueBegin());
    return getAttributeValueList(attr_id,searched_text,status,current_page)
      .then(json => {
        dispatch(fetchAllAttributeValueSuccess(json));
      })
      .catch(error => dispatch(fetchAllAttributeValueFailure(error)));
  };
}


export function postAttributeValue(formdata) {
  return dispatch => {
    dispatch(postAttributeValueBegin());
    return postAttributeValueApi(formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(postAttributeValueSuccess(json));
        }
        else{
          dispatch(postAttributeValueFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(postAttributeValueFailure(error)));
  };
}


export function putAttributeValue(id,formdata) {
  return dispatch => {
    dispatch(putAttributeValueBegin());
    return putAttributeValueApi(id,formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(putAttributeValueSuccess(json));
        }
        else{
          dispatch(putAttributeValueFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(putAttributeValueFailure(error)));
  };
}

export function patchAttributeValue(id,formdata) {
  return dispatch => {
    dispatch(patchAttributeValueBegin());
    return patchAttributeValueApi(id,formdata)
      .then(json => {
        dispatch(patchAttributeValueSuccess(json));
      })
      .catch(error => dispatch(patchAttributeValueFailure(error)));
  };
}




// Action Creators
//GET ALL
export const fetchAllAttributeValueBegin = () => ({
  type: FETCH_ALL_ATTRIBUTEVALUES_START
});

export const fetchAllAttributeValueSuccess = data => ({
  type: FETCH_ALL_ATTRIBUTEVALUES_SUCCESS,
  payload: { data }
});

export const fetchAllAttributeValueFailure = error => ({
  type: FETCH_ALL_ATTRIBUTEVALUES_FAILURE,
  payload: { error }
});

// GET SINGLE ATTRIBUTEVALUE

export const fetchAttributeValueDetailBegin = () => ({
  type: FETCH_ATTRIBUTEVALUE_DETAILS_START
});

export const fetchAttributeValueDetailSuccess = data => ({
  type: FETCH_ATTRIBUTEVALUE_DETAILS_SUCCESS,
  payload: { data }
});

export const fetchAttributeValueDetailFailure = error => ({
  type: FETCH_ATTRIBUTEVALUE_DETAILS_FAILURE,
  payload: { error }
});

//POST

export const postAttributeValueBegin = () => ({
    type: POST_ATTRIBUTEVALUE_START
  });
  
export const postAttributeValueSuccess = data => ({
    type: POST_ATTRIBUTEVALUE_SUCCESS,
    payload: { data }
  });
  
export const postAttributeValueFailure = error => ({
    type: POST_ATTRIBUTEVALUE_FAILURE,
    payload: { error }
  });

//PUT
export const putAttributeValueBegin = () => ({
    type: PUT_ATTRIBUTEVALUE_START
  });
  
export const putAttributeValueSuccess = data => ({
    type: PUT_ATTRIBUTEVALUE_SUCCESS,
    payload: { data }
  });
  
export const putAttributeValueFailure = error => ({
    type: PUT_ATTRIBUTEVALUE_FAILURE,
    payload: { error }
  });

//PATCH
export const patchAttributeValueBegin = () => ({
  type: PATCH_ATTRIBUTEVALUE_START
});

export const patchAttributeValueSuccess = data => ({
  type: PATCH_ATTRIBUTEVALUE_SUCCESS,
  payload: { data }
});

export const patchAttributeValueFailure = error => ({
  type: PATCH_ATTRIBUTEVALUE_FAILURE,
  payload: { error }
});