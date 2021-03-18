import axios from "axios";
import { xml2json } from "../../utils/xmlToJson";

let parser = new DOMParser();

export function getPoWithLocation(vendorId) {
  return axios
    .get(
      `/Koovs11augUATtest/OData/Company%28%27Koovs%20Live%27%29/Polist?$filter=vendorno%20eq%20%27` +
        vendorId +
        `%27%20& $format=json`
    )
    .then(res => JSON.parse(res.data.body));
}

export function getAsnList(vendorId) {
  return axios
    .get(
      `/Koovs11augUATtest/OData/Company(%27Koovs%20Live%27)/ASNList?$filter=Vendor_No%20eq%20%27` +
        vendorId +
        `%27%20& $format=json`
    )
    .then(res => JSON.parse(res.data.body));
}

export function getAsnDetails(data) {
  return axios
    .post("/Koovs11augUATtest/WS/Koovs%20Live/Page/Polist", data)
    .then(res => {
      let xmlDoc = parser.parseFromString(res.data.body, "text/xml");
      return JSON.parse(xml2json(xmlDoc, ""));
    });
}

export function postAsnDetailsApi(data) {
  return axios
    .post("/Koovs11augUATtest/WS/Koovs%20Live/Codeunit/NAVWebServices", data)
    .then(res => {
      let xmlDoc = parser.parseFromString(res.data.body, "text/xml");
      return JSON.parse(xml2json(xmlDoc, ""));
    });
}

export function getAsnDetailsByPono(data) {
  return axios
    .post("/Koovs11augUATtest/WS/Koovs%20Live/Page/ASNDoc", data)
    .then(res => {
      let xmlDoc = parser.parseFromString(res.data.body, "text/xml");
      return JSON.parse(xml2json(xmlDoc, ""));
    });
}
