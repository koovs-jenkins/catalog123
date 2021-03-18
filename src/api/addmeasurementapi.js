import axios from "axios";

export function getMeasurementDetail(id){
    return axios.get( "/modelSize/get/id/" + id).then((res) =>{
        return res
    })
}

export function getMeasurementList(searched_text="",status="", current_page="", page_size=1000){
    return axios.get( "/modelSize/getAll?name="+ searched_text +"&status=" + status + ("&pageSize=" + (page_size ? page_size : 1000) + "&pageNumber=" + (current_page ? current_page : 1))).then((res) =>{
        return res
    })
}

export function postMeasurementApi(data){
    return axios.post( "/modelSize/create" ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}

export function putMeasurementApi(id,data){
    return axios.put("/modelSize/update" , data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}


export function patchMeasurementApi(id,data){
    return axios.patch( "/modelSize/updateStatus/id/" + id ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}
