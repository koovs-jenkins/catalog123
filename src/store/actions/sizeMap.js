import {
    FETCH_MASTER_CATEGORY_FAILURE,
    FETCH_MASTER_CATEGORY_START,
    FETCH_MASTER_CATEGORY_SUCCESS,
    FETCH_SUB_CATEGORY_FAILURE,
    FETCH_SUB_CATEGORY_START,
    FETCH_SUB_CATEGORY_SUCCESS,
    FETCH_BRAND_TEMPLATE_FAILURE,
    FETCH_BRAND_TEMPLATE_START,
    FETCH_BRAND_TEMPLATE_SUCCESS,
    POST_TEMPLATE_IMAGE_FAILURE,
    POST_TEMPLATE_IMAGE_START,
    POST_TEMPLATE_IMAGE_SUCCESS,
    POST_SIZEMAP_DATA_FAILURE,
    POST_SIZEMAP_DATA_START,
    POST_SIZEMAP_DATA_SUCCESS
  } from "./actionTypes";

import {
  getMasterCategory,
  getSubCategory,
  getBrands,
  postSizeMapData,
  uploadTemplateImageApi
} from "../../api/sizeMap"

export function fetchAllMasterCategory() {
    return dispatch => {
      dispatch(fetchAllMasterCategoryBegin());
      return getMasterCategory()
        .then(json => {
          if(!json.errorExists){
                dispatch(fetchAllMasterCategorySuccess(json));
            }
            else{
                dispatch(fetchAllMasterCategorySuccess('error in fetching master category'));
            }
        })
        .catch(error => dispatch(fetchAllMasterCategoryFailure(error)));
    };
}

export function fetchSubCategory(gender, masterId) {
  return dispatch => {
    dispatch(fetchSubCategoryBegin());
    return getSubCategory(gender, masterId)
      .then(json => {
        if(!json.errorExists){
              dispatch(fetchSubCategorySuccess(json));
          }
          else{
              dispatch(fetchSubCategorySuccess('error in fetching sub category'));
          }
      })
      .catch(error => dispatch(fetchSubCategoryFailure(error)));
  };
}

export function fetchBrandTemplate(gender, subCategoryID) {
  return dispatch => {
    dispatch(fetchBrandTemplateBegin());
    return getBrands(gender, subCategoryID)
      .then(json => {
        if(!json.errorExists){
              dispatch(fetchBrandTemplateSuccess(json));
          }
          else{
              dispatch(fetchBrandTemplateSuccess('error in fetching sub category'));
          }
      })
      .catch(error => dispatch(fetchBrandTemplateFailure(error)));
  };
}

export function uploadTemplateImage(formdata) {
    return dispatch => {
      dispatch(uploadTemplateImageBegin());
      return uploadTemplateImageApi(formdata)
        .then(json => {
           if(json.status=='200'){
            dispatch(uploadTemplateImageSuccess(json))
           }
          else{
            dispatch(uploadTemplateImageFailure(json.data.reason))
          }
        })
        .catch(error => dispatch(uploadTemplateImageFailure(error)));
    };
  }

export function postSizeMap(postData) {
    return dispatch => {
      dispatch(postSizeMapBegin());
      return postSizeMapData(postData)
        .then(json => {
          if(!json.errorExists){
                dispatch(postSizeMapSuccess(json));
            }
            else{
                dispatch(postSizeMapSuccess('error in fetching sub category'));
            }
        })
        .catch(error => dispatch(postSizeMapFailure(error)));
    };
  }

// Sub Category
  export const fetchSubCategoryBegin = () => ({
    type: FETCH_SUB_CATEGORY_START
  });
  
  export const fetchSubCategorySuccess = data => ({
    type: FETCH_SUB_CATEGORY_SUCCESS,
    payload: { data }
  });
  
  export const fetchSubCategoryFailure = error => ({
    type: FETCH_SUB_CATEGORY_FAILURE,
    payload: { error }
  });

// Master Category
  export const fetchAllMasterCategoryBegin = () => ({
    type: FETCH_MASTER_CATEGORY_START
  });
  
  export const fetchAllMasterCategorySuccess = data => ({
    type: FETCH_MASTER_CATEGORY_SUCCESS,
    payload: { data }
  });
  
  export const fetchAllMasterCategoryFailure = error => ({
    type: FETCH_MASTER_CATEGORY_FAILURE,
    payload: { error }
  });  

// brand and template
  export const fetchBrandTemplateBegin = () => ({
    type: FETCH_BRAND_TEMPLATE_START
  });
  
  export const fetchBrandTemplateSuccess = data => ({
    type: FETCH_BRAND_TEMPLATE_SUCCESS,
    payload: { data }
  });
  
  export const fetchBrandTemplateFailure = error => ({
    type: FETCH_BRAND_TEMPLATE_FAILURE,
    payload: { error }
  });


//Upload
export const uploadTemplateImageBegin = () => ({
  type: POST_TEMPLATE_IMAGE_START
});

export const uploadTemplateImageSuccess = data => ({
  type: POST_TEMPLATE_IMAGE_SUCCESS,
  payload: { data }
});

export const uploadTemplateImageFailure = error => ({
  type: POST_TEMPLATE_IMAGE_FAILURE,
  payload: { error }
});

//post Data
export const postSizeMapBegin = () => ({
  type: POST_SIZEMAP_DATA_START
});

export const postSizeMapSuccess = data => ({
  type: POST_SIZEMAP_DATA_SUCCESS,
  payload: { data }
});

export const postSizeMapFailure = error => ({
  type: POST_SIZEMAP_DATA_FAILURE,
  payload: { error }
});