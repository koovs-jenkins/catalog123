import {
    FETCH_GENERIC_PROMO_DETAILS_START,
    FETCH_GENERIC_PROMO_DETAILS_SUCCESS,
    FETCH_GENERIC_PROMO_DETAILS_FAILURE,
    POST_GENERIC_PROMO_START,
    POST_GENERIC_PROMO_SUCCESS,
    POST_GENERIC_PROMO_FAILURE,
    PUT_GENERIC_PROMO_START,
    PUT_GENERIC_PROMO_SUCCESS,
    PUT_GENERIC_PROMO_FAILURE,
    FETCH_ALL_GENERIC_PROMO_START,
    FETCH_ALL_GENERIC_PROMO_SUCCESS,
    FETCH_ALL_GENERIC_PROMO_FAILURE,
    PATCH_GENERIC_PROMO_START,
    PATCH_GENERIC_PROMO_SUCCESS,
    PATCH_GENERIC_PROMO_FAILURE,
  } from "../actions/actionTypes";
  
  
  const genericpromo = (state = { data: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case FETCH_GENERIC_PROMO_DETAILS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_GENERIC_PROMO_DETAILS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_GENERIC_PROMO_DETAILS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      case POST_GENERIC_PROMO_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case POST_GENERIC_PROMO_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false,
        };
      case POST_GENERIC_PROMO_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case PUT_GENERIC_PROMO_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case PUT_GENERIC_PROMO_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false
        };
      case PUT_GENERIC_PROMO_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case FETCH_ALL_GENERIC_PROMO_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ALL_GENERIC_PROMO_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_ALL_GENERIC_PROMO_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      
      case PATCH_GENERIC_PROMO_START:
        return {
          ...state,
          loading: true
        };
      case PATCH_GENERIC_PROMO_SUCCESS:
        return {
          ...state,
          loading: false
        };
      case PATCH_GENERIC_PROMO_FAILURE:
        return {
          ...state,
          error: action.payload
        };

      default:
        return state;
    }
  };
  export default genericpromo;
  