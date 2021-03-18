import {
  FETCH_ORDER_LIST_START,
  FETCH_ORDER_LIST_SUCCESS,
  FETCH_ORDER_LIST_FAILURE,
  POST_BULK_CSV_START,
  POST_BULK_CSV_SUCCESS,
  POST_BULK_CSV_FAILURE,
  PATCH_CRYPT_ORDER_START,
  PATCH_CRYPT_ORDER_SUCCESS,
  PATCH_CRYPT_ORDER_FAILURE,
  FETCH_TXN_HISTORY_START,
  FETCH_TXN_HISTORY_SUCCESS,
  FETCH_TXN_HISTORY_FAILURE,
  FETCH_PROCESS_REFUND_START,
  FETCH_PROCESS_REFUND_SUCCESS,
  FETCH_PROCESS_REFUND_FAILURE,
  POST_PROCESS_REFUND_START,
  POST_PROCESS_REFUND_SUCCESS,
  POST_PROCESS_REFUND_FAILURE,
  FETCH_ASSIGN_REFUND_OS_START,
  FETCH_ASSIGN_REFUND_OS_SUCCESS,
  FETCH_ASSIGN_REFUND_OS_FAILURE,
  POST_ASSIGN_REFUND_START,
  POST_ASSIGN_REFUND_SUCCESS,
  POST_ASSIGN_REFUND_FAILURE,
  POST_EXCHANGE_REPLACE_START,
  POST_EXCHANGE_REPLACE_SUCCESS,
  POST_EXCHANGE_REPLACE_FAILURE,
  FETCH_AVAILABLE_COURIERS_START,
  FETCH_AVAILABLE_COURIERS_SUCCESS,
  FETCH_AVAILABLE_COURIERS_FAILURE,
  POST_REVERSE_PICKUP_START,
  POST_REVERSE_PICKUP_SUCCESS,
  POST_REVERSE_PICKUP_FAILURE,
  POST_RPU_CANCELLED_START,
  POST_RPU_CANCELLED_SUCCESS,
  POST_RPU_CANCELLED_FAILURE,
  POST_TXN_UPDATE_START,
  POST_TXN_UPDATE_SUCCESS,
  POST_TXN_UPDATE_FAILURE,
  FETCH_CRYPT_ORDER_START,
  FETCH_CRYPT_ORDER_SUCCESS,
  FETCH_CRYPT_ORDER_FAILURE,
  POST_MOVE_TO_ASSIGN_REFUND_START,
  POST_MOVE_TO_ASSIGN_REFUND_SUCCESS,
  POST_MOVE_TO_ASSIGN_REFUND_FAILURE,
  FETCH_UNUSABLE_SHIPMENT_START,
  FETCH_UNUSABLE_SHIPMENT_SUCCESS,
  FETCH_UNUSABLE_SHIPMENT_FAILURE,
  PUT_UNUSABLE_SHIPMENT_START,
  PUT_UNUSABLE_SHIPMENT_SUCCESS,
  PUT_UNUSABLE_SHIPMENT_FAILURE,
  PUT_UPDATE_SHIPMENT_START,
  PUT_UPDATE_SHIPMENT_SUCCESS,
  PUT_UPDATE_SHIPMENT_FAILURE,
  POST_EXCHANGE_ORDER_START,
  POST_EXCHANGE_ORDER_SUCCESS,
  POST_EXCHANGE_ORDER_FAILURE
} from "../actions/actionTypes";

const initialState = {
  data: {
    count: 0
  },
  csvStatus: "",
  crypt: "",
  history: {},
  processRefundStatus: "",
  pickupStatus: false,
  processRefund: {},
  options: [],
  exchangeStatus: "",
  couriers: [],
  asignRefundStatus: "",
  rpuStatus: "",
  loading: false,
  error: null,
  txnUpdateStatus: "",
  cryptOptions: {},
  moveToAssignStatus: "",
  unusable: {},
  unusableStatus: "",
  updateStatus: "",
  postExchangeStatus: ""
};

