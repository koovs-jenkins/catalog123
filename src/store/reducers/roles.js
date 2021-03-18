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

    FETCH_ALL_ROLES_START,
    FETCH_ALL_ROLES_SUCCESS,
    FETCH_ALL_ROLES_FAILURE,
  } from "../actions/actionTypes";


  const roles = (state = { data: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case FETCH_ALL_ROLES_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ALL_ROLES_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_ALL_ROLES_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };

      default:
        return state;
    }
  };
  export default roles;
