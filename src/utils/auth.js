import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const timeKey = 'hrsaas-timestamp-key'
// token
export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
// Token失效的时间
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
export function setTimeStamp() {
  return Cookies.set(timeKey, Date.now())
}
