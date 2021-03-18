import axios from "axios";

export const uploadImageApi = (data) => {
  return axios
    .post(`/jarvis-home-service/internal/v1/home/upload/image`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
};

export const fetchTemplatesApi = (
  gender,
  page,
  platform,
  pageSize,
  sortBy,
  sortOrder,
  status,
  keyword,
  startActiveFrom,
  endActiveFrom
) => {
  return axios
    .get(
      `/jarvis-home-service/internal/v1/home/template/group?page=${page}${
      pageSize ? "&pageSize=" + pageSize : ""
      }${gender ? "&gender=" + gender : ""}${platform ? "&platform=" + platform : ""}${
      keyword ? "&keyword=" + keyword : ""}${
      startActiveFrom ? "&startActiveFrom=" + startActiveFrom : ""
      }${
      endActiveFrom ? "&endActiveFrom=" + endActiveFrom : ""
      }${
      sortBy && sortOrder ? "&sortBy=" + sortBy : ""
      }${sortOrder ? "&sortOrder=" + sortOrder : ""}${status ? "&status=" + status : ""}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "web",
        },
      }
    )
    .then((res) => res)
    .catch((err) => err.response);
};

export const deleteTemplateApi = (id, data) => {
  return axios
    .delete(`/jarvis-home-service/internal/v1/home/template/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
      },
      data,
    })
    .then((res) => res)
    .catch((err) => err.response);
};

export const putTemplateApi = (id, data) => {
  return axios
    .put(
      `/jarvis-home-service/internal/v1/home/template/activate/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
        },
      }
    )
    .then((res) => res)
    .catch((err) => err.response);
};

export const fetchWidgetsApi = (page, pageSize, name, status, exactFlag,version) => {
  return axios
    .get(
      `/jarvis-home-service/internal/v1/widget/list?page=${page}&pageSize=${pageSize}${
      name ? "&name=" + name : ""
      }${(status ? "&status=" + status : "")}${exactFlag ? "&exactFlag=" + true : ""}${version ? "&version=" + version : ""}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "web",
        },
      }
    )
    .then((res) => res)
    .catch((err) => err.response);
};

export const sendEmailApi = (data) => {
  return axios
    .post(`/email/sendEmail`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
};

export const fetchWidgetByIdApi = (id) => {
  return axios
    .get(`/jarvis-home-service/internal/v1/widget/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "web",
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
};

export const postWidgetApi = (data, email) => {
  return axios
    .post(`/jarvis-home-service/internal/v1/widget/save`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-email": email,
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
};

export const postTemplateApi = (data) => {
  return axios
    .post("/jarvis-home-service/internal/v1/home/template", data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
};

export const fetchTemplatesByNameApi = (name,version) => {
  return axios
    .get(`/jarvis-home-service/internal/v1/home/template/name/${name}?version=${version}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "web",
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
};

export const deleteWidgetApi = (id, email, data) => {
  return axios
    .delete(`/jarvis-home-service/internal/v1/widget/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-email": email,
      },
      data,
    })
    .then((res) => res)
    .catch((err) => err.response);
};

export const fetchVersionApi = () => {
  return axios
    .get(`/jarvis-home-service/internal/v1/home/cms-version`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "ops",
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
};

export const fetchListBannerApi = (page, platform) => {
  return axios
    .get(
      `/jarvis-service/internal/v1/product/listing/banner?platform=${platform}&page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "web",
        },
      }
    )
    .then((res) => res)
    .catch((err) => err.response);
};

export const bannerListSubmitApi = (data, method) => {
  return axios({
    url: "/jarvis-service/internal/v1/product/listing/banner",
    data,
    method,
    headers: {
      "Content-Type": "Application/json",
      "x-api-client": "OPS",
    },
  })
    .then((res) => res)
    .catch((err) => err.response);
};

export const deleteListBannerApi = (id, email) => {
  return axios
    .delete(`/jarvis-service/internal/v1/product/listing/banner/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
};

export const putVersionApi = (data, userId, email) => {
  return axios
    .post("/jarvis-home-service/internal/v1/home/cms-version", data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId,
        "x-user-email": email,
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
};

export const fetchPaymentBannerApi = (page, platform) => {
  return axios
    .get(
      `/jarvis-order-service/internal/v1/payment/banner?platform=${platform}&page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "web",
        },
      }
    )
    .then((res) => res)
    .catch((err) => err.response);
};

export const bannerPaymentSubmitApi = (data, method) => {
  return axios({
    url: "/jarvis-order-service/internal/v1/payment/banner",
    data,
    method,
    headers: {
      "Content-Type": "Application/json",
      "x-api-client": "OPS",
    },
  })
    .then((res) => res)
    .catch((err) => err.response);
};

export const deletePaymentBannerApi = (id, email) => {
  return axios
    .delete(`/jarvis-order-service/internal/v1/payment/listing/banner/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-email": email,
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
};

export const uploadJsonApi = (data) => {
  return axios
    .post("/api/upload-file", data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
};


export const fetchTemplateVersions = (templateName) => {
  return axios
    .get(
      `/jarvis-home-service/internal/v1/home/template/name/${templateName}/versions`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "web",
        },
      }
    )
    .then((res) => res)
    .catch((err) => err.response);
};