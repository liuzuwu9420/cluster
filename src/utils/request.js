import axios from 'axios'
import store from '@/store'
// import Jsrsasign from 'jsrsasign'
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
      /* var isValid = Jsrsasign.KJUR.jws.JWS.verifyJWT('eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzeXN0ZW0iLCJzdWIiOiJ7XCJVc2VybmFtZVwiOlwicm9vdFwifSIsImV4cCI6MTU3MjQwMDQxNCwiaWF0IjoxNTcyMzk5ODE0LCJqdGkiOiIzOWM5OGJiMC0yZjFjLTQzOWEtYjkwOC0wZDY4YzkwN2ZiYjcifQ.-MHA3-J-vJVmt_VeS8TEYuJqQtUr2gwZ5DdYR5OJNC8', '', { alg: ['HS256'] })
      console.log(isValid) */
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers.Authorization = getToken()
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
      if (response.status === 201) {
        return res
      } else {
        return Promise.reject(res)
      }
    }
    return res
  }, (error) => {
    if (error.response.status === 401) {
      return false
    }
    return Promise.reject(error)
  }
)

export default service

