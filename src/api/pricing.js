import axios from "axios";
import { serialize } from "../helpers";

export const fetchScheduledPriceApi = (userId, params) => {
  return axios
    .get(`/pricing/list?${serialize(params)}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postBulkPriceApi = (userId, url, form) => {
  return axios
    .post(url, form, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res.data)
    .catch(err => err.response);
};

export const postSkuDetail = (userId, form) => {
  return axios
    .post("/inventory/get/combined/fetch/all", form, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postUpdateInventoryApi = (userId, form) => {
  return axios
    .post("/inventory/update", form, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postOverrideInventoryApi = (userId, form) => {
  return axios
    .post("/inventory/override", form, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postBulkPricingCsvApi = (
  csv,
  userId,
  emailId,
  url,
  method = "post"
) => {
  return axios({
    method: "post",
    url: "/pricing/upload",
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

export const postRevertBatchApi = (userId, form) => {
  return axios
    .post("/pricing/bulkRevert", form, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};