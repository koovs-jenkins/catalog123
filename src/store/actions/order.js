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
  POST_EXCHANGE_ORDER_START,
  POST_EXCHANGE_ORDER_SUCCESS,
  POST_EXCHANGE_ORDER_FAILURE,
  PUT_UPDATE_SHIPMENT_START,
  PUT_UPDATE_SHIPMENT_SUCCESS,
  PUT_UPDATE_SHIPMENT_FAILURE,
} from "./actionTypes";
import {
  fetchOrderListApi,
  postBulkCsvApi,
  patchCryptOrderApi,
  fetchTransactionHistoryApi,
  fetchProcessRefundApi,
  postProcessRefundApi,
  fetchAssignOrderOptionsApi,
  postAssignOrderApi,
  postExchangeReplaceApi,
  fetchAvailableCouriersApi,
  postReversePickUpApi,
  postRpuCancelledApi,
  postTxnUpdateApi,
  fetchCryptOrderApi,
  postMoveToAssignRefundApi,
  fetchUnusableShipmentApi,
  putUnusableShipmentApi,
  putUpdateShipmentApi,
  postExchangeOrderApi
} from "../../api/order";

export function fetchOrderList(page, pageSize, body, userId) {
  return dispatch => {
    dispatch(fetchOrderListBegin());
    return fetchOrderListApi(page, pageSize, body, userId)
      .then(json => {
        dispatch(fetchOrderListSuccess(json));
      })
      .catch(error => dispatch(fetchOrderListFailure(error)));
  };
}

export const fetchOrderListBegin = () => ({
  type: FETCH_ORDER_LIST_START
});

export const fetchOrderListSuccess = data => ({
  type: FETCH_ORDER_LIST_SUCCESS,
  payload: data
});

export const fetchOrderListFailure = error => ({
  type: FETCH_ORDER_LIST_FAILURE,
  payload: error
});

export function postBulkCsvAction(csv, userId, emailId, url, method) {
  return dispatch => {
    dispatch(postBulkCsvBegin());
    return postBulkCsvApi(csv, userId, emailId, url, method)
      .then(json => {
        dispatch(postBulkCsvSuccess(json));
      })
      .catch(error => dispatch(postBulkCsvFailure(error)));
  };
}

export const postBulkCsvBegin = () => ({
  type: POST_BULK_CSV_START
});

export const postBulkCsvSuccess = data => ({
  type: POST_BULK_CSV_SUCCESS,
  payload: data
});

export const postBulkCsvFailure = error => ({
  type: POST_BULK_CSV_FAILURE,
  payload: error
});

export function patchCryptOrderAction(csv, userId) {
  return dispatch => {
    dispatch(patchCryptOrderBegin());
    return patchCryptOrderApi(csv, userId)
      .then(json => {
        dispatch(patchCryptOrderSuccess(json));
        setTimeout(() => {
          dispatch(patchCryptOrderBegin());
        }, 10000);
      })
      .catch(error => dispatch(patchCryptOrderFailure(error)));
  };
}

export const patchCryptOrderBegin = () => ({
  type: PATCH_CRYPT_ORDER_START
});

export const patchCryptOrderSuccess = data => ({
  type: PATCH_CRYPT_ORDER_SUCCESS,
  payload: data
});

export const patchCryptOrderFailure = error => ({
  type: PATCH_CRYPT_ORDER_FAILURE,
  payload: error
});

export function fetchTransactionHistory(userId, txnId) {
  return dispatch => {
    dispatch(fetchTransactionHistoryBegin());
    return fetchTransactionHistoryApi(userId, txnId)
      .then(json => {
        dispatch(fetchTransactionHistorySuccess(json));
      })
      .catch(error => dispatch(fetchTransactionHistoryFailure(error)));
  };
}

export const fetchTransactionHistoryBegin = () => ({
  type: FETCH_TXN_HISTORY_START
});

export const fetchTransactionHistorySuccess = data => ({
  type: FETCH_TXN_HISTORY_SUCCESS,
  payload: data
});

