import {
    FETCH_MEASURE_DETAILS_START,
    FETCH_MEASURE_DETAILS_SUCCESS,
    FETCH_MEASURE_DETAILS_FAILURE,
    POST_MEASURE_START,
    POST_MEASURE_SUCCESS,
    POST_MEASURE_FAILURE,
    PUT_MEASURE_START,
    PUT_MEASURE_SUCCESS,
    PUT_MEASURE_FAILURE,
    FETCH_ALL_MEASURES_START,
    FETCH_ALL_MEASURES_SUCCESS,
    FETCH_ALL_MEASURES_FAILURE,
    PATCH_MEASURE_START,
    PATCH_MEASURE_SUCCESS,
    PATCH_MEASURE_FAILURE,
  } from "../actions/actionTypes";
  
  
  const addmeasurement = (state = { data: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case FETCH_MEASURE_DETAILS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_MEASURE_DETAILS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_MEASURE_DETAILS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      case POST_MEASURE_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case POST_MEASURE_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false,
        };
      case POST_MEASURE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case PUT_MEASURE_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case PUT_MEASURE_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false
        };
      case PUT_MEASURE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case FETCH_ALL_MEASURES_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_ALL_MEASURES_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_ALL_MEASURES_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      
      case PATCH_MEASURE_START:
        return {
          ...state,
          loading: true
        };
      case PATCH_MEASURE_SUCCESS:
        return {
          ...state,
          loading: false
        };
      case PATCH_MEASURE_FAILURE:
        return {
          ...state,
          error: action.payload
        };

      default:
        return state;
    }
  };
  export default addmeasurement;
  