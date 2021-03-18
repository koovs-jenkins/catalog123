import axios from "axios";

export const getMasterCategory = (gender) => {
    return axios.get(`/sizeguide/categories`).then(res => {
            return res.data})
      .catch(err => err.response);
  };

export const getSubCategory = (gender,masterID) => {
    return axios.get(`/sizeguide/subcategories/${gender}/${masterID}`).then(res => {
            return res.data})
      .catch(err => err.response);
  };

export const getBrands = (gender,subCategoryID) => {
    return axios.get(`/sizeguide/brands/${gender}/${subCategoryID}`).then(res => {
            return res.data})
      .catch(err => err.response);
  };

export function uploadTemplateImageApi(formdata){
    return axios.post("/upload-image" ,formdata).then(res => {
        console.log(res);
        return res
    });
}

export function postSizeMapData(data){
    return axios.post( "/jarvis-home-service/internal/v1/size-guide/update" ,data, {headers: {'Content-Type': 'application/json',"X-API-CLIENT":"OPS"}}).then(res => {
        return res
    }).catch(err => err.response);
}

export const fetchArticleIdBySubcategory = (subcatrgoryId, userId, gender) => {
    return axios
    .get(
      `/sizeguide/articletypeid/${subcatrgoryId}/${gender}`,
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
