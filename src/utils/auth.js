import jsCookie from "js-cookie";

const TokenKey = 'pingfen-login-token'
const RateIdKey = 'pingfen-rate-id'



export function getToken() {
    return jsCookie.get(TokenKey)
}

export function setToken(value, options = {expires: 1}) {
    jsCookie.set(TokenKey, value, options)
}

export function removeToken() {
    jsCookie.remove(TokenKey)
}


export function getRateId() {
    return jsCookie.get(RateIdKey)
}

export function setRateId(value, options = {expires: 1}) {
    jsCookie.set(RateIdKey, value, options)
}

export function removeRateId() {
    jsCookie.remove(RateIdKey)
}