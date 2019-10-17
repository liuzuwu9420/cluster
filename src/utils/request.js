import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'



// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  //timeout: 5000 // request timeout
  /* headers: {  
    "Content-Type": "application/x-www-form-urlencoded"
  } */
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      //config.headers['X-Token'] = getToken()
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
    if(response.status !== 200) {
      return Promise.reject(response);
    }
    return response;
  }, (error) => {
    return Promise.reject(error);
  }
)

export default service







// axios 配置
//axios.defaults.timeout = 5000;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//axios.defaults.withCredentials = false;
//axios.defaults.baseURL = process.env.VUE_APP_BASE_API;
// axios.defaults.headers.common['Authorization'] = 'Basic ';

/*
 * 请求、响应拦截器
 * */
/* 
//POST传参序列化
axios.interceptors.request.use((config) => {
	if(config.method === 'post') {

    let token = sessionStorage.getItem('venture-token');
		if(token) {
			// axios.defaults.headers.common['Authorization'] +=token;
			config.data = config.data || {};
			config.data.token = token;
    }
		//config.data = qs.stringify(config.data);
  }
  console.log(config)
	return config;
}, (error) => {
	return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use((res) => {
	if(res.status !== 200) {
		return Promise.reject(res);
	}
	return res;
}, (error) => {
	return Promise.reject(error);
});

export function fetch(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(url, params)
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err);
			})
			.catch((error) => {
				reject(error)
			})
	})
}

 */







