import {
  FETCH_TAGS_START,
  FETCH_TAGS_SUCCESS,
  FETCH_TAGS_FAILURE,
  POST_TAG_START,
  POST_TAG_SUCCESS,
  POST_TAG_FAILURE,
  FETCH_TAG_BY_NAME_START,
  FETCH_TAG_BY_NAME_SUCCESS,
  FETCH_TAG_BY_NAME_FAILURE,
  POST_CSV_START,
  POST_CSV_SUCCESS,
  POST_CSV_FAILURE,
  POST_SKU_CSV_START,
  POST_SKU_CSV_SUCCESS,
  POST_SKU_CSV_FAILURE,
  PATCH_TAG_START,
  PATCH_TAG_SUCCESS,
  PATCH_TAG_FAILURE,
  FETCH_FILE_STATUS_START,
  FETCH_FILE_STATUS_SUCCESS,
  FETCH_FILE_STATUS_FAILURE,
  FETCH_TAG_MAPS_START,
  FETCH_TAG_MAPS_SUCCESS,
  FETCH_TAG_MAPS_FAILURE,
  PUT_TAG_START,
  PUT_TAG_SUCCESS,
  PUT_TAG_FAILURE
} from "../actions/actionTypes";

const tagging = (
  state = {
    data: {},
    response: "",
    tagData: {},
    loading: false,
    error: null,
    csv: {},
    tagMaps: {}
  },
  action
) => {
  switch (action.type) {
    case FETCH_TAGS_START:
      return {
        ...state,
        loading: true,
        error: null,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    case FETCH_TAGS_SUCCESS:
      return {
        ...state,
        data: !action.payload.data.errorExists
          ? action.payload.data
          : {},
        loading: false,
        error: null,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    case FETCH_TAGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    case POST_TAG_START:
      return {
        ...state,
        loading: true,
        error: null,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    case POST_TAG_SUCCESS:
      return {
        ...state,
        response:
          !action.payload.data.errorExists && action.payload.data.response,
        error: action.payload.data.errorExists && action.payload.data.reason,
        loading: false,
        tagData: {},
        tagMaps: {}
      };
    case POST_TAG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    case FETCH_TAG_BY_NAME_START:
      return {
        ...state,
        loading: true,
        error: null,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    case FETCH_TAG_BY_NAME_SUCCESS:
      return {
        ...state,
        tagData:
          !action.payload.data.errorExists && action.payload.data.response,
        loading: false,
        error: null,
        response: "",
        tagMaps: {}
      };
    case FETCH_TAG_BY_NAME_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    case POST_CSV_START:
      return {
        ...state,
        loading: true,
        error: null,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    case POST_CSV_SUCCESS:
      return {
        ...state,
        loading: false,
        tagData: {},
        csv: action.payload,
        response: ""
      };
    case POST_CSV_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        tagData: {},
        response: "",
        tagMaps: {}
      };
      case POST_SKU_CSV_START:
        return {
          ...state,
          loading: true,
          error: null,
          tagData: {},
          response: "",
          tagMaps: {}
        };
      case POST_SKU_CSV_SUCCESS:
        return {
          ...state,
          loading: false,
          tagData: {},
          csv: action.payload,
          response: ""
        };
      case POST_SKU_CSV_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
          tagData: {},
          response: "",
          tagMaps: {}
        };
    case PATCH_TAG_START:
      return {
        ...state,
        loading: true,
        error: null,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    case PATCH_TAG_SUCCESS:
      return {
        ...state,
        loading: false,
        tagData: {},
        response: action.payload,
        tagMaps: {}
      };
    case PATCH_TAG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    case FETCH_FILE_STATUS_START:
      return {
        ...state,
        loading: true,
        error: null,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    case FETCH_FILE_STATUS_SUCCESS:
      return {
        ...state,
        csv: action.payload,
        loading: false,
        error: null,
        response: "",
        tagMaps: {}
      };
    case FETCH_FILE_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    case FETCH_TAG_MAPS_START:
      return {
        ...state,
        loading: true,
        tagMaps: {}
      };
    case FETCH_TAG_MAPS_SUCCESS:
      return {
        ...state,
        tagMaps:
          action.payload.status == 200 ? action.payload.data : {},
        loading: false
      };
    case FETCH_TAG_MAPS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        tagMaps: {}
      };
    case PUT_TAG_START:
      return {
        ...state,
        loading: true,
        error: null,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    case PUT_TAG_SUCCESS:
      return {
        ...state,
        response:
          !action.payload.data.errorExists && action.payload.data.response,
        error: action.payload.data.errorExists && action.payload.data.reason,
        loading: false,
        tagData: {},
        tagMaps: {}
      };
    case PUT_TAG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        tagData: {},
        response: "",
        tagMaps: {}
      };
    default:
      return state;
  }
};
export default tagging;
