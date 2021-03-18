import axios from "axios";

export const postCreateOutfitApi = (data, userId) => {
  return axios
    .post(`/outfit/create`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const getOutfitListApi = (pageNumber, pageSize, userId) => {
  return axios
    .get(`/outfit/list?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const statusChangeOutfitApi = (id, userId, status, data = {}) => {
  return axios
    .put(
      `/outfit/${status ? "inactivate" : "activate"}/${id}/${userId}`,
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

export const getProductByIdApi = (productId, userId) => {
  return axios
    .get(`/jarvis-service/v1/product/details/batch/products?ids=${productId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const getOutfitByIdApi = (outfitId, userId) => {
  return axios
    .get(`/outfit/getById/${outfitId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postEditOutfitApi = (data, userId) => {
  return axios
    .post(`/outfit/addLines`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const getProductsByBrandApi = (
  userId,
  parent_category,
  master_category,
  brand,
  gender,
  page_number,
  page_size
) => {
  return axios
    .get(
      `/product/getProducts/ShopTheLook?gender=${gender}${
        parent_category ? "&parent_category=" + parent_category : ""
      }${master_category ? "&master_category=" + master_category : ""}${
        brand ? "&brand=" + brand : ""
      }${page_number ? "&page_number=" + page_number : ""}${
        page_size ? "&page_size=" + page_size : ""
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
