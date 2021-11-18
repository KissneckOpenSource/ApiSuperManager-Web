import config from '@/config'
import axios from 'axios'
import iView from 'view-design'
import { setToken, getToken } from '@/libs/util'
import router from '@/router'
// config.baseUrl.pro + 'admin/'
export const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev +'admin/': 'https://apism.api.kissneck.com/admin/'

class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }

  interceptors (instance) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      const { data, status } = res
      if (data.code < 0) {
        if (data.code === -14) {
          setToken('')
          router.push({ name: 'login' })
        } else {
          iView.Message.error(data.msg)
        }
        throw new Error(data.msg)
      } else {
        return { data, status }
      }
    }, error => {
      console.log('error',error)
      if(error && error.data && error.data.message){
        return { data, status }
      }
      return Promise.reject(error)
    })
  }

  request (options) {
    const instance = axios.create()
    let apiAuth = getToken()
    if (apiAuth === false) {
      options = Object.assign({
        baseURL: this.baseUrl,
        headers: {}
      }, options)
    } else {
      options = Object.assign({
        baseURL: this.baseUrl,
        headers: {
          'Api-Auth': apiAuth
        }
      }, options)
    }
    // console.log('request')
    this.interceptors(instance)
    return instance(options)
  }

  refreshRequest (baseUrl, options) {
    const instance = axios.create()
    let apiAuth = getToken()
    if (apiAuth === false) {
      options = Object.assign({
        baseURL: baseUrl,
        headers: {}
      }, options)
    } else {
      options = Object.assign({
        baseURL: baseUrl,
        headers: {
          'Api-Auth': apiAuth
        }
      }, options)
    }
    
    this.interceptors(instance)
    return instance(options)
  }
}

const api_axios = new HttpRequest(baseUrl)
export default api_axios
