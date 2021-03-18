import axios from "axios";
export const fetchPricingLogsApi = (
  skuId,
  pageSize,
  pageNumber,
  startDate,
  endDate,
  userId
) => {
  return axios
    .get(
      `/pricing/log/list?pageSize=${pageSize}&pageNumber=${pageNumber}${skuId &&
        "&skuId=" + skuId}${startDate && "&startDate=" + startDate}${endDate &&
        "&endDate=" + endDate}`,
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

export const fetchPromoLogsApi = (
  promoCode,
  promoUserId,
  userEmail,
  type,
  pageSize,
  pageNumber,
  startDate,
  endDate,
  userId
) => {
  return axios
    .get(
      `/rules/v1/promotion/audit_log?pageSize=${pageSize}&pageNumber=${pageNumber}${promoCode &&
        "&promoCode=" + promoCode}${promoUserId &&
        "&userId=" + promoUserId}${userEmail &&
        "&userEmail=" + userEmail}${type && "&type=" + type}${startDate &&
        "&startDate=" + startDate}${endDate && "&endDate=" + endDate}`,
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

export const fetchInventoryLogsApi = (
  skuId,
  pageSize,
  pageNumber,
  startDate,
  userId
) => {
  return axios
    .get(
      `/internal/inventory/logs/${skuId}?pageSize=${pageSize}&page=${pageNumber}${startDate &&
        "&fromDate=" + startDate}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "auth-key": "K@@VSINTERN@L",
          "x-user-id": userId
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};
export const fetchTaggingLogsApi = (
  lineId,
  pageSize,
  pageNumber,
  tagName,
  userId
) => {
  return axios
    .get("/tag/audit?" +  (tagName ? "tag-name=" + tagName + "&" : "") +   (lineId ? "line-id=" + lineId  + "&": "") + "pageSize=" + pageSize +  "&pageNumber=" + pageNumber,{
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "auth-key": "K@@VSINTERN@L",
          "x-user-id": userId
        }
      }
    )
    .then(res => res)
    .catch(err => err.response);
};

export const fetchPricingScheduledLogsApi = (
  skuId,
  pageSize,
  pageNumber,
  startDate,
  endDate,
  userId
) => {
  return axios
    .get(
      `/pricing/schedule-log/list?pageSize=${pageSize}&pageNumber=${pageNumber}${skuId &&
        "&skuId=" + skuId}${startDate && "&startDate=" + startDate}${endDate &&
        "&endDate=" + endDate}`,
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

export const fetchProductLogsApi = (
  productId,
  pageSize,
  pageNumber,
  userId
) => {
  return axios
    .get(
      `/product/getAuditLogs?productId=${productId}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
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