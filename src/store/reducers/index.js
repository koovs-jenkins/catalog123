import { combineReducers } from "redux";
import home from "./home";
import details from "./details";
import po from "./po";
import signin from "./signin";
import brand from "./brand";
import seo from "./seo";
import roles from "./roles";
import view from "./view";
import pcategory from "./parent_category";
import ccategory from "./child_category";
import attributetype from "./attributetype";
import attributevalue from "./attributevalue";
import product from "./product";
import productimage from "./productimage";
import tagging from "./tagging";
import addmeasurement from "./addmeasurement";
import productmeasure from "./productmeasure";
import order from "./order";
import callCenter from "./callCenter";
import pricing from "./pricing";
import genericpromo from "./genericpromo";
import userpromo from "./userpromo";
import promotionalpromo from "./promotionalpromo";
import sizeMap from "./sizeMap";
import logdata from "./productlogs";

export default combineReducers({
  home,
  details,
  po,
  signin,
  brand,
  roles,
  view,
  pcategory,
  ccategory,
  attributetype,
  attributevalue,
  product,
  productimage,
  addmeasurement,
  productmeasure,
  tagging,
  order,
  callCenter,
  pricing,
  genericpromo,
  userpromo,
  promotionalpromo,
  sizeMap,
  logdata,
  seo
});
