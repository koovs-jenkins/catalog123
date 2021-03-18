export function setLocalStorage(key, data) {
	return localStorage.setItem(key, JSON.stringify(data));
}

export function getLocalStorage(key) {
	return localStorage.getItem(key);
}

export function removeLocalStorage(key){
	return localStorage.removeItem(key);
}

export function setCookie(key, data){
	return document.cookie = key + "=" + data
}

export function deleteCookie(key) {
   return document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export function getCookie(key) {
  var name = key + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
