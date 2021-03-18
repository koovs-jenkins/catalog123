import axios from "axios";

export function getProductImage(id,lineid){
    return axios.get( "/productDigitalMedia/get/skuId/" + (id ? id : "null") +"/lineId/" + (lineid ? lineid : "null")).then((res) =>{
        return res
    })
}


export function getLineImage(id){
    return axios.get( "/productDigitalMedia/get?lineId=" + id).then((res) =>{
        return res
    })
}
export function uploadProductImageApi(formdata){
    return axios.post("/upload-image" ,formdata).then(res => {
        return res
    });
}

export function uploadBulkProductImageApi(formdata,params){
    const userId = JSON.parse(data).userId;
    return axios.post(`/productDigitalMedia/bulkSave`,formdata,{ params }).then(res=>{
        if(!res.data.errorExists){
            return axios.post( "/product/cacheProduct" ,JSON.stringify({"productId" : params.productId , "addImageCall" : true, "modelAddCall" : false , "productCreateCall" : false, userId}), {headers: {'Content-Type': 'application/json'}}).then((res) =>{
                if(!res.errorExists){
                    return res
                }
            })
        }
        else{
            return res
        }
    });
}


export function postProductImageApi(data, pid){
    const userId = JSON.parse(data).userId;
    return axios.post( "/productDigitalMedia/save" ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        if(!res.data.errorExists){
            return axios.post( "/product/cacheProduct" ,JSON.stringify({"productId" : pid , "addImageCall" : true, "modelAddCall" : false , "productCreateCall" : false, userId}), {headers: {'Content-Type': 'application/json'}}).then((res) =>{
                if(!res.data.errorExists){
                    return res
                }
            })
        }
        else{
           return res
        }
    });
}
