import axios from '@/libs/wiki.request'

/**
 *
 * @param username
 * @param password
 * @returns {never}
 */
export const errorCode = () => {
  return axios.request({
    url: 'Api/errorCode',
    method: 'get'
  })
}

export const apiGroup = (params) => {
  return axios.request({
    url: 'Api/groupList',
    method: 'get',
    params
  })
}

/**
 * 获取接口详情
 * @param params
 * @returns {wx.RequestTask | never}
 */
export const detail = (params) => {
  return axios.request({
    url: 'Api/detail',
    method: 'get',
    params
  })
}

/**
 * 更新接口代码
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const updateCode = (data) => {
  return axios.request({
    url: 'Api/detail',
    method: 'post',
    data
  })
}

/**
 * 用户登录
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const login = (data) => {
  return axios.request({
    url: 'Api/login',
    method: 'post',
    data
  })
}

/**
 * 用户登出
 * @returns {wx.RequestTask | never}
 */
export const logout = () => {
  return axios.request({
    url: 'Api/logout',
    method: 'get'
  })
}


// 文档说明
export const getDocMenu = () => {
  return axios.request({
    url: 'Api/getDocMenu',
    method: 'get'
  })
}

export const cr_md = (id) => {
  return axios.request({
    url: 'Api/createDoc',
    method: 'get',
    params: id
  })
}
