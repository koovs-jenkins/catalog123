import {
    FETCH_USER_PROMO_DETAILS_START,
    FETCH_USER_PROMO_DETAILS_SUCCESS,
    FETCH_USER_PROMO_DETAILS_FAILURE,
    POST_USER_PROMO_START,
    POST_USER_PROMO_SUCCESS,
    POST_USER_PROMO_FAILURE,
    POST_MULTIUSER_PROMO_START,
    POST_MULTIUSER_PROMO_SUCCESS,
    POST_MULTIUSER_PROMO_FAILURE,
    PUT_USER_PROMO_START,
    PUT_USER_PROMO_SUCCESS,
    PUT_USER_PROMO_FAILURE,
    FETCH_ALL_USER_PROMO_START,
    FETCH_ALL_USER_PROMO_SUCCESS,
    FETCH_ALL_USER_PROMO_FAILURE,
    PATCH_USER_PROMO_START,
    PATCH_USER_PROMO_SUCCESS,
    PATCH_USER_PROMO_FAILURE,
  } from "../actions/actionTypes";
  
  
  const userpromo = (state = { data: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case FETCH_USER_PROMO_DETAILS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_USER_PROMO_DETAILS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_USER_PROMO_DETAILS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      case POST_USER_PROMO_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case POST_USER_PROMO_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false,
        };
      case POST_USER_PROMO_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case POST_MULTIUSER_PROMO_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case POST_MULTIUSER_PROMO_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false,
        };
      case POST_MULTIUSER_PROMO_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case PUT_USER_PROMO_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case PUT_USER_PROMO_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false
        };
      case PUT_USER_PROMO_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case FETCH_ALL_USER_PROMO_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ALL_USER_PROMO_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_ALL_USER_PROMO_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      
      case PATCH_USER_PROMO_START:
        return {
          ...state,
          loading: true
        };
      case PATCH_USER_PROMO_SUCCESS:
        return {
          ...state,
          loading: false
        };
      case PATCH_USER_PROMO_FAILURE:
        return {
          ...state,
          error: action.payload
        };

      default:
        return state;
    }
  };
  export default userpromo;
  