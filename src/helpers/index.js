import React from "react";
const uuidv1 = require("uuid/v1");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const makeid = () => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 30; i++)
    text += possible.charAt(
      Math.floor(Math.random() * Math.random() * possible.length)
    );

  return text;
};

export const findSpace = string => {
  return /^ *$/.test(string);
};

export function getDate(input = "") {
  const currentdate = input ? new Date(input) : new Date();
  const datetime =
    currentdate.getFullYear() +
    "-" +
    ("0" + (currentdate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + currentdate.getDate()).slice(-2);
  return datetime;
}

export function getTime(input = "") {
  const currentdate = input ? new Date(input) : new Date();
  const time =
    ("0" + currentdate.getHours()).slice(-2) +
    ":" +
    ("0" + currentdate.getMinutes()).slice(-2) +
    ":" +
    ("0" + currentdate.getSeconds()).slice(-2);
  return time;
}

export function getSunday(dateString) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const d = new Date(dateString);
  return days[d.getDay()] !== "Sunday";
}

export function getDateTime(input = "") {
  const currentdate = input ? new Date(input) : new Date();
  const datetime =
    currentdate.getFullYear() +
    "-" +
    ("0" + (currentdate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + currentdate.getDate()).slice(-2) +
    "T" +
    ("0" + currentdate.getHours()).slice(-2) +
    ":" +
    ("0" + currentdate.getMinutes()).slice(-2);
  return datetime;
}

export function viewDateTime(input = "") {
  const currentdate = input ? new Date(input) : new Date();
  const datetime =
    ("0" + currentdate.getDate()).slice(-2) +
    " " +
    monthNames[currentdate.getMonth()].slice(0, 3) +
    " " +
    currentdate.getFullYear() +
    " " +
    ("0" + currentdate.getHours()).slice(-2) +
    ":" +
    ("0" + currentdate.getMinutes()).slice(-2) +
    ":" +
    ("0" + currentdate.getSeconds()).slice(-2);
  return datetime;
}

export const getSelectedItem = (myArray, id, option = "") => {
  let arr = myArray.filter(v => v.value !== "" && v.value == id);
  return arr.length > 0 && arr[0].value !== ""
    ? option
      ? arr[0][option] || arr[0].label
      : arr[0].label
    : "NA";
};

export const removeArrayElement = (array, values) => {
  values.map(val => {
    var index = array.indexOf(val.toString());
    if (index > -1) {
      array.splice(index, 1);
    }
  });
  return array;
};

export const objectToString = (obj, arr = []) => {
  let string = "";
  for (let i in obj) {
    if (i == "status") {
      string = string + i + "=" + getSelectedItem(arr, obj[i]) + "<br />";
    } else {
      string = string + i + "=" + obj[i] + "<br />";
    }
  }
  return string;
};

export const isEmpty = data => {
  if (typeof data == "number" || typeof data == "boolean") {
    return false;
  }
  if (typeof data == "undefined" || data === null) {
    return true;
  }
  if (typeof data.length != "undefined") {
    return data.length == 0;
  }
  var count = 0;
  for (var i in data) {
    if (data.hasOwnProperty(i)) {
      count++;
    }
  }
  return count == 0;
};

export const hasProp = (obj, prop) => {
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (
        p === prop &&
        obj[p] !== "" &&
        obj[p] !== undefined &&
        obj[p] !== null
      ) {
        return obj;
      } else if (obj[p] instanceof Object && hasProp(obj[p], prop)) {
        return obj[p];
      }
    }
  }
  return null;
};

export const getDateWithMonthName = (input = "") => {
  const currentdate = input ? new Date(input) : new Date();
  const time = [
    monthNames[currentdate.getMonth()].slice(0, 3) +
      " " +
      currentdate.getDate(),
    currentdate
      .getFullYear()
      .toString()
      .slice(-2)
  ].join(", ");
  return time;
};

export function getCompleteDate(input = "", prefix = "00:00:00") {
  const currentdate = input ? new Date(input) : new Date();
  const datetime =
    ("0" + currentdate.getDate()).slice(-2) +
    "-" +
    ("0" + (currentdate.getMonth() + 1)).slice(-2) +
    "-" +
    currentdate.getFullYear() +
    " " +
    prefix;
  return datetime;
}