export const fetchTransactionHistoryFailure = error => ({
  type: FETCH_TXN_HISTORY_FAILURE,
  payload: error
});

export function fetchProcessRefund(userId, txnId) {
  return dispatch => {
    dispatch(fetchProcessRefundBegin());
    return fetchProcessRefundApi(userId, txnId)
      .then(json => {
        dispatch(fetchProcessRefundSuccess(json));
      })
      .catch(error => dispatch(fetchProcessRefundFailure(error)));
  };
}

export const fetchProcessRefundBegin = () => ({
  type: FETCH_PROCESS_REFUND_START
});

export const fetchProcessRefundSuccess = data => ({
  type: FETCH_PROCESS_REFUND_SUCCESS,
  payload: data
});

export const fetchProcessRefundFailure = error => ({
  type: FETCH_PROCESS_REFUND_FAILURE,
  payload: error
});

export function postProcessRefund(data, userId) {
  return dispatch => {
    dispatch(postProcessRefundBegin());
    return postProcessRefundApi(data, userId)
      .then(json => {
        dispatch(postProcessRefundSuccess(json));
      })
      .catch(error => dispatch(postProcessRefundFailure(error)));
  };
}

export const postProcessRefundBegin = () => ({
  type: POST_PROCESS_REFUND_START
});

export const postProcessRefundSuccess = data => ({
  type: POST_PROCESS_REFUND_SUCCESS,
  payload: data
});

export const postProcessRefundFailure = error => ({
  type: POST_PROCESS_REFUND_FAILURE,
  payload: error
});

export function fetchAssignOrderOptions(userId, url) {
  return dispatch => {
    dispatch(fetchAssignOrderOptionsBegin());
    return fetchAssignOrderOptionsApi(userId, url)
      .then(json => {
        dispatch(fetchAssignOrderOptionsSuccess(json));
      })
      .catch(error => dispatch(fetchAssignOrderOptionsFailure(error)));
  };
}

export const fetchAssignOrderOptionsBegin = () => ({
  type: FETCH_ASSIGN_REFUND_OS_START
});

export const fetchAssignOrderOptionsSuccess = data => ({
  type: FETCH_ASSIGN_REFUND_OS_SUCCESS,
  payload: data
});

export const fetchAssignOrderOptionsFailure = error => ({
  type: FETCH_ASSIGN_REFUND_OS_FAILURE,
  payload: error
});

export function postAssignOrder(data, userId) {
  return dispatch => {
    dispatch(postAssignOrderBegin());
    return postAssignOrderApi(data, userId)
      .then(json => {
        dispatch(postAssignOrderSuccess(json));
        setTimeout(() => {
          dispatch(postAssignOrderBegin());
        }, 10000);
      })
      .catch(error => dispatch(postAssignOrderFailure(error)));
  };
}

export const postAssignOrderBegin = () => ({
  type: POST_ASSIGN_REFUND_START
});

export const postAssignOrderSuccess = data => ({
  type: POST_ASSIGN_REFUND_SUCCESS,
  payload: data
});

export const postAssignOrderFailure = error => ({
  type: POST_ASSIGN_REFUND_FAILURE,
  payload: error
});

export function postExchangeReplace(data, userId, orderId) {
  return dispatch => {
    dispatch(postExchangeReplaceBegin());
    return postExchangeReplaceApi(data, userId, orderId)
      .then(json => {
        dispatch(postExchangeReplaceSuccess(json));
        setTimeout(() => {
          dispatch(postExchangeReplaceBegin());
        }, 10000);
      })
      .catch(error => dispatch(postExchangeReplaceFailure(error)));
  };
}

export const postExchangeReplaceBegin = () => ({
  type: POST_EXCHANGE_REPLACE_START
});

export const postExchangeReplaceSuccess = data => ({
  type: POST_EXCHANGE_REPLACE_SUCCESS,
  payload: data
});

export const postExchangeReplaceFailure = error => ({
  type: POST_EXCHANGE_REPLACE_FAILURE,
  payload: error
});

