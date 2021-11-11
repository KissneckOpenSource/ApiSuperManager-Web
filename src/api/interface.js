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

export const create_md = (hash) => {
  return axios.request({
    url: 'InterfaceList/createDoc',
    method: 'get',
    params: {
      id: hash
    }
  })
}
/**
 * 刷新路由
 * @returns {wx.RequestTask | never}
 */
export const refresh = (params) => {
  return axios.request({
    url: 'InterfaceList/refresh',
    method: 'get',
    params
  })
}

/**
 * 获取接口数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'InterfaceList/index',
    method: 'get',
    params: params
  })
}

export const del = (hash) => {
  return axios.request({
    url: 'InterfaceList/del',
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
    url: 'InterfaceList/changeStatus',
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
    url: 'InterfaceList/add',
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
    url: 'InterfaceList/edit',
    method: 'post',
    data
  })
}

/**
 * 获取全部应用
 */
export const getAppList = (params) => {
  return axios.request({
    url: 'InterfaceList/group',
    method: 'get',
    params: params
  })
}

/**
 * 创建文件
 */
export const createFile = (data) => {
  return axios.request({
    url: 'InterfaceList/createFunc',
    method: 'post',
    data
  })
}
