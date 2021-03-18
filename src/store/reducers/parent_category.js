import {
    FETCH_PCAT_DETAILS_START,
    FETCH_PCAT_DETAILS_SUCCESS,
    FETCH_PCAT_DETAILS_FAILURE,
    POST_PCAT_START,
    POST_PCAT_SUCCESS,
    POST_PCAT_FAILURE,
    PUT_PCAT_START,
    PUT_PCAT_SUCCESS,
    PUT_PCAT_FAILURE,
    FETCH_ALL_PCATS_START,
    FETCH_ALL_PCATS_SUCCESS,
    FETCH_ALL_PCATS_FAILURE,
    PATCH_PCAT_START,
    PATCH_PCAT_SUCCESS,
    PATCH_PCAT_FAILURE,
  } from "../actions/actionTypes";
  
  
  const pcategory = (state = { data: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case FETCH_PCAT_DETAILS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_PCAT_DETAILS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_PCAT_DETAILS_FAILURE:
        return {
          ...state,
          error: action.payload
        };
      case POST_PCAT_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case POST_PCAT_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false
        };
      case POST_PCAT_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case PUT_PCAT_START:
        return {
          ...state,
          loading: true
        };
      case PUT_PCAT_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false
        };
      case PUT_PCAT_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case FETCH_ALL_PCATS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ALL_PCATS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_ALL_PCATS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      
      case PATCH_PCAT_START:
        return {
          ...state,
          loading: true
        };
      case PATCH_PCAT_SUCCESS:
        return {
          ...state,
          loading: false
        };
      case PATCH_PCAT_FAILURE:
        return {
          ...state,
          error: action.payload
        };

      default:
        return state;
    }
  };
  export default pcategory;
  