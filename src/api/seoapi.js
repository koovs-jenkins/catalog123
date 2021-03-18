import axios from "axios";

export function getSeoDetail(id){
    return axios.get("/jarvis-home-service/internal/v1/home/metadata?url=&id=" + id).then((res) =>{
        return res
    })
}

export function getSeoList(searched_text="",status="", current_page="", page_size=10){
    return axios.get("/jarvis-home-service/internal/v1/home/metadata/list?search-key="+ searched_text +"&status=" + status + (current_page ? ("&page-size=" + page_size + "&page=" + current_page) : "")).then((res) =>{
        return res
    })
}

export function postSeoApi(data){
    return axios.post("/jarvis-home-service/internal/v1/home/metadata" ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}

export function putSeoApi(id,data){
    return axios.put("/jarvis-home-service/internal/v1/home/metadata" , data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}


export function patchSeoApi(id,data){
    return axios.get("/jarvis-home-service/internal/v1/home/metadata/activate/" + id +"?isActive=" + (data.isActive == 1 ? "true" : "false"), {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}