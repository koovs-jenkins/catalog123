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
    FETCH_ALL_BRANDS_START,
    FETCH_ALL_BRANDS_SUCCESS,
    FETCH_ALL_BRANDS_FAILURE,
    PATCH_BRAND_START,
    PATCH_BRAND_SUCCESS,
    PATCH_BRAND_FAILURE,
  } from "../actions/actionTypes";
  
  
  const brand = (state = { data: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case FETCH_BRAND_DETAILS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_BRAND_DETAILS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_BRAND_DETAILS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      case POST_BRAND_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case POST_BRAND_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false,
        };
      case POST_BRAND_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case PUT_BRAND_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case PUT_BRAND_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false
        };
      case PUT_BRAND_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case FETCH_ALL_BRANDS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ALL_BRANDS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_ALL_BRANDS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      
      case PATCH_BRAND_START:
        return {
          ...state,
          loading: true
        };
      case PATCH_BRAND_SUCCESS:
        return {
          ...state,
          loading: false
        };
      case PATCH_BRAND_FAILURE:
        return {
          ...state,
          error: action.payload
        };

      default:
        return state;
    }
  };
  export default brand;
  