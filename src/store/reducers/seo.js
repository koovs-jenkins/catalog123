import {
    FETCH_SEO_DETAILS_START,
    FETCH_SEO_DETAILS_SUCCESS,
    FETCH_SEO_DETAILS_FAILURE,
    POST_SEO_START,
    POST_SEO_SUCCESS,
    POST_SEO_FAILURE,
    PUT_SEO_START,
    PUT_SEO_SUCCESS,
    PUT_SEO_FAILURE,
    FETCH_ALL_SEOS_START,
    FETCH_ALL_SEOS_SUCCESS,
    FETCH_ALL_SEOS_FAILURE,
    PATCH_SEO_START,
    PATCH_SEO_SUCCESS,
    PATCH_SEO_FAILURE,
  } from "../actions/actionTypes";


  const Seo = (state = { data: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case FETCH_SEO_DETAILS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_SEO_DETAILS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_SEO_DETAILS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      case POST_SEO_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case POST_SEO_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false,
        };
      case POST_SEO_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case PUT_SEO_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case PUT_SEO_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false
        };
      case PUT_SEO_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case FETCH_ALL_SEOS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ALL_SEOS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_ALL_SEOS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };

      case PATCH_SEO_START:
        return {
          ...state,
          loading: true
        };
      case PATCH_SEO_SUCCESS:
        return {
          ...state,
          loading: false
        };
      case PATCH_SEO_FAILURE:
        return {
          ...state,
          error: action.payload
        };

      default:
        return state;
    }
  };
  export default Seo;