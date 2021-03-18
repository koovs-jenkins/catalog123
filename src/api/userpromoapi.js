import axios from "axios";

export function getUserPromoDetail(id){
    return axios.get("/rules/v1/promotion/code/"+ id ).then((res) =>{
        return res
    })
}

export function getUserPromoList(searched_text="",status="", current_page="", page_size=10){
    return axios.get("/rules/v1/promotion/code?genre=user&searchKey="+ searched_text +"&searchParam=" + status + (current_page ? ("&pageSize=" + page_size + "&page=" + (parseInt(current_page) - 1)) : "")).then((res) =>{
        return res
    })
}

export function postUserPromoApi(data){
    return axios.post("/rules/v1/promotion/code" ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}


export function postMultiUserPromoApi(data){
    return axios.post("/rules/v1/promotion/code/bulk" ,data).then(res => {
        return res
    });
}

export function putUserPromoApi(id,data){
    return axios.put("/rules/v1/promotion/code" , data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}


export function patchUserPromoApi(id,data){
    return axios.patch("" + id ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}
