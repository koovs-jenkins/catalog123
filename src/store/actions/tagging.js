import {
  FETCH_TAGS_START,
  FETCH_TAGS_SUCCESS,
  FETCH_TAGS_FAILURE,
  POST_TAG_START,
  POST_TAG_SUCCESS,
  POST_TAG_FAILURE,
  FETCH_TAG_BY_NAME_START,
  FETCH_TAG_BY_NAME_SUCCESS,
  FETCH_TAG_BY_NAME_FAILURE,
  POST_CSV_START,
  POST_CSV_SUCCESS,
  POST_CSV_FAILURE,
  POST_SKU_CSV_START,
  POST_SKU_CSV_SUCCESS,
  POST_SKU_CSV_FAILURE,
  PATCH_TAG_START,
  PATCH_TAG_SUCCESS,
  PATCH_TAG_FAILURE,
  FETCH_FILE_STATUS_START,
  FETCH_FILE_STATUS_SUCCESS,
  FETCH_FILE_STATUS_FAILURE,
  FETCH_TAG_MAPS_START,
  FETCH_TAG_MAPS_SUCCESS,
  FETCH_TAG_MAPS_FAILURE,
  PUT_TAG_START,
  PUT_TAG_SUCCESS,
  PUT_TAG_FAILURE
} from "./actionTypes";
import {
  fetchAllTagsApi,
  postTagApi,
  fetchTagByNameApi,
  postCsvApi,
  postSkuCsvApi,
  patchTagApi,
  fetchFileStatusApi,
  fetchTagMapsApi,
  putTagApi
} from "../../api/tagging";

export function fetchAllTags(pageNumber, search, status, pageSize) {
  return dispatch => {
    dispatch(fetchTagsBegin());
    return fetchAllTagsApi(pageNumber, search, status, pageSize)
      .then(json => {
        dispatch(fetchTagsSuccess(json));
      })
      .catch(error => dispatch(fetchTagsFailure(error)));
  };
}

export const fetchTagsBegin = () => ({
  type: FETCH_TAGS_START
});

export const fetchTagsSuccess = data => ({
  type: FETCH_TAGS_SUCCESS,
  payload: data
});

export const fetchTagsFailure = error => ({
  type: FETCH_TAGS_FAILURE,
  payload: error
});

export function postTagData(data) {
  return dispatch => {
    dispatch(postTagBegin());
    return postTagApi(data)
      .then(json => {
        dispatch(postTagSuccess(json));
      })
      .catch(error => dispatch(postTagFailure(error)));
  };
}

export const postTagBegin = () => ({
  type: POST_TAG_START
});

export const postTagSuccess = data => ({
  type: POST_TAG_SUCCESS,
  payload: data
});

export const postTagFailure = error => ({
  type: POST_TAG_FAILURE,
  payload: error
});



export function putTagData(data) {
  return dispatch => {
    dispatch(putTagBegin());
    return putTagApi(data)
      .then(json => {
        dispatch(putTagSuccess(json));
      })
      .catch(error => dispatch(putTagFailure(error)));
  };
}

export const putTagBegin = () => ({
  type: PUT_TAG_START
});

export const putTagSuccess = data => ({
  type: PUT_TAG_SUCCESS,
  payload: data
});

export const putTagFailure = error => ({
  type: PUT_TAG_FAILURE,
  payload: error
});

export function getTagDataByTagName(tagname) {
  return dispatch => {
    dispatch(fetchTagByNameBegin());
    return fetchTagByNameApi(tagname)
      .then(json => {
        dispatch(fetchTagByNameSuccess(json));
      })
      .catch(error => dispatch(fetchTagByNameFailure(error)));
  };
}

export const fetchTagByNameBegin = () => ({
  type: FETCH_TAG_BY_NAME_START
});

export const fetchTagByNameSuccess = data => ({
  type: FETCH_TAG_BY_NAME_SUCCESS,
  payload: data
});

export const fetchTagByNameFailure = error => ({
  type: FETCH_TAG_BY_NAME_FAILURE,
  payload: error
});

export function postCsvData(userId, data, isRemove) {
  return dispatch => {
    dispatch(postCsvBegin());
    return postCsvApi(userId, data, isRemove)
      .then(json => {
        dispatch(postCsvSuccess(json));
        setTimeout(() => {
          dispatch(postCsvBegin());
        }, 5000);
      })
      .catch(error => dispatch(postCsvFailure(error)));
  };
}

export const postCsvBegin = () => ({
  type: POST_CSV_START
});

export const postCsvSuccess = data => ({
  type: POST_CSV_SUCCESS,
  payload: data
});

export const postCsvFailure = error => ({
  type: POST_CSV_FAILURE,
  payload: error
});

export function postSkuCsvData(userId, data, isRemove) {
  return dispatch => {
    dispatch(postSkuCsvBegin());
    return postSkuCsvApi(userId, data, isRemove)
      .then(json => {
        dispatch(postSkuCsvSuccess(json));
        setTimeout(() => {
          dispatch(postSkuCsvBegin());
        }, 5000);
      })
      .catch(error => dispatch(postSkuCsvFailure(error)));
  };
}

export const postSkuCsvBegin = () => ({
  type: POST_SKU_CSV_START
});

export const postSkuCsvSuccess = data => ({
  type: POST_SKU_CSV_SUCCESS,
  payload: data
});

export const postSkuCsvFailure = error => ({
  type: POST_SKU_CSV_FAILURE,
  payload: error
});


export function patchTag(tagname, status, userId) {
  return dispatch => {
    dispatch(patchTagBegin());
    return patchTagApi(tagname, status, userId)
      .then(json => {
        !json.data.errorExists && dispatch(patchTagSuccess(json.data.response));
        setTimeout(() => {
          dispatch(patchTagBegin());
        }, 5000);
      })
      .catch(error => dispatch(patchTagFailure(error)));
  };
}

export const patchTagBegin = () => ({
  type: PATCH_TAG_START
});

export const patchTagSuccess = data => ({
  type: PATCH_TAG_SUCCESS,
  payload: data
});

export const patchTagFailure = error => ({
  type: PATCH_TAG_FAILURE,
  payload: error
});

export function fetchFileStatus(fileId) {
  return dispatch => {
    dispatch(fetchFileStatusBegin());
    return fetchFileStatusApi(fileId)
      .then(json => {
        dispatch(fetchFileStatusSuccess(json));
      })
      .catch(error => dispatch(fetchFileStatusFailure(error)));
  };
}

export const fetchFileStatusBegin = () => ({
  type: FETCH_FILE_STATUS_START
});

export const fetchFileStatusSuccess = data => ({
  type: FETCH_FILE_STATUS_SUCCESS,
  payload: data
});

export const fetchFileStatusFailure = error => ({
  type: FETCH_FILE_STATUS_FAILURE,
  payload: error
});

export function fetchTagMaps(tagName, allRecord, activePage, countPerPage) {
  return dispatch => {
    dispatch(fetchTagMapsBegin());
    return fetchTagMapsApi(tagName, allRecord, activePage, countPerPage)
      .then(json => {
        dispatch(fetchTagMapsSuccess(json));
      })
      .catch(error => dispatch(fetchTagMapsFailure(error)));
  };
}

export const fetchTagMapsBegin = () => ({
  type: FETCH_TAG_MAPS_START
});

export const fetchTagMapsSuccess = data => ({
  type: FETCH_TAG_MAPS_SUCCESS,
  payload: data
});

export const fetchTagMapsFailure = error => ({
  type: FETCH_TAG_MAPS_FAILURE,
  payload: error
});
