import axios from 'axios'
import jsCookie from 'js-cookie'


const request = axios.create({
//   baseURL: 'http://127.0.0.1:5000',
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(config => { 
    const token = jsCookie.get('token')
    if (token) {
      config.headers['token'] = token
    }
    return config

})

// 响应拦截器
request.interceptors.response.use(response => {
  return response.data
})


export default request