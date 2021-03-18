import {
    FETCH_PRODUCT_IMAGE_START,
    FETCH_PRODUCT_IMAGE_SUCCESS,
    FETCH_PRODUCT_IMAGE_FAILURE,
    FETCH_LINE_IMAGE_START,
    FETCH_LINE_IMAGE_SUCCESS,
    FETCH_LINE_IMAGE_FAILURE,
    POST_PRODUCT_IMAGE_START,
    POST_PRODUCT_IMAGE_SUCCESS,
    POST_PRODUCT_IMAGE_FAILURE,
    UPLOAD_PRODUCT_IMAGE_START,
    UPLOAD_PRODUCT_IMAGE_SUCCESS,
    UPLOAD_PRODUCT_IMAGE_FAILURE,
    REMOVE_ERROR
  } from "../actions/actionTypes";
  
  
  const product = (state = { data: [], loading: false, error: null , product_images : {}, image_object : {}}, action) => {
    switch (action.type) {
      case FETCH_PRODUCT_IMAGE_START:
        return {
          ...state,
          loading: true,
          
        };
      case FETCH_PRODUCT_IMAGE_SUCCESS:
        return {
          ...state,
          product_images: action.payload,
          loading: false,
          error : null
        };
      case FETCH_PRODUCT_IMAGE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case FETCH_LINE_IMAGE_START:
        return {
          ...state,
          loading: true,
          
        };
      case FETCH_LINE_IMAGE_SUCCESS:
        return {
          ...state,
          product_images: action.payload,
          loading: false,
          error : null
        };
      case FETCH_LINE_IMAGE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case POST_PRODUCT_IMAGE_START:
        return {
          ...state,
          loading: true
        };
      case POST_PRODUCT_IMAGE_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false
        };
      case POST_PRODUCT_IMAGE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case UPLOAD_PRODUCT_IMAGE_START:
        return {
          ...state,
          loading: true
        };
      case UPLOAD_PRODUCT_IMAGE_SUCCESS:
        return {
          ...state,
          image_object: action.payload,
          loading: false
        };
      case UPLOAD_PRODUCT_IMAGE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
        case REMOVE_ERROR:
        return {
          ...state,
          error: null,
          loading: false
        };
      default:
        return state;
    }
  };
  export default product;
  