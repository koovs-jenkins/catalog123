import axios from "axios";

export function getRolesList(searched_text="",status="", current_page="", page_size=10){
  return axios
    .get(
      `/getRoleList`
    )
    .then(res => {
      // res = JSON.parse(res)
      return res.data
      });
    // return axios.get("/brand/get/all?search="+ searched_text +"&status=" + status + (current_page ? ("&pageSize=" + page_size + "&pageNumber=" + current_page) : "")).then((res) =>{
    //   console.log('inside roles APi')
    //     return res
    // })
}