const order = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDER_LIST_START:
      return {
        ...initialState,
        loading: true
      };
    case FETCH_ORDER_LIST_SUCCESS:
      const payload =
        action.payload == ""
          ? { data: { data: [], message: "No data found" } }
          : action.payload;
      return {
        ...state,
        loading: false,
        data: payload.data
      };
    case FETCH_ORDER_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case POST_BULK_CSV_START:
      return {
        ...state,
        loading: true,
        csvStatus: ""
      };
    case POST_BULK_CSV_SUCCESS:
      return {
        ...state,
        loading: false,
        csvStatus:
          action.payload.status == 200
            ? "Data Submitted Successfully. You will receive an email shortly."
            : action.payload.statusText
      };
    case POST_BULK_CSV_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        csvStatus: ""
      };
    case PATCH_CRYPT_ORDER_START:
      return {
        ...state,
        loading: true
      };
    case PATCH_CRYPT_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        crypt:
          action.payload.status == 200
            ? "Data Submitted Successfully"
            : action.payload.data.message
      };
    case PATCH_CRYPT_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case FETCH_TXN_HISTORY_START:
      return {
        ...state,
        loading: true
      };
    case FETCH_TXN_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        history: action.payload
      };
    case FETCH_TXN_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case FETCH_PROCESS_REFUND_START:
      return {
        ...state,
        loading: true
      };
    case FETCH_PROCESS_REFUND_SUCCESS:
      const processRefund = action.payload || {};
      return {
        ...state,
        loading: false,
        processRefund: processRefund
      };
    case FETCH_PROCESS_REFUND_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case POST_PROCESS_REFUND_START:
      return {
        ...state,
        loading: true
      };
    case POST_PROCESS_REFUND_SUCCESS:
      return {
        ...state,
        loading: false,
        processRefundStatus:
          action.payload.status == 200
            ? "Data Submitted Successfully"
            : action.payload.data.message
      };
    case POST_PROCESS_REFUND_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case FETCH_ASSIGN_REFUND_OS_START:
      return {
        ...state,
        loading: true
      };
    case FETCH_ASSIGN_REFUND_OS_SUCCESS:
      const options = action.payload || [];
      return {
        ...state,
        loading: false,
        options: options
      };
    case FETCH_ASSIGN_REFUND_OS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case POST_ASSIGN_REFUND_START:
      return {
        ...state,
        loading: true
      };
    case POST_ASSIGN_REFUND_SUCCESS:
      return {
        ...state,
        loading: false,
        asignRefundStatus:
          action.payload.status == 200
            ? "Data Submitted Successfully"
            : action.payload.data.message
      };
    case POST_ASSIGN_REFUND_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case POST_EXCHANGE_REPLACE_START:
      return {
        ...state,
        loading: true
      };
    case POST_EXCHANGE_REPLACE_SUCCESS:
      return {
        ...state,
        loading: false,
        exchangeStatus:
          action.payload.status == 200
            ? "Data Submitted Successfully"
            : action.payload.data.message
      };
    case POST_EXCHANGE_REPLACE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case FETCH_AVAILABLE_COURIERS_START:
      return {
        ...state,
        loading: true
      };
    case FETCH_AVAILABLE_COURIERS_SUCCESS:
      const couriers = action.payload || [];
      return {
        ...state,
        loading: false,
        couriers: couriers
      };
    case FETCH_AVAILABLE_COURIERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case POST_REVERSE_PICKUP_START:
      return {
        ...state,
        loading: true
      };
    case POST_REVERSE_PICKUP_SUCCESS:
      return {
        ...state,
        loading: false,
        pickupStatus:
          action.payload.status == 200
            ? "Data Submitted Successfully"
            : action.payload.data.errorMessage
      };
    case POST_REVERSE_PICKUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case POST_RPU_CANCELLED_START:
      return {
        ...state,
        loading: true
      };
    case POST_RPU_CANCELLED_SUCCESS:
      return {
        ...state,
        loading: false,
        rpuStatus:
          action.payload.status == 200
            ? "Data Submitted Successfully"
            : action.payload.data.message
      };
    case POST_RPU_CANCELLED_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case POST_TXN_UPDATE_START:
      return {
        ...state,
        loading: true
      };
    case POST_TXN_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        txnUpdateStatus:
          action.payload.status == 200
            ? "Data Submitted Successfully"
            : action.payload.data.message
      };
    case POST_TXN_UPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case FETCH_CRYPT_ORDER_START:
      return {
        ...state,
        loading: true
      };
    case FETCH_CRYPT_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        cryptOptions: action.payload
      };
    case FETCH_CRYPT_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case POST_MOVE_TO_ASSIGN_REFUND_START:
      return {
        ...state,
        loading: true
      };
    case POST_MOVE_TO_ASSIGN_REFUND_SUCCESS:
      return {
        ...state,
        loading: false,
        moveToAssignStatus:
          action.payload.status == 200
            ? "Data Submitted Successfully"
            : action.payload.data.message
      };
    case POST_MOVE_TO_ASSIGN_REFUND_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case FETCH_UNUSABLE_SHIPMENT_START:
      return {
        ...state,
        loading: true
      };
    case FETCH_UNUSABLE_SHIPMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        unusable: action.payload
      };
    case FETCH_UNUSABLE_SHIPMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case PUT_UNUSABLE_SHIPMENT_START:
      return {
        ...state,
        loading: true
      };
    case PUT_UNUSABLE_SHIPMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        unusableStatus:
          action.payload.status == 200
            ? "Data Submitted Successfully"
            : action.payload.data.message
      };
    case PUT_UNUSABLE_SHIPMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case PUT_UPDATE_SHIPMENT_START:
      return {
        ...state,
        loading: true
      };
    case PUT_UPDATE_SHIPMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        updateStatus:
          action.payload.statusText == "OK" && action.payload.data[0].status
            ? "Data Submitted Successfully"
            : action.payload.data[0].error
      };
    case PUT_UPDATE_SHIPMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case POST_EXCHANGE_ORDER_START:
      return {
        ...state,
        loading: true
      };
    case POST_EXCHANGE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        postExchangeStatus:
          action.payload.status == 200
            ? "Data Submitted Successfully"
            : action.payload.data.message
      };
    case POST_EXCHANGE_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        postExchangeStatus: "Error occured",
        error: action.payload
      };
    default:
      return state;
  }
};
export default order;
