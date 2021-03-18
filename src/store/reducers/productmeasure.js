import {
    FETCH_PRODUCT_MEASURE_START,
    FETCH_PRODUCT_MEASURE_SUCCESS,
    FETCH_PRODUCT_MEASURE_FAILURE,
    POST_PRODUCT_MEASURE_START,
    POST_PRODUCT_MEASURE_SUCCESS,
    POST_PRODUCT_MEASURE_FAILURE,
    REMOVE_ERROR_MEASURE
  } from "../actions/actionTypes";
  
  
  const productmeasure = (state = { data: [], loading: false, error: null , product_measurment : {}}, action) => {
    switch (action.type) {
      case FETCH_PRODUCT_MEASURE_START:
        return {
          ...state,
          loading: true,
        };
      case FETCH_PRODUCT_MEASURE_SUCCESS:
        return {
          ...state,
          product_measurment: action.payload,
          loading: false,
          error : null
        };
      case FETCH_PRODUCT_MEASURE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case POST_PRODUCT_MEASURE_START:
        return {
          ...state,
          loading: true
        };
      case POST_PRODUCT_MEASURE_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false
        };
      case POST_PRODUCT_MEASURE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
        case REMOVE_ERROR_MEASURE:
        return {
          ...state,
          error: null,
          loading: false
        };
      default:
        return state;
    }
  };
  export default productmeasure;
  