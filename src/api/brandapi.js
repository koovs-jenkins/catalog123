import axios from "axios";

export function getBrandDetail(id){
    return axios.get("/brand/get/id/" + id).then((res) =>{
        return res
    })
}

export function getBrandList(searched_text="",status="", current_page="", page_size=10){
    return axios.get("/brand/get/all?search="+ searched_text +"&status=" + status + (current_page ? ("&pageSize=" + page_size + "&pageNumber=" + current_page) : "")).then((res) =>{
        return res
    })
}

export function postBrandApi(data){
    return axios.post("/brand/create" ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}

export function putBrandApi(id,data){
    return axios.put("/brand/update" , data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}


export function patchBrandApi(id,data){
    return axios.patch("/brand/brandStatusUpdt/id/" + id ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}
