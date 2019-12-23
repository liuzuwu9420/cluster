// import Cookies from 'js-cookie'

export function getToken(TokenKey) {
  return window.localStorage.getItem(TokenKey)
}

export function setToken(TokenKey, token) {
  return window.localStorage.setItem(TokenKey, token)
}

export function removeToken(TokenKey) {
  return window.localStorage.removeItem(TokenKey)
}