export function fetchAvailableCouriers(userId, reversePincode) {
  return dispatch => {
    dispatch(fetchAvailableCouriersBegin());
    return fetchAvailableCouriersApi(userId, reversePincode)
      .then(json => {
        dispatch(fetchAvailableCouriersSuccess(json));
      })
      .catch(error => dispatch(fetchAvailableCouriersFailure(error)));
  };
}

export const fetchAvailableCouriersBegin = () => ({
  type: FETCH_AVAILABLE_COURIERS_START
});

export const fetchAvailableCouriersSuccess = data => ({
  type: FETCH_AVAILABLE_COURIERS_SUCCESS,
  payload: data
});

export const fetchAvailableCouriersFailure = error => ({
  type: FETCH_AVAILABLE_COURIERS_FAILURE,
  payload: error
});

export function postReversePickUp(data, userId) {
  return dispatch => {
    dispatch(postReversePickUpBegin());
    return postReversePickUpApi(data, userId)
      .then(json => {
        dispatch(postReversePickUpSuccess(json));
        setTimeout(() => {
          dispatch(postReversePickUpBegin());
        }, 10000);
      })
      .catch(error => dispatch(postReversePickUpFailure(error)));
  };
}

export const postReversePickUpBegin = () => ({
  type: POST_REVERSE_PICKUP_START
});

export const postReversePickUpSuccess = data => ({
  type: POST_REVERSE_PICKUP_SUCCESS,
  payload: data
});

export const postReversePickUpFailure = error => ({
  type: POST_REVERSE_PICKUP_FAILURE,
  payload: error
});

export function postRpuCancelled(data, userId) {
  return dispatch => {
    dispatch(postRpuCancelledBegin());
    return postRpuCancelledApi(data, userId)
      .then(json => {
        dispatch(postRpuCancelledSuccess(json));
        setTimeout(() => {
          dispatch(postRpuCancelledBegin());
        }, 10000);
      })
      .catch(error => dispatch(postRpuCancelledFailure(error)));
  };
}

export const postRpuCancelledBegin = () => ({
  type: POST_RPU_CANCELLED_START
});

export const postRpuCancelledSuccess = data => ({
  type: POST_RPU_CANCELLED_SUCCESS,
  payload: data
});

export const postRpuCancelledFailure = error => ({
  type: POST_RPU_CANCELLED_FAILURE,
  payload: error
});

export function postTxnUpdate(data, userId) {
  return dispatch => {
    dispatch(postTxnUpdateBegin());
    return postTxnUpdateApi(data, userId)
      .then(json => {
        dispatch(postTxnUpdateSuccess(json));
        setTimeout(() => {
          dispatch(postTxnUpdateBegin());
        }, 10000);
      })
      .catch(error => dispatch(postTxnUpdateFailure(error)));
  };
}

export const postTxnUpdateBegin = () => ({
  type: POST_TXN_UPDATE_START
});

export const postTxnUpdateSuccess = data => ({
  type: POST_TXN_UPDATE_SUCCESS,
  payload: data
});

export const postTxnUpdateFailure = error => ({
  type: POST_TXN_UPDATE_FAILURE,
  payload: error
});

export function fetchCryptOrderAction(txnId, userId) {
  return dispatch => {
    dispatch(fetchCryptOrderBegin());
    return fetchCryptOrderApi(txnId, userId)
      .then(json => {
        dispatch(fetchCryptOrderSuccess(json));
        setTimeout(() => {
          dispatch(fetchCryptOrderBegin());
        }, 10000);
      })
      .catch(error => dispatch(fetchCryptOrderFailure(error)));
  };
}

export const fetchCryptOrderBegin = () => ({
  type: FETCH_CRYPT_ORDER_START
});

export const fetchCryptOrderSuccess = data => ({
  type: FETCH_CRYPT_ORDER_SUCCESS,
  payload: data
});

export const fetchCryptOrderFailure = error => ({
  type: FETCH_CRYPT_ORDER_FAILURE,
  payload: error
});

export function postMoveToAssignRefund(data, userId) {
  return dispatch => {
    dispatch(postMoveToAssignRefundBegin());
    return postMoveToAssignRefundApi(data, userId)
      .then(json => {
        dispatch(postMoveToAssignRefundSuccess(json));
      })
      .catch(error => dispatch(postMoveToAssignRefundFailure(error)));
  };
}