export function serialize(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p) && obj[p] != "") {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export function arraysIdentical(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function flattenArray(obj, field) {
  let data = [];
  for (let i in obj) {
    if (obj[i] != null) {
      obj[i].map(v => {
        v[field] = i;
        data.push(v);
      });
    } else {
      data.push({ [field]: i });
    }
  }
  return data;
}

export function validateData(arr) {
  for (let i = arr.length; i > 0; i--) {
    for (var key in arr[i]) {
      if (
        arr[i][key].trim() == "" &&
        Object.values(arr[i]).indexOf(arr[i][key]) == 0
      ) {
        arr.splice(i, 1);
        break;
      }
    }
  }
  return arr;
}

export function comaparePrevDate(input) {
  var d1 = new Date();
  var d2 = new Date(input);
  return d2.getTime() <= d1.getTime();
}

export function getCompleteDateTime(input = "") {
  const currentdate = input ? new Date(input) : new Date();
  const datetime =
    currentdate.getFullYear() +
    "-" +
    ("0" + (currentdate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + currentdate.getDate()).slice(-2) +
    " " +
    ("0" + currentdate.getHours()).slice(-2) +
    ":" +
    ("0" + currentdate.getMinutes()).slice(-2) +
    ":" +
    ("0" + currentdate.getSeconds()).slice(-2);
  return datetime;
}

export function validateCsvData(arr, header = []) {
  arr.filter((v, k) => {
    if (Object.values(v).length == 1) {
      arr.splice(k, 1);
    }
  });
  for (let i = 0; i < arr.length; i++) {
    for (let k in arr[i]) {
      if (arr[i][k].trim() == "") {
        return { error: true, line: i + 1 };
      }
      if (Object.values(arr[i]).length != header.length) {
        return { error: true, line: i + 1 };
      }
    }
  }
  return { error: false, line: 0 };
}

export const getCompleteDateMonth = (input = "") => {
  const currentdate = input ? new Date(input) : new Date();
  const time = [
    currentdate.getDate() +
      " " +
      monthNames[currentdate.getMonth()].slice(0, 3),
    currentdate.getFullYear() +
      " " +
      ("0" + currentdate.getHours()).slice(-2) +
      ":" +
      ("0" + currentdate.getMinutes()).slice(-2) +
      ":" +
      ("0" + currentdate.getSeconds()).slice(-2)
  ].join(", ");
  return time;
};

function iterator(param, result) {
  if (Array.isArray(param)) {
    param.map(v => iterator(v, result));
  } else if (typeof param == "object") {
    for (let i in param) {
      if (typeof param[i] != "object") {
        result[i] = param[i];
      } else {
        iterator(param[i], result);
      }
    }
  }
  return result;
}

export const serializeArray = arr => {
  let data = [];
  arr.map((v, k) => {
    let result = {};
    if (typeof v == "object") {
      for (let i in v) {
        if (typeof v[i] != "object") {
          result[i] = v[i];
        } else {
          iterator(v[i], result);
        }
      }
    }
    data[k] = result;
  });
  return data;
};

export const concat = (...args) => args.reduce((acc, val) => [...acc, ...val]);

export const deepMerge = (obj1, obj2) => {
  let result = {};
  for (let i in obj1) {
    if (obj2.hasOwnProperty(i)) {
      result[i] = concat(obj1[i], obj2[i]);
    } else {
      result[i] = obj1[i];
    }
  }
  return result;
};

export const cleanObject = obj => {
  for (let propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ""
    ) {
      delete obj[propName];
    }
  }
  return obj;
};

export const dataCombine = inputArr => {
  const result = {};
  inputArr.attributes.colors.map(v => {
    result[v.id] = v;
    result[v.id]["combine"] = [];
    inputArr.mapping.data.map(m => {
      if (m.colorId == v.id) {
        const sizes = inputArr.attributes.sizes.filter(
          s => m.sizeId == s.id
        )[0];
        const inventory = inputArr.quantity.data.filter(
          inv => inv.skuId == m.skuId
        )[0];
        result[v.id]["combine"].push({ ...m, ...sizes, inventory });
      }
    });
  });
  return result;
};

export const _get = (o, s) => {
  s = s.replace(/\[(\w+)\]/g, ".$1");
  s = s.replace(/^\./, "");
  var a = s.split(".");
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};

export const _set = (path, value) => {
  var schema = obj;
  var pList = path.split(".");
  var len = pList.length;
  for (var i = 0; i < len - 1; i++) {
    var elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    schema = schema[elem];
  }
  schema[pList[len - 1]] = value;
};

export const _queryParser = query => {
  const result = {};
  const str = query.substr(query.indexOf("?") + 1).split("&");
  str.map(v => {
    const strSplit = v.split("=");
    result[strSplit[0]] = strSplit[1];
  });
  return result;
};

export const viewPortHeight = top => {
  const viewPort = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  return top ? viewPort - top : viewPort;
};

const nodeParser = (obj, result, depth) => {
  if (!Array.isArray(obj)) {
    for (let i in obj) {
      result.push(
        typeof obj[i] == "object" && !isEmpty(obj[i]) ? (
          <ul key={uuidv1()}>{nodeParser(obj[i], result, depth + 1)}</ul>
        ) : (
          <li key={uuidv1()}>
            {i} :{" "}
            {Date.parse(obj[i]) && obj[i].length > 25
              ? viewDateTime(obj[i])
              : obj[i].toString()}
          </li>
        )
      );
    }
  }
};

export const parseList = obj => {
  const result = [];
  let depth = 0;
  nodeParser(obj, result, depth);
  return result;
};