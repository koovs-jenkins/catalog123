import axios from "axios";

export function getAttributeValueDetail(id){
    return axios.get( "/attrValue/getValues/id/" + id).then((res) =>{
        return res
    })
}

export function getAttributeValueList(attr_id,searched_text="",status="", current_page="", page_size=10){
    return axios.get( "/attributeType/getValues/id/"+ attr_id + (current_page ? ("&pageSize=" + page_size + "&pageNumber=" + current_page) : "")).then((res) =>{
        return res
    })
}

export function postAttributeValueApi(data){
    return axios.post( "/attrValue/createAttrValues" ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}

export function putAttributeValueApi(id,data){
    return axios.put("/attrValue/updateAttrValues" , data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}


export function patchAttributeValueApi(id,data){
    return axios.patch( "/attrValue/updateStatus/id/" + id ,data, {headers: {'Content-Type': 'application/json'}}).then(res => {
        return res
    });
}
