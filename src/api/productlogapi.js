import axios from "axios";

export function getProductLog(id,pageNumber){
    return axios.get("/product/getAuditLogs?pageSize=10&pageNumber="+ pageNumber +"&productId="+id).then((res) =>{
        return res
    })
}

