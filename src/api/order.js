import axios from "axios";
import { cleanObject } from "../helpers";

export const fetchOrderListApi = (page, pageSize, body, userId) => {
  return axios
    .post(
      `/jarvis-order-service/internal/v1/order/get-orders?${
        page ? "page=" + page + "&" : ""
      }page-size=${pageSize}`,
      cleanObject(body),
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": userId
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};
export const postBulkCsvApi = (csv, userId, emailId, url, method = "post") => {
  return axios({
    method: "post",
    url: "/upload",
    data: csv,
    headers: {
      "Content-Type": "multipart/form-data",
      "x-api-client": "OPS",
      "x-user-id": userId,
      "X-USER-EMAIL": emailId,
      "x-api-url": url,
      "x-api-method": method
    }
  })
    .then(res => res)
    .catch(err => err.response);
};

export const patchCryptOrderApi = (data, userId) => {
  return axios
    .patch("/jarvis-order-service/internal/v1/order/payment-details", data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchTransactionHistoryApi = (userId, txnId) => {
  return axios
    .get(
      `/jarvis-order-service/internal/v1/order/change-logs?txn-id=${txnId}&page-size=100000`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": userId
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};

export const fetchProcessRefundApi = (userId, txnId) => {
  return axios
    .get(`/jarvis-order-service/internal/v1/refund/process/amounts/${txnId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};
export const fetchPendingRefundApi = (userId, txnId) => {
  return axios
    .get(`/jarvis-order-service/internal/v1/refund/process/amounts/${txnId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postProcessRefundApi = (data, userId) => {
  return axios
    .post(`/jarvis-order-service/internal/v1/refund/process/`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};
export const postPendingRefundApi = (data, userId) => {
  return axios
    .post(`/jarvis-order-service/internal/v1/refund/process/`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchAssignOrderOptionsApi = (userId, url) => {
  return axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postAssignOrderApi = (form, userId) => {
  return axios
    .post("/jarvis-order-service/internal/v1/refund/assign-refund-bulk", form, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postExchangeReplaceApi = (form, userId, orderId) => {
  return axios
    .post(
      "/jarvis-order-service/internal/v1/order/cancel-return-order/" + orderId,
      form,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": userId
        }
      }
    )
    .then(res => res.data)
    .catch(err => err.response);
};

export const postExchangeOrderApi = (form, userId, orderId) => {
  return axios
    .post(
      "/jarvis-order-service/internal/v1/order/cancel-exchage-order/" + orderId,
      form,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": userId
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};

export const fetchAvailableCouriersApi = (userId, reversePincode) => {
  return axios
    .get(
      `/jarvis-order-service/internal/v1/order/couriers/available?reversePincode=${reversePincode}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": userId
        }
      }
    )
    .then(res => res.data)
    .catch(err => err.response);
};

export const postReversePickUpApi = (form, userId) => {
  return axios({
    method: "PUT",
    url: `/api/courier-service/register-reverse-pickup?txnId=${form.txnId}&userId=${userId}&courierId=${form.courier}&reassign=0`,
    headers: {
      "Content-Type": "application/json",
      "x-api-client": "OPS",
      "x-user-id": userId
    }
  })
    .then(res => res)
    .catch(err => err.response);
};

export const postRpuCancelledApi = (form, userId) => {
  return axios
    .post(
      "/jarvis-order-service/internal/v1/order/pickup/reverse/cancel",
      form,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": userId
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};

export const postTxnUpdateApi = (form, userId) => {
  return axios
    .post("/jarvis-order-service/internal/v1/refund/revert-refund-bulk", form, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchCryptOrderApi = (txnId, userId) => {
  return axios
    .get(
      `/jarvis-order-service/internal/v1/order/options/started-failed-orders/${txnId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": userId
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};

export const postMoveToAssignRefundApi = (data, userId) => {
  return axios
    .post(
      `/jarvis-order-service/internal/v1/refund/process/move-to-assign-refund`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": userId
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};

export const fetchUnusableShipmentApi = (userId, txnId) => {
  return axios
    .get(
      `/jarvis-order-service/internal/v1/order/unusable-shipment/return-type/${txnId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": userId
        }
      }
    )
    .then(res => res.data)
    .catch(err => err.response);
};

export const putUnusableShipmentApi = (userId, txnId, type) => {
  return axios
    .put(
      `/jarvis-order-service/internal/v1/order/unusable-shipment/${txnId}/return-type/${type}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": userId
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};
export const putUpdateShipmentApi = (userId, data) => {
  return axios
    .post(`/jarvis-order-service/internal/v1/order/update-order-status`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchUserDetailsApi = (csv, userId, emailId) => {
  return axios({
    method: "post",
    url: "/upload",
    data: csv,
    headers: {
      "Content-Type": "multipart/form-data",
      "x-api-client": "OPS",
      "x-api-url":
        "/jarvis-order-service/internal/v1/order/download-user-detail/bulk",
      "x-api-method": "post",
      "x-user-id": userId,
      "x-user-email": emailId
    }
  })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchCurrentStatusApi = (csv, userId, emailId, IdsType) => {
  return axios({
    method: "post",
    url: "/upload",
    data: csv,
    headers: {
      "Content-Type": "multipart/form-data",
      "x-api-client": "OPS",
      "x-api-url": `/jarvis-order-service/internal/v1/order/current-status/bulk/${IdsType}`,
      "x-api-method": "post",
      "x-user-id": userId,
      "x-user-email": emailId
    }
  })
    .then(res => res)
    .catch(err => err.response);
};
