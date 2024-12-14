export function setToken(token: string) {
  return localStorage.setItem('TOKEN', token);
}

export function getToken() {
  return localStorage.getItem('TOKEN');
}

export function clearToken() {
  return localStorage.clear();
}

export function setPart(partNumber: string, key?: string) {
  if (key) {
    return localStorage.setItem(key, partNumber);
  } else {
    return localStorage.setItem('pro-table', partNumber);
  }
}

export function getPart(key?: string) {
  if (key) {
    return localStorage.getItem(key);
  } else {
    return localStorage.getItem('pro-table');
  }
}

export const setThem = (t: string) => {
  return localStorage.setItem('them', t);
};
export const getThem = () => {
  return localStorage.getItem('them');
};
