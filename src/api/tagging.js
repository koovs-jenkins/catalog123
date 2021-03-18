import axios from "axios";

export const fetchAllTagsApi = (
  pageNumber = "",
  search = "",
  status = "",
  pageSize = ""
) => {
  return axios
    .get(
      `/tag/getAll?search=${search}&status=${status}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    )
    .then(res => res)
    .catch(err => err.response);
};

export const postTagApi = data => {
  return axios
    .post("/tag/create", data, {
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const putTagApi = data => {
  return axios
    .put("/tag/update", data, {
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchTagByNameApi = tagname => {
  return axios
    .get(`/tag/get/${tagname}`)
    .then(res => res)
    .catch(err => err.response);
};

export const 
postCsvApi = (userId, formdata, isRemove) => {
  const url = isRemove
    ? "/batch/removeTagMapping?userId="
    : "/batch/tagMapping?userId=";
  return axios
    .post(url + userId, formdata, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const 
postSkuCsvApi = (userId, formdata, isRemove) => {
  const url = isRemove
    ? "/batch/removeSkuTagMapping?userId="
    : "/batch/skuTagMapping?userId=";
  return axios
    .post(url + userId, formdata, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(res => res)
    .catch(err => err.response);
};



export const patchTagApi = (tagName, status, userId) => {
  return axios
    .patch("/tag/updateStatus/tagName/" + tagName, {
      status: status,
      updatedBy: userId
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchFileStatusApi = fileId => {
  return axios
    .get(`/batchFileStatus/${fileId}`)
    .then(res => res)
    .catch(err => err.response);
};

export const fetchTagMapsApi = (
  tagName,
  allRecord = "",
  pageNumber = "",
  pageSize = ""
) => {
  return axios
    .get(
      `/tag/${tagName}/getLines?pageSize=${pageSize}&pageNumber=${pageNumber}&allRecord=${allRecord}`
    )
    .then(res => res)
    .catch(err => err.response);
};
