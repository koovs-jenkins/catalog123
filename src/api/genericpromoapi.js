import axios from "axios";

export function getGenericPromoDetail(id){
    return axios.get("/rules/v1/promotion/code/"+ id ).then((res) =>{
        return res
    })
}

export function getGenericPromoList(searched_text="",status="", current_page="", page_size=10){
    return axios.get("/rules/v1/promotion/code?genre=generic&searchKey="+ searched_text +"&searchParam=code"+ (current_page ? ("&pageSize=" + page_size + "&page=" + (parseInt(current_page) - 1)) : "")).then((res) =>{
        return res
    })
}

export function postGenericPromoApi(data){
    return axios.post("/rules/v1/promotion/code" ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}

export function putGenericPromoApi(id,data){
    return axios.put("/rules/v1/promotion/code" , data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}


export function patchGenericPromoApi(id,data){
    return axios.patch("" + id ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}
