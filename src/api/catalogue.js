import axios from "axios";

export const postSkuChangeApi = (form, userId) => {
  return axios
    .post("/product/changeSkuStatus", form, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postSkuChangeCsvApi = (userId, formdata, emailId) => {
  const url = "/product/batch/changeSkuStatus?userId=" + emailId;
  return axios
    .post(url, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postAddColorCodeApi = (userId, form) => {
  return axios
    .post("/colorMapping/createPrimary", form, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchPrimaryColorApi = (userId) => {
  const url = "/colorMapping/getAllPrimaryColor";
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

export const fetchSecondaryColorApi = (userId, search) => {
  const url = `/attributeType/getAllAttributeValues?search=${search}&type=Color`;
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

export const postColorMappingApi = (userId, form) => {
  return axios
    .post("/colorMapping/mapSecondary", form, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};