import axios from "axios";

export function getProductMeasure(id) {
  return axios.get("/modelSize/get/" + id).then(res => {
    return res;
  });
}

export function postProductMeasureApi(data, pid) {
  const userId = JSON.parse(data).userId;
  return axios
    .post("/modelSize/mappingWithProduct", data, {
      headers: { "Content-Type": "application/json" }
    })
    .then(res => {
      if (!res.data.errorExists) {
        return axios
          .post(
            "/product/cacheProduct",
            JSON.stringify({
              productId: pid,
              addImageCall: false,
              modelAddCall: true,
              productCreateCall: false,
              userId
            }),
            { headers: { "Content-Type": "application/json" } }
          )
          .then(res => {
            if (!res.errorExists) {
              return res;
            }
          });
      } else {
        return res;
      }
    });
}
