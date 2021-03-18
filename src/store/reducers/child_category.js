import {
    FETCH_CCAT_DETAILS_START,
    FETCH_CCAT_DETAILS_SUCCESS,
    FETCH_CCAT_DETAILS_FAILURE,
    POST_CCAT_START,
    POST_CCAT_SUCCESS,
    POST_CCAT_FAILURE,
    PUT_CCAT_START,
    PUT_CCAT_SUCCESS,
    PUT_CCAT_FAILURE,
    FETCH_ALL_CCATS_START,
    FETCH_ALL_CCATS_SUCCESS,
    FETCH_ALL_CCATS_FAILURE,
    PATCH_CCAT_START,
    PATCH_CCAT_SUCCESS,
    PATCH_CCAT_FAILURE,
  } from "../actions/actionTypes";
  
  
  const ccategory = (state = { data: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case FETCH_CCAT_DETAILS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_CCAT_DETAILS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_CCAT_DETAILS_FAILURE:
        return {
          ...state,
          error: action.payload
        };
      case POST_CCAT_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case POST_CCAT_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false,
          
        };
      case POST_CCAT_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case PUT_CCAT_START:
        return {
          ...state,
          loading: true
        };
      case PUT_CCAT_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false
        };
      case PUT_CCAT_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case FETCH_ALL_CCATS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ALL_CCATS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_ALL_CCATS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      
      case PATCH_CCAT_START:
        return {
          ...state,
          loading: true
        };
      case PATCH_CCAT_SUCCESS:
        return {
          ...state,
          loading: false
        };
      case PATCH_CCAT_FAILURE:
        return {
          ...state,
          error: action.payload
        };

      default:
        return state;
    }
  };
  export default ccategory;
  