export const postMoveToAssignRefundBegin = () => ({
  type: POST_MOVE_TO_ASSIGN_REFUND_START
});

export const postMoveToAssignRefundSuccess = data => ({
  type: POST_MOVE_TO_ASSIGN_REFUND_SUCCESS,
  payload: data
});

export const postMoveToAssignRefundFailure = error => ({
  type: POST_MOVE_TO_ASSIGN_REFUND_FAILURE,
  payload: error
});

export function fetchUnusableShipmentAction(userId, txnId) {
  return dispatch => {
    dispatch(fetchUnusableShipmentBegin());
    return fetchUnusableShipmentApi(userId, txnId)
      .then(json => {
        dispatch(fetchUnusableShipmentSuccess(json));
        setTimeout(() => {
          dispatch(fetchUnusableShipmentBegin());
        }, 10000);
      })
      .catch(error => dispatch(fetchUnusableShipmentFailure(error)));
  };
}

export const fetchUnusableShipmentBegin = () => ({
  type: FETCH_UNUSABLE_SHIPMENT_START
});

export const fetchUnusableShipmentSuccess = data => ({
  type: FETCH_UNUSABLE_SHIPMENT_SUCCESS,
  payload: data
});

export const fetchUnusableShipmentFailure = error => ({
  type: FETCH_UNUSABLE_SHIPMENT_FAILURE,
  payload: error
});

export function putUnusableShipmentAction(userId, txnId, type) {
  return dispatch => {
    dispatch(putUnusableShipmentBegin());
    return putUnusableShipmentApi(userId, txnId, type)
      .then(json => {
        dispatch(putUnusableShipmentSuccess(json));
        setTimeout(() => {
          dispatch(putUnusableShipmentBegin());
        }, 10000);
      })
      .catch(error => dispatch(putUnusableShipmentFailure(error)));
  };
}

export const putUnusableShipmentBegin = () => ({
  type: PUT_UNUSABLE_SHIPMENT_START
});

export const putUnusableShipmentSuccess = data => ({
  type: PUT_UNUSABLE_SHIPMENT_SUCCESS,
  payload: data
});

export const putUnusableShipmentFailure = error => ({
  type: PUT_UNUSABLE_SHIPMENT_FAILURE,
  payload: error
});

export function postExchangeOrder(data, userId, orderId) {
  return dispatch => {
    dispatch(postExchangeOrderBegin());
    return postExchangeOrderApi(data, userId, orderId)
      .then(json => {
        dispatch(postExchangeOrderSuccess(json));
        setTimeout(() => {
          dispatch(postExchangeOrderBegin());
        }, 10000);
      })
      .catch(error => dispatch(postExchangeOrderFailure(error)));
  };
}

export const postExchangeOrderBegin = () => ({
  type: POST_EXCHANGE_ORDER_START
});

export const postExchangeOrderSuccess = data => ({
  type: POST_EXCHANGE_ORDER_SUCCESS,
  payload: data
});

export const postExchangeOrderFailure = error => ({
  type: POST_EXCHANGE_ORDER_FAILURE,
  payload: error
});




export function putUpdateShipment(userId, data) {
  return dispatch => {
    dispatch(putUpdateShipmentBegin());
    return putUpdateShipmentApi(userId, data)
      .then(json => {
        dispatch(putUpdateShipmentSuccess(json));
        setTimeout(() => {
          dispatch(putUpdateShipmentBegin());
        }, 10000);
      })
      .catch(error => dispatch(putUpdateShipmentFailure(error)));
  };
}

export const putUpdateShipmentBegin = () => ({
  type: PUT_UPDATE_SHIPMENT_START
});

export const putUpdateShipmentSuccess = data => ({
  type: PUT_UPDATE_SHIPMENT_SUCCESS,
  payload: data
});

export const putUpdateShipmentFailure = error => ({
  type: PUT_UPDATE_SHIPMENT_FAILURE,
  payload: error
});