import axios from "axios";

export function getPCategoryDetail(id){
    return axios.get("/category/get/id/" + id).then((res) =>{
        return res
    })
}

export function getPCategoryList(searched_text="",status="", current_page="", page_size=10){
    return axios.get("/category/get/superCategory?search="+ searched_text +"&status=" + status +(current_page ? ("&pageSize=" + page_size + "&pageNumber=" + current_page) : "")).then((res) =>{
        return res
    })
}

export function postPCategoryApi(data){
    return axios.post("/category/save" ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}

export function putPCategoryApi(id,data){
    return axios.put("/category/update" , data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}


export function patchPCategoryApi(id,data){
    return axios.patch("/category/updateStatus/id/" + id ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}
