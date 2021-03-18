import axios from "axios";
import { getCookie } from "../helpers/cookies";

export const fetchTempCartApi = (userId, startdate, enddate, page, limit) => {
  return axios
    .get(
      `/jarvis-order-service/internal/v1/cart/all?startdate=${startdate}&enddate=${enddate}${page ?
        "&page=" + page : ""}${limit ? "&limit=" + limit : ""}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "web",
          "x-user-id": userId
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};

export const fetchUserApi = (userId, param) => {
  return axios
    .get(
      `/jarvis-order-service/internal/v1/customer-care/user-profile?${
        param.length > 1 ? param.join("&") : param.toString()
      }`,
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

export const fetchPromoApi = (userId, searchUserId) => {
  return axios
    .get(
      `/rules/v1/promotion/code/users?page=0&pageSize=1000&userId=${searchUserId}`,
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

export const fetchPincodeApi = (userId, pincode) => {
  return axios
    .get(
      `/jarvis-order-service/internal/v1/address/pincode-serviceability/${pincode}`,
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

export const fetchAddressApi = (userId, id) => {
  return axios
    .get(`/jarvis-order-service/internal/v1/customer-care/address?id=${id}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res.data)
    .catch(err => err.response);
};

export const fetchPromoCodesApi = (userId, id, page, pageSize) => {
  return axios
    .get(
      `/rules/v1/promotion/code/users?page=${page}&pageSize=${pageSize}&genre=user&userId=${id}`,
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

export const fetchReasonsApi = (userId, type) => {
  return axios
    .get(`/jarvis-order-service/v1/order/${type}/reasons`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postCancelItem = (userId, orderId, data) => {
  return axios
    .post(`/jarvis-order-service/internal/v1/order/${orderId}/cancel`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchTrackOrderApi = (userId, txnId, orderUserId) => {
  return axios
    .get(
      `/jarvis-order-service/v2/order/track-order/track-info/${txnId}/${btoa(
        orderUserId
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "web",
          "x-user-id": userId
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};

export const postReturnItem = (userId, orderId, orderUserId, data) => {
  return axios
    .post(
      `/jarvis-order-service/internal/v1/customer-care/${orderId}/return-item?id=${orderUserId}`,
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

export const postOverrideReturnItem = (userId, txnId, data) => {
  return axios
    .post(
      `/jarvis-order-service/internal/v1/customer-care/return-exchange/override/${txnId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": userId,
          Accept: "*/*"
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};

export const postExchangeItem = (userId, orderId, orderUserId, data) => {
  return axios
    .post(
      `/jarvis-order-service/internal/v1/customer-care/${orderId}/exchange-item?id=${orderUserId}`,
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

export const fetchAllAddressApi = (userId, method, data = {}) => {
  return axios({
    method: method,
    url:
      method == "put"
        ? "/jarvis-order-service/internal/v1/address/select/" + data.id
        : "/jarvis-order-service/internal/v1/address",
    data: data,
    headers: {
      "Content-Type": "application/json",
      "x-api-client": "OPS",
      "x-user-id": userId
    }
  })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchProductInfoApi = (userId, skuId) => {
  return axios
    .get(`/jarvis-service/v1/product/details/batch?ids=${skuId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchCityAndStateByPincodeApi = (userId, pincode) => {
  return axios
    .get(
      `/jarvis-order-service/internal/v1/address/zipcode/${pincode}?country_code=IND`,
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

export const fetchPaymentDetailsApi = (userId, orderId) => {
  return axios
    .get(
      `/jarvis-order-service/internal/v1/integratedPayment?orderId=${orderId}`,
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

export const fetchReturnExchangeApi = (userId, txns) => {
  return axios
    .get(
      `/jarvis-order-service/internal/v1/customer-care/options/return-exchange/?txn-ids=${txns}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "web",
          "x-user-id": userId
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};

export const fetchCartApi = userId => {
  return axios
    .get(`/jarvis-order-service/internal/v1/cart`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchWishlistApi = userId => {
  return axios
    .get(`/jarvis-order-service/internal/v1/wishlist`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postWishlistApi = (userId, data) => {
  return axios
    .post(`/jarvis-order-service/internal/v1/wishlist`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postCartApi = (userId, data) => {
  return axios
    .post(`/jarvis-order-service/internal/v1/cart`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const deleteCartApi = (userId, skuId) => {
  return axios
    .delete(`/jarvis-order-service/internal/v1/cart/${skuId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postCouponApi = (userId, data) => {
  return axios
    .post(`/jarvis-order-service/internal/v1/coupon`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const deleteCouponApi = userId => {
  return axios
    .delete(`/jarvis-order-service/internal/v1/coupon`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postOderApi = (userId, data) => {
  return axios
    .post(`/jarvis-order-service/internal/v1/order`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postMoveToBagApi = (userId, data) => {
  return axios
    .post(`/jarvis-order-service/internal/v1/wishlistV2/moveToBag`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId,
        Authorization: getCookie("_koovs_token")
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchCourierReturnPincodeServicablityApi = (userId, pincode) => {
  return axios
    .get(
      `/pincode-service/internal/courier-return-pincode-servicablity?pincode=${pincode}`,
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

export const editAddressApi = (userId, data) => {
  return axios
    .put(`/jarvis-order-service/internal/v1/address`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const deleteAddressApi = (userId, id) => {
  return axios
    .delete(`/jarvis-order-service/internal/v1/address/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const selectAddressApi = (userId, data) => {
  return axios
    .put(
      `/jarvis-order-service/internal/v1/address/select?userId=${data.userId}&addressId=${data.id}`,
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

export const checkReverseApi = (userId, pincode) => {
  return axios
    .get(
      `/jarvis-order-service/internal/v1/address/zipcodev2/${pincode}?checkReverse=true`,
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

export const fetchProductById = (userId, productId) => {
  return axios
    .get(
      `/jarvis-service/v2/search/complete?query=${productId}&page=0&page-size=36`,
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
