import axios from "axios";

export function getPromotionalPromoDetail(id) {
  return axios.get("/rules/v1/promotion/code/" + id).then((res) => {
    return res;
  });
}

export function getPromotionalPromoList(
  searched_text = "",
  status = "",
  current_page = "",
  from = "",
  page_size = 10
) {
  return axios
    .get(
      "/rules/v1/promotion/code?genre=generic&type=" +
        (from == "bankoffer" ? "IMPLICIT_BANK_OFFER" : "buyxgety") +
        "&searchKey=" +
        searched_text +
        "&searchParam=code" +
        (current_page
          ? "&pageSize=" + page_size + "&page=" + (parseInt(current_page) - 1)
          : "")
    )
    .then((res) => {
      return res;
    });
}

export function postPromotionalPromoApi(data) {
  return axios
    .post("/rules/v1/template/code", data, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      return res;
    });
}

export function putPromotionalPromoApi(id, data) {
  return axios
    .put("/rules/v1/template/code", data, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      return res;
    });
}

export function patchPromotionalPromoApi(id, data) {
  return axios
    .patch("" + id, data, { headers: { "Content-Type": "application/json" } })
    .then((res) => {
      return res;
    });
}

export const fetchAllActivePromoList = (userId, body) => {
  return axios
    .get(
      `/rules/v1/promotion/allActivePromos`,
      { params: body },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": userId,
        },
      }
    )
    .then((res) => res)
    .catch((err) => err.response);
};

export function postPromoRankApi(userId, data) {
  return axios
    .post("/rules/v1/promotion/createActivePromosCache", data, {
      "Content-Type": "application/json",
      "x-api-client": "OPS",
      "x-user-id": userId,
    })
    .then((res) => res)
    .catch((err) => err.response);
}

export const fetchActivePromos = (userId) => {
  return axios
    .get(`/rules/v1/promotion/cachedActivePromos`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId,
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
};

export const deleteActivePromos = (userId, promoCode) => {
  return axios
    .delete(`/rules/v1/promotion/cachedActivePromos/${promoCode}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId,
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
};
