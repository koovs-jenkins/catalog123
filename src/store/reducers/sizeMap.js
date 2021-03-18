import {
  FETCH_MASTER_CATEGORY_FAILURE,
  FETCH_MASTER_CATEGORY_START,
  FETCH_MASTER_CATEGORY_SUCCESS,
  FETCH_SUB_CATEGORY_FAILURE,
  FETCH_SUB_CATEGORY_START,
  FETCH_SUB_CATEGORY_SUCCESS,
  FETCH_BRAND_TEMPLATE_FAILURE,
  FETCH_BRAND_TEMPLATE_START,
  FETCH_BRAND_TEMPLATE_SUCCESS,
  POST_TEMPLATE_IMAGE_FAILURE,
  POST_TEMPLATE_IMAGE_START,
  POST_TEMPLATE_IMAGE_SUCCESS,
  POST_SIZEMAP_DATA_FAILURE,
  POST_SIZEMAP_DATA_START,
  POST_SIZEMAP_DATA_SUCCESS
} from "../../store/actions/actionTypes";

const initialState = {
  masterCategory: {
    data: {},
    error: null,
    loading: false
  },
  subCategory: {
    data: {},
    error: null,
    loading: false
  },
  brand: {
    data: {},
    error: null,
    loading: false
  },
  uploadImage: {
    data: {},
    error: null,
    loading: false
  },
  postData:{
    data: {},
    error: null,
    loading: false
  }
};

const sizeMap = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MASTER_CATEGORY_START:
      return {
        ...state,
        masterCategory: {
          ...state.masterCategory,
          loading: true
        }
      };
    case FETCH_MASTER_CATEGORY_SUCCESS:
      return {
        ...state,
        masterCategory: {
          ...state.masterCategory,
          data: action.payload.data.response,
          loading: false
        }
      };
    case FETCH_MASTER_CATEGORY_FAILURE:
      return {
        ...state,
        masterCategory: {
          error: action.payload,
          loading: false
        }
      };
      case FETCH_SUB_CATEGORY_START:
      return {
        ...state,
        subCategory: {
          ...state.subCategory,
          loading: true
        }
      };
    case FETCH_SUB_CATEGORY_SUCCESS:
      return {
        ...state,
        subCategory: {
          ...state.subCategory,
          data: action.payload.data.response,
          loading: false
        }
      };
    case FETCH_SUB_CATEGORY_FAILURE:
      return {
        ...state,
        subCategory: {
          error: action.payload,
          loading: false
        }
      };
      case FETCH_BRAND_TEMPLATE_START:
      return {
        ...state,
        brand: {
          ...state.brand,
          loading: true
        }
      };
    case FETCH_BRAND_TEMPLATE_SUCCESS:
      return {
        ...state,
        brand: {
          ...state.brand,
          data: action.payload.data.response,
          loading: false
        }
      };
    case FETCH_BRAND_TEMPLATE_FAILURE:
      return {
        ...state,
        brand: {
          error: action.payload,
          loading: false
        }
      };
    case POST_TEMPLATE_IMAGE_START:
      return {
        ...state,
        uploadImage: {
          ...state.uploadImage,
          loading: true
        }
      };
    case POST_TEMPLATE_IMAGE_SUCCESS:
      return {
        ...state,
        uploadImage: {
          ...state.uploadImage,
          data: action.payload.data.data,
          loading: false
        }
      };
    case POST_TEMPLATE_IMAGE_FAILURE:
      return {
        ...state,
        uploadImage: {
          error: action.payload,
          loading: false
        }
      };
      case POST_SIZEMAP_DATA_START:
      return {
        ...state,
        postData: {
          ...state.postData,
          loading: true
        }
      };
    case POST_SIZEMAP_DATA_SUCCESS:
      return {
        ...state,
        postData: {
          ...state.postData,
          data: action.payload,
          loading: false
        }
      };
    case POST_SIZEMAP_DATA_FAILURE:
      return {
        ...state,
        postData: {
          error: action.payload,
          loading: false
        }
      };
    default:
      return state;
  }
}

export default sizeMap;
