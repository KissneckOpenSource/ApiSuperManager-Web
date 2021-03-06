import axios from '@/libs/api.request'

/**
 * 获取接口组数据
 * @returns {wx.RequestTask | never}
 */
export const getHash = () => {
  return axios.request({
    url: 'InterfaceList/getHash',
    method: 'get'
  })
}

/**
 * 刷新路由
 * @returns {wx.RequestTask | never}
 */
export const refresh = (baseUrl, params) => {
  return axios.refreshRequest(baseUrl, {
    url: 'SaasDoc/refresh',
    method: 'get',
    params
  })
}

/**
 * 获取接口数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (data) => {
  return axios.request({
    url: 'SaasDoc/index',
    method: 'post',
    data
  })
}

export const del = (hash) => {
  return axios.request({
    url: 'SaasDoc/del',
    method: 'get',
    params: {
      hash: hash
    }
  })
}

/**
 * 启用/禁用接口
 * @param status
 * @param hash
 * @returns {wx.RequestTask | never}
 */
export const changeStatus = (status, hash) => {
  return axios.request({
    url: 'SaasDoc/changeStatus',
    method: 'get',
    params: {
      status: status,
      hash: hash
    }
  })
}

/**
 * 新增接口
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'SaasDoc/add',
    method: 'post',
    data
  })
}

/**
 * 编辑接口
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'SaasDoc/edit',
    method: 'post',
    data
  })
}

/**
 * 获取全部应用
 */
export const getAppList = (params) => {
  return axios.request({
    url: 'SaasDoc/group',
    method: 'get',
    params: params
  })
}

/**
 * 创建文件
 */
export const createFile = (data) => {
  return axios.request({
    url: 'SaasDoc/createFunc',
    method: 'post',
    data
  })
}

/**
 * 获取列表【筛选项】
 * @param data
 * @returns {wx.RequestTask | never}
 */
 export const getAll = () => {
  return axios.request({
    url: 'SaasDoc/group',
    method: 'get'
  })
}
