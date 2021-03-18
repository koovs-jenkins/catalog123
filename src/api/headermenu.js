import axios from "axios";

export const fetchAllHeaderTemplateApi = (
  platform,
  status,
  updatedBy,
  pageSize,
  page
) => {
  return axios
    .get(
      `/jarvis-home-service/internal/v1/home/header/template/all?${
        platform ? "platform=" + platform : ""
      }${updatedBy ? "&updatedBy=" + updatedBy : ""}${
        status ? "&status=" + status : ""
      }${page ? "&page=" + page : ""}${
        pageSize ? "&page-size=" + pageSize : ""
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS"
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};

export const fetchHeaderTemplateApi = (templateId, userId) => {
  return axios
    .get(
      `/jarvis-home-service/internal/v1/home/header/template?id=${templateId}`,
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

export const postTemplateApi = (data, userId, email) => {
  return axios
    .post(`/jarvis-home-service/internal/v1/home/header/template`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId,
        "x-user-email": email
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const putTemplateApi = (id, data, userId, email) => {
  return axios
    .put(`/jarvis-home-service/internal/v1/home/header/template/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId,
        "x-user-email": email
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const updateTemplateStatusApi = (id, data, userId, email) => {
  return axios
    .put(
      `/jarvis-home-service/internal/v1/home/header/template/status/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": userId,
          "x-user-email": email
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};

export const forceUpdateHeaderApi = platform => {
  return axios
    .get(
      `/jarvis-home-service/internal/v1/home/header/template/active?platform=${platform}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS"
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};
