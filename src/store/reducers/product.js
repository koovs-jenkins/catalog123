import {
    FETCH_PRODUCT_DETAILS_START,
    FETCH_PRODUCT_DETAILS_SUCCESS,
    FETCH_PRODUCT_DETAILS_FAILURE,
    POST_PRODUCT_START,
    POST_PRODUCT_SUCCESS,
    POST_PRODUCT_FAILURE,
    PUT_PRODUCT_START,
    PUT_PRODUCT_SUCCESS,
    PUT_PRODUCT_FAILURE,
    FETCH_ALL_PRODUCTS_START,
    FETCH_ALL_PRODUCTS_SUCCESS,
    FETCH_ALL_PRODUCTS_FAILURE,
    PATCH_PRODUCT_START,
    PATCH_PRODUCT_SUCCESS,
    PATCH_PRODUCT_FAILURE,
    FETCH_ALL_METADATA_START,
    FETCH_ALL_METADATA_SUCCESS,
    FETCH_ALL_METADATA_FAILURE,
    BATCH_PRODUCT_START,
    BATCH_PRODUCT_SUCCESS,
    BATCH_PRODUCT_FAILURE,
    POST_PRODUCT_LIVE_START,
    POST_PRODUCT_LIVE_SUCCESS,
    POST_PRODUCT_LIVE_FAILURE,
    BATCH_SERVICABLE_PINCODE_PRODUCT_SUCCESS,
    BATCH_SERVICABLE_PINCODE_PRODUCT_FAILURE,
    BATCH_SERVICABLE_PINCODE_PRODUCT_START,
    BATCH_PINCODE_PRODUCT_SUCCESS,
    BATCH_PINCODE_PRODUCT_FAILURE
  } from "../actions/actionTypes";
  
  
  const product = (state = { data: [], loading: false, error: null, metadata : [], batch_success : [], batch_error : null }, action) => {
    switch (action.type) {
      case FETCH_PRODUCT_DETAILS_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_PRODUCT_DETAILS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_PRODUCT_DETAILS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case POST_PRODUCT_START:
        return {
          ...state,
          loading: true,
          error : null
        };
      case POST_PRODUCT_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false
        };
      case POST_PRODUCT_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case POST_PRODUCT_LIVE_START:
        return {
          ...state,
          loading: true,
          error : null
        };
      case POST_PRODUCT_LIVE_SUCCESS:
        return {
          ...state,
          data: action.payload,
          loading: false
        };
      case POST_PRODUCT_LIVE_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case PUT_PRODUCT_START:
        return {
          ...state,
          loading: true,
          error : null,
        };
      case PUT_PRODUCT_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false
        };
      case PUT_PRODUCT_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case FETCH_ALL_PRODUCTS_START:
        return {
          ...state,
          loading: true,
          error: null
        };
      case FETCH_ALL_PRODUCTS_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_ALL_PRODUCTS_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      
      case PATCH_PRODUCT_START:
        return {
          ...state,
          loading: true
        };
      case PATCH_PRODUCT_SUCCESS:
        return {
          ...state,
          loading: false
        };
      case PATCH_PRODUCT_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };


      case FETCH_ALL_METADATA_START:
        return {
          ...state,
          loading: true,
          batch_error : null,
          error : null
        };
      case FETCH_ALL_METADATA_SUCCESS:
        return {
          ...state,
          metadata: action.payload.data,
          loading: false
        };
      case FETCH_ALL_METADATA_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
        case BATCH_PRODUCT_START:
        return {
          ...state,
          loading: true,
          batch_error : null
        };
      case BATCH_PRODUCT_SUCCESS:
        return {
          ...state,
          batch_success: action.payload,
          loading: false
        };
      case BATCH_PRODUCT_FAILURE:
        return {
          ...state,
          batch_error: action.payload,
          loading: false
        };
      case BATCH_PRODUCT_SUCCESS:
        return {
          ...state,
          batch_success: action.payload,
          loading: false
        };
      case BATCH_PRODUCT_FAILURE:
        return {
          ...state,
          batch_error: action.payload,
          loading: false
        };


        case BATCH_SERVICABLE_PINCODE_PRODUCT_START:
          return {
            ...state,
            loading: true,
            batch_error : null
          };
        case BATCH_SERVICABLE_PINCODE_PRODUCT_SUCCESS:
          return {
            ...state,
            batch_success: action.payload,
            loading: false,
            batch_error:null,
          };
        case BATCH_SERVICABLE_PINCODE_PRODUCT_FAILURE:
          return {
            ...state,
            batch_success:null,
            batch_error: action.payload,
            loading: false
          };
        case BATCH_PINCODE_PRODUCT_SUCCESS:
          return {
            ...state,
            batch_success: action.payload,
            loading: false,
            batch_error:null
          };
        case BATCH_PINCODE_PRODUCT_FAILURE:
          return {
            ...state,
            batch_success:null,
            batch_error: action.payload,
            loading: false
          };

      default:
        return state;
    }
  };
  export default product;
  