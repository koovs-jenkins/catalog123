import {
    FETCH_ATTRIBUTETYPE_DETAILS_START,
    FETCH_ATTRIBUTETYPE_DETAILS_SUCCESS,
    FETCH_ATTRIBUTETYPE_DETAILS_FAILURE,
    POST_ATTRIBUTETYPE_START,
    POST_ATTRIBUTETYPE_SUCCESS,
    POST_ATTRIBUTETYPE_FAILURE,
    PUT_ATTRIBUTETYPE_START,
    PUT_ATTRIBUTETYPE_SUCCESS,
    PUT_ATTRIBUTETYPE_FAILURE,
    FETCH_ALL_ATTRIBUTETYPES_START,
    FETCH_ALL_ATTRIBUTETYPES_SUCCESS,
    FETCH_ALL_ATTRIBUTETYPES_FAILURE,
    PATCH_ATTRIBUTETYPE_START,
    PATCH_ATTRIBUTETYPE_SUCCESS,
    PATCH_ATTRIBUTETYPE_FAILURE,
    FETCH_ALL_ENUM_START,
    FETCH_ALL_ENUM_SUCCESS,
    FETCH_ALL_ENUM_FAILURE,
  } from "../actions/actionTypes";
  
  
  const attributetype = (state = { data: [], loading: false, error: null, enum :[] }, action) => {
    switch (action.type) {
      case FETCH_ATTRIBUTETYPE_DETAILS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ATTRIBUTETYPE_DETAILS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_ATTRIBUTETYPE_DETAILS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading : false,
        };
      case POST_ATTRIBUTETYPE_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case POST_ATTRIBUTETYPE_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false
        };
      case POST_ATTRIBUTETYPE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case PUT_ATTRIBUTETYPE_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case PUT_ATTRIBUTETYPE_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false
        };
      case PUT_ATTRIBUTETYPE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case FETCH_ALL_ATTRIBUTETYPES_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ALL_ATTRIBUTETYPES_SUCCESS:
        return {
          ...state,
          loading: false,
          error : null,
          data: action.payload.data,
        };
      case FETCH_ALL_ATTRIBUTETYPES_FAILURE:
        return {
          ...state,
          loading : false,
          error: action.payload
        };

      case FETCH_ALL_ENUM_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ALL_ENUM_SUCCESS:
        return {
          ...state,
          enum: action.payload.data,
          loading: false
        };
      case FETCH_ALL_ENUM_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading : false,
        };
      
      case PATCH_ATTRIBUTETYPE_START:
        return {
          ...state,
          loading: true
        };
      case PATCH_ATTRIBUTETYPE_SUCCESS:
        return {
          ...state,
          loading: false
        };
      case PATCH_ATTRIBUTETYPE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading :  false ,
        };

      default:
        return state;
    }
  };
  export default attributetype;
  