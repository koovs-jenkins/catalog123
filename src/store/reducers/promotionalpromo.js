import {
    FETCH_PROMOTIONAL_PROMO_DETAILS_START,
    FETCH_PROMOTIONAL_PROMO_DETAILS_SUCCESS,
    FETCH_PROMOTIONAL_PROMO_DETAILS_FAILURE,
    POST_PROMOTIONAL_PROMO_START,
    POST_PROMOTIONAL_PROMO_SUCCESS,
    POST_PROMOTIONAL_PROMO_FAILURE,
    PUT_PROMOTIONAL_PROMO_START,
    PUT_PROMOTIONAL_PROMO_SUCCESS,
    PUT_PROMOTIONAL_PROMO_FAILURE,
    FETCH_ALL_PROMOTIONAL_PROMO_START,
    FETCH_ALL_PROMOTIONAL_PROMO_SUCCESS,
    FETCH_ALL_PROMOTIONAL_PROMO_FAILURE,
    PATCH_PROMOTIONAL_PROMO_START,
    PATCH_PROMOTIONAL_PROMO_SUCCESS,
    PATCH_PROMOTIONAL_PROMO_FAILURE,
  } from "../actions/actionTypes";
  
  
  const promotionalpromo = (state = { data: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case FETCH_PROMOTIONAL_PROMO_DETAILS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_PROMOTIONAL_PROMO_DETAILS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_PROMOTIONAL_PROMO_DETAILS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      case POST_PROMOTIONAL_PROMO_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case POST_PROMOTIONAL_PROMO_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false,
        };
      case POST_PROMOTIONAL_PROMO_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case PUT_PROMOTIONAL_PROMO_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case PUT_PROMOTIONAL_PROMO_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false
        };
      case PUT_PROMOTIONAL_PROMO_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case FETCH_ALL_PROMOTIONAL_PROMO_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ALL_PROMOTIONAL_PROMO_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_ALL_PROMOTIONAL_PROMO_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      
      case PATCH_PROMOTIONAL_PROMO_START:
        return {
          ...state,
          loading: true
        };
      case PATCH_PROMOTIONAL_PROMO_SUCCESS:
        return {
          ...state,
          loading: false
        };
      case PATCH_PROMOTIONAL_PROMO_FAILURE:
        return {
          ...state,
          error: action.payload
        };

      default:
        return state;
    }
  };
  export default promotionalpromo;
  