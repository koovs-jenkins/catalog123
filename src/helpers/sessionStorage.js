export function setSessionStorage(key, data) {
  return sessionStorage.setItem(key, JSON.stringify(data));
}

export function getSessionStorage(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

export function removeSessionStorage(key) {
  return sessionStorage.removeItem(key);
}
