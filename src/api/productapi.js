import axios from "axios";

export function getProductDetail(id) {
  return axios.get("/product/getBy/productId/" + id).then(res => {
    return res;
  });
}

export function getMetadata(id) {
  return axios.get("/product/getMetadata").then(res => {
    return res;
  });
}

export function getProductList(
  searched_text = "",
  status = "Product",
  current_page = "",
  page_size = 50
) {
  if (!searched_text) {
    return axios
      .get(
        "/product/getAll?" +
          (current_page
            ? "&pageSize=" + page_size + "&pageNumber=" + current_page
            : "")
      )
      .then(res => {
        return res;
      });
  } else {
    return axios
      .get(
        "/product/getProducts?productIds=" +
          encodeURIComponent(searched_text) +
          "&search=" +
          (status == "" ? "Product" : status) +
          (current_page
            ? "&pageSize=" + page_size + "&pageNumber=" + current_page
            : "")
      )
      .then(res => {
        return res;
      });
  }
}

export function postProductApi(data) {
  return axios
    .post("/product/create", data, {
      headers: { "Content-Type": "application/json" }
    })
    .then(res => {
      if (!res.data.errorExists) {
        // return axios.post( "/product/cacheProduct" ,JSON.stringify({"productId" : res.data.productId}), {headers: {'Content-Type': 'application/json'}}).then((res) =>{
        //     if(!res.data.errorExists){
        return res;
        //     }
        // })
      } else {
        return res;
      }
    });
}
export function makeProductLiveApi(id, userId) {
  return axios
    .post("/product/live", JSON.stringify({ productId: id, userId }), {
      headers: { "Content-Type": "application/json" }
    })
    .then(res => {
      if (!res.data.errorExists) {
        // return axios.post( "/product/cacheProduct" ,JSON.stringify({"productId" : id}), {headers: {'Content-Type': 'application/json'}}).then((res) =>{
        //     if(!res.data.errorExists){
        return res;
        //     }
        // })
      } else {
        return res;
      }
    });
}

export function batchValidateApi(data,url) {
  var upload_url  = "/product/batch/validate"
  if(url){
    upload_url = url
  }
  return axios.post(upload_url, data).then(res => {
    console.log("This is batch", res);
    if (!res.data.errorExists && !url) {
      return axios.post("/product/batch/create", data).then(res => {
        if (!res.data.errorExists) {
          return res;
        }
      });
    } else {
      return res;
    }
  });
}

export function putProductApi(id, data) {
  return axios
    .post("/product/update", data, {
      headers: { "Content-Type": "application/json" }
    })
    .then(res => {
      // if (!res.data.errorExists) {
      //   if (res.data.productId) {
      //     return axios
      //       .post(
      //         "/product/cacheProduct",
      //         JSON.stringify({
      //           productId: res.data.productId,
      //           addImageCall: false,
      //           modelAddCall: false,
      //           productCreateCall: false
      //         }),
      //         { headers: { "Content-Type": "application/json" } }
      //       )
      //       .then(res => {
      //         if (!res.data.errorExists) {
      //           return res;
      //         }
      //       });
      //   } else {
      //     return res;
      //   }
      // }
      return res;
    });
}

export function patchProductApi(id, data) {
  return axios
    .patch("/brand/brandStatusUpdt/id/" + id, data, {
      headers: { "Content-Type": "application/json" }
    })
    .then(res => {
      return res;
    });
}

export const postBatchUpdateApi = (userId, file, email) => {
  return axios
    .post("/product/batch/update?userId=" + email, file, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postLiveLaterApi = (userId, form) => {
  return axios
    .post("/product/liveLater", form, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": userId
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchProductApi = productId => {
  return axios
    .get(`/product/getProducts/${productId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS"
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchAllHsnApi = (page, hsnCode, pageSize = 10) => {
  return axios
    .get(
      `/hsn/list?page=${page}&pageSize=${pageSize}${
        hsnCode ? "&hsnCode=" + hsnCode : ""
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

export const deleteHsnApi = (hsnCode, email) => {
  return axios
    .delete(`/hsn?hsnCode=${hsnCode}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-email": email
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postBulkHsnApi = (data, email) => {
  return axios
    .post(`/hsn/bulkAdd`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-email": email
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const postHsnApi = (data, email) => {
  return axios
    .post(`/hsn`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-email": email
      }
    })
    .then(res => res)
    .catch(err => err.response);
};

export const fetchFilteredProductsApi = (
  page,
  pageSize,
  gender,
  status,
  categoryId,
  brandId
) => {
  return axios
    .get(
      `/product/listing?${page ? "page=" + page : ""}${
        pageSize ? "&pageSize=" + pageSize : ""
      }${gender ? "&gender=" + gender : ""}${
        status ? "&status=" + status : ""
      }${categoryId ? "&categoryId=" + categoryId : ""}${
        brandId ? "&brandId=" + brandId : ""
      }
    `,
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




export function batchValidateServicablePincodeApi(data,url) {
  return axios.post(url, data).then(res => {
    console.log("This is batch", res);
    if (!res.data.errorExists && !url) {
      return axios.post("/product/batch/create", data).then(res => {
        if (!res.data.errorExists) {
          return res;
        }
      });
    } else {
      return res;
    }
  });
}

export function batchPincodeValidateApi(data,url) {
  var upload_url  = ""
  if(url){
    upload_url = url
  }
  return axios.post(upload_url, data).then(res => {
    return res;
  });
}
