import { 
    getAttributeTypeDetail,
    getAttributeTypeList,
    postAttributeTypeApi,
    putAttributeTypeApi,
    patchAttributeTypeApi,
    getEnum,
 } from "../../api/attributetypeapi";
import {
    FETCH_ATTRIBUTETYPE_DETAILS_START,
    FETCH_ATTRIBUTETYPE_DETAILS_SUCCESS,
    FETCH_ATTRIBUTETYPE_DETAILS_FAILURE,
    POST_ATTRIBUTETYPE_START,
    POST_ATTRIBUTETYPE_SUCCESS,
    POST_ATTRIBUTETYPE_FAILURE,
    PUT_ATTRIBUTETYPE_START,
    PUT_ATTRIBUTETYPE_SUCCESS,
    PUT_ATTRIBUTETYPE_FAILURE,
    PATCH_ATTRIBUTETYPE_START,
    PATCH_ATTRIBUTETYPE_SUCCESS,
    PATCH_ATTRIBUTETYPE_FAILURE,
    FETCH_ALL_ATTRIBUTETYPES_START,
    FETCH_ALL_ATTRIBUTETYPES_SUCCESS,
    FETCH_ALL_ATTRIBUTETYPES_FAILURE,
    FETCH_ALL_ENUM_START,
    FETCH_ALL_ENUM_SUCCESS,
    FETCH_ALL_ENUM_FAILURE,

} from "./actionTypes";




export function fetchAttributeTypeDetail(id) {
  return dispatch => {
    dispatch(fetchAttributeTypeDetailBegin());
    return getAttributeTypeDetail(id)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(fetchAttributeTypeDetailSuccess(json));
        }
        else{
          dispatch(fetchAttributeTypeDetailFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(fetchAttributeTypeDetailFailure(error)));
  };
}



export function fetchAllAttributeType(searched_text,status,current_page) {
  return dispatch => {
    dispatch(fetchAllAttributeTypeBegin());
    return getAttributeTypeList(searched_text,status,current_page)
      .then(json => {
        dispatch(fetchAllAttributeTypeSuccess(json));
      })
      .catch(error => dispatch(fetchAllAttributeTypeFailure(error)));
  };
}


export function fetchAllEnum() {
  return dispatch => {
    dispatch(fetchAllEnumBegin());
    return getEnum()
      .then(json => {
        dispatch(fetchAllEnumSuccess(json));
      })
      .catch(error => dispatch(fetchAllEnumFailure(error)));
  };
}



export function postAttributeType(formdata) {
  return dispatch => {
    dispatch(postAttributeTypeBegin());
    return postAttributeTypeApi(formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(postAttributeTypeSuccess(json));
        }
        else{
          dispatch(postAttributeTypeFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(postAttributeTypeFailure(error)));
  };
}


export function putAttributeType(id,formdata) {
  return dispatch => {
    dispatch(putAttributeTypeBegin());
    return putAttributeTypeApi(id,formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(putAttributeTypeSuccess(json));
        }
        else{
          dispatch(putAttributeTypeFailure(json.data.reason)) 
        }
      })
      .catch(error => dispatch(putAttributeTypeFailure(error)));
  };
}

export function patchAttributeType(id,formdata) {
  return dispatch => {
    dispatch(patchAttributeTypeBegin());
    return patchAttributeTypeApi(id,formdata)
      .then(json => {
        dispatch(patchAttributeTypeSuccess(json));
      })
      .catch(error => dispatch(patchAttributeTypeFailure(error)));
  };
}




// Action Creators
//GET ALL
export const fetchAllAttributeTypeBegin = () => ({
  type: FETCH_ALL_ATTRIBUTETYPES_START
});

export const fetchAllAttributeTypeSuccess = data => ({
  type: FETCH_ALL_ATTRIBUTETYPES_SUCCESS,
  payload: { data }
});

export const fetchAllAttributeTypeFailure = error => ({
  type: FETCH_ALL_ATTRIBUTETYPES_FAILURE,
  payload: { error }
});


//GET ALL ENUM
export const fetchAllEnumBegin = () => ({
  type: FETCH_ALL_ENUM_START
});

export const fetchAllEnumSuccess = data => ({
  type: FETCH_ALL_ENUM_SUCCESS,
  payload: { data }
});

export const fetchAllEnumFailure = error => ({
  type: FETCH_ALL_ENUM_FAILURE,
  payload: { error }
});



// GET SINGLE ATTRIBUTETYPE

export const fetchAttributeTypeDetailBegin = () => ({
  type: FETCH_ATTRIBUTETYPE_DETAILS_START
});

export const fetchAttributeTypeDetailSuccess = data => ({
  type: FETCH_ATTRIBUTETYPE_DETAILS_SUCCESS,
  payload: { data }
});

export const fetchAttributeTypeDetailFailure = error => ({
  type: FETCH_ATTRIBUTETYPE_DETAILS_FAILURE,
  payload: { error }
});

//POST

export const postAttributeTypeBegin = () => ({
    type: POST_ATTRIBUTETYPE_START
  });
  
export const postAttributeTypeSuccess = data => ({
    type: POST_ATTRIBUTETYPE_SUCCESS,
    payload: { data }
  });
  
export const postAttributeTypeFailure = error => ({
    type: POST_ATTRIBUTETYPE_FAILURE,
    payload: { error }
  });

//PUT
export const putAttributeTypeBegin = () => ({
    type: PUT_ATTRIBUTETYPE_START
  });
  
export const putAttributeTypeSuccess = data => ({
    type: PUT_ATTRIBUTETYPE_SUCCESS,
    payload: { data }
  });
  
export const putAttributeTypeFailure = error => ({
    type: PUT_ATTRIBUTETYPE_FAILURE,
    payload: { error }
  });

//PATCH
export const patchAttributeTypeBegin = () => ({
  type: PATCH_ATTRIBUTETYPE_START
});

export const patchAttributeTypeSuccess = data => ({
  type: PATCH_ATTRIBUTETYPE_SUCCESS,
  payload: { data }
});

export const patchAttributeTypeFailure = error => ({
  type: PATCH_ATTRIBUTETYPE_FAILURE,
  payload: { error }
});