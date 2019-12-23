import axios from 'axios'
import store from '@/store'
import router from '@/router'
import Jsrsasign from 'jsrsasign'
import { getToken } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // withCredentials: false // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
  /**
   *  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  } */
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // { utf8: '12345678' } 和 { b64: 'MTIzNDU2Nzg=' }两种验证格式
      var isValid = Jsrsasign.KJUR.jws.JWS.verifyJWT(getToken('Admin-Token'), { b64: 'MTIzNDU2Nzg=' }, { alg: ['HS256'], gracePeriod: 60 })
      if (isValid) {
        config.headers.Authorization = 'Bearer ' + getToken('Admin-Token')
      } else {
        /* var jwt = Jsrsasign.KJUR.jws.JWS.parse(getToken('Admin-Token'))
        console.log(jwt) */
        console.log(isValid)
        store.dispatch('user/logout')
        router.push(`/login?redirect=/dashboard`)
      }
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      // config.headers.Authorization = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.status !== 200) {
      if (response.status === 201 || response.status === 202) {
        return res
      } else {
        return Promise.reject(res)
      }
    }
    return res
  }, (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        return false
      }
      return Promise.reject(error)
    } else {
      return Promise.reject(error)
    }
  }
)

export default service

