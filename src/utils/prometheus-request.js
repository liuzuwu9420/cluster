import axios from 'axios'
import { getAddressIP } from './address'

const address = getAddressIP('prometheus.address')
const BASE_API = `http://${address}/api/v1`
// create an axios instance
const service = axios.create({
  baseURL: BASE_API // url = base url + request url
})

// request interceptor
service.interceptors.request.use(
  config => {
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
      return Promise.reject(res)
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
