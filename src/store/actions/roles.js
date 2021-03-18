import {
    // getBrandDetail,
    getRolesList,
    // putBrandApi,
    // postBrandApi,
    // patchBrandApi,
 } from "../../api/rolesApi";
import {
    FETCH_BRAND_DETAILS_START,
    FETCH_BRAND_DETAILS_SUCCESS,
    FETCH_BRAND_DETAILS_FAILURE,
    POST_BRAND_START,
    POST_BRAND_SUCCESS,
    POST_BRAND_FAILURE,
    PUT_BRAND_START,
    PUT_BRAND_SUCCESS,
    PUT_BRAND_FAILURE,
    PATCH_BRAND_START,
    PATCH_BRAND_SUCCESS,
    PATCH_BRAND_FAILURE,
    FETCH_ALL_BRANDS_START,
    FETCH_ALL_BRANDS_SUCCESS,
    FETCH_ALL_BRANDS_FAILURE,

    FETCH_ALL_ROLES_START,
    FETCH_ALL_ROLES_SUCCESS,
    FETCH_ALL_ROLES_FAILURE,
} from "./actionTypes";



export function fetchBrandDetail(id) {
  return dispatch => {
    dispatch(fetchBrandDetailBegin());
    return getBrandDetail(id)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(fetchBrandDetailSuccess(json));
        }
        else{
          console.log("Error 1", json)
          dispatch(fetchBrandDetailFailure(json.data.reason))
        }
      })
      .catch(error => {dispatch(fetchBrandDetailFailure(error)); console.log("This is error",error)});
  };
}

export function fetchAllRoles(searched_text,status,current_page) {
  return dispatch => {
    dispatch(fetchAllRolesBegin());
    return getRolesList(searched_text,status,current_page)
      .then(json => {
        dispatch(fetchAllRolesSuccess(json));
      })
      .catch(error => dispatch(fetchAllRolesFailure(error)));
  };
}


export function postBrand(formdata) {
  return dispatch => {
    dispatch(postBrandBegin());
    return postBrandApi(formdata)
      .then(json => {
        if(!json.data.errorExists){
          dispatch(postBrandSuccess(json));
        }
        else{
          dispatch(postBrandFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(postBrandFailure(error)));
  };
}


export function putBrand(id,formdata) {
  return dispatch => {
    dispatch(putBrandBegin());
    return putBrandApi(id,formdata)
      .then(json => {
        if(!json.data.errorExists){
        dispatch(putBrandSuccess(json));
        }
        else{
          dispatch(putBrandFailure(json.data.reason))
        }
      })
      .catch(error => dispatch(putBrandFailure(error)));
  };
}

export function patchBrand(id,formdata) {
  return dispatch => {
    dispatch(patchBrandBegin());
    return patchBrandApi(id,formdata)
      .then(json => {
        dispatch(patchBrandSuccess(json));
      })
      .catch(error => dispatch(patchBrandFailure(error)));
  };
}




// Action Creators
//GET ALL
export const fetchAllBrandBegin = () => ({
  type: FETCH_ALL_BRANDS_START
});

export const fetchAllBrandSuccess = data => ({
  type: FETCH_ALL_BRANDS_SUCCESS,
  payload: { data }
});

export const fetchAllBrandFailure = error => ({
  type: FETCH_ALL_BRANDS_FAILURE,
  payload: { error }
});

export const fetchAllRolesBegin = () => ({
  type: FETCH_ALL_ROLES_START
});

export const fetchAllRolesSuccess = data => ({
  type: FETCH_ALL_ROLES_SUCCESS,
  payload: { data }
});

export const fetchAllRolesFailure = error => ({
  type: FETCH_ALL_ROLES_FAILURE,
  payload: { error }
});


// GET SINGLE BRAND

export const fetchBrandDetailBegin = () => ({
  type: FETCH_BRAND_DETAILS_START
});

export const fetchBrandDetailSuccess = data => ({
  type: FETCH_BRAND_DETAILS_SUCCESS,
  payload: { data }
});

export const fetchBrandDetailFailure = error => ({
  type: FETCH_BRAND_DETAILS_FAILURE,
  payload: { error }
});

//POST

export const postBrandBegin = () => ({
    type: POST_BRAND_START
  });

export const postBrandSuccess = data => ({
    type: POST_BRAND_SUCCESS,
    payload: { data }
  });

export const postBrandFailure = error => ({
    type: POST_BRAND_FAILURE,
    payload: { error }
  });

//PUT
export const putBrandBegin = () => ({
    type: PUT_BRAND_START
  });

export const putBrandSuccess = data => ({
    type: PUT_BRAND_SUCCESS,
    payload: { data }
  });

export const putBrandFailure = error => ({
    type: PUT_BRAND_FAILURE,
    payload: { error }
  });

//PATCH
export const patchBrandBegin = () => ({
  type: PATCH_BRAND_START
});

export const patchBrandSuccess = data => ({
  type: PATCH_BRAND_SUCCESS,
  payload: { data }
});

export const patchBrandFailure = error => ({
  type: PATCH_BRAND_FAILURE,
  payload: { error }
});
