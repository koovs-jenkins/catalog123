import axios from "axios";


export function getAttributeTypeDetail(id){
    return axios.get( "/attributeType/getValues/id/" + id).then((res) =>{
        return res
    })
}

export function getAttributeTypeList(searched_text="",status="", current_page="", page_size=10){
    return axios.get( "/attributeType/getAll?search="+ searched_text +"&status=" + status + (current_page ? ("&pageSize=" + page_size + "&pageNumber=" + current_page) : "")).then((res) =>{
        return res
    })
}

export function getEnum(){
    return axios.get( "/category/getEnum").then((res) =>{
        return res
    })
}

export function postAttributeTypeApi(data){
    return axios.post( "/attributeType/create" ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}

export function putAttributeTypeApi(id,data){
    return axios.put("/attributeType/update" , data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}


export function patchAttributeTypeApi(id,data){
    return axios.patch("/attributeType/updateStatus/id/" + id ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}
