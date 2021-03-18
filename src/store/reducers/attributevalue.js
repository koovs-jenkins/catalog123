import {
    FETCH_ATTRIBUTEVALUE_DETAILS_START,
    FETCH_ATTRIBUTEVALUE_DETAILS_SUCCESS,
    FETCH_ATTRIBUTEVALUE_DETAILS_FAILURE,
    POST_ATTRIBUTEVALUE_START,
    POST_ATTRIBUTEVALUE_SUCCESS,
    POST_ATTRIBUTEVALUE_FAILURE,
    PUT_ATTRIBUTEVALUE_START,
    PUT_ATTRIBUTEVALUE_SUCCESS,
    PUT_ATTRIBUTEVALUE_FAILURE,
    FETCH_ALL_ATTRIBUTEVALUES_START,
    FETCH_ALL_ATTRIBUTEVALUES_SUCCESS,
    FETCH_ALL_ATTRIBUTEVALUES_FAILURE,
    PATCH_ATTRIBUTEVALUE_START,
    PATCH_ATTRIBUTEVALUE_SUCCESS,
    PATCH_ATTRIBUTEVALUE_FAILURE,
  } from "../actions/actionTypes";
  
  
  const attributevalue = (state = { data: [], loading: false, error: null}, action) => {
    switch (action.type) {
      case FETCH_ATTRIBUTEVALUE_DETAILS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ATTRIBUTEVALUE_DETAILS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_ATTRIBUTEVALUE_DETAILS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading : false,
        };
      case POST_ATTRIBUTEVALUE_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case POST_ATTRIBUTEVALUE_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false
        };
      case POST_ATTRIBUTEVALUE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case PUT_ATTRIBUTEVALUE_START:
        return {
          ...state,
          loading: true,
          error : null
        };
      case PUT_ATTRIBUTEVALUE_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false
        };
      case PUT_ATTRIBUTEVALUE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case FETCH_ALL_ATTRIBUTEVALUES_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ALL_ATTRIBUTEVALUES_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_ALL_ATTRIBUTEVALUES_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      case PATCH_ATTRIBUTEVALUE_START:
        return {
          ...state,
          loading: true
        };
      case PATCH_ATTRIBUTEVALUE_SUCCESS:
        return {
          ...state,
          loading: false
        };
      case PATCH_ATTRIBUTEVALUE_FAILURE:
        return {
          ...state,
          error: action.payload
        };

      default:
        return state;
    }
  };
  export default attributevalue;
  