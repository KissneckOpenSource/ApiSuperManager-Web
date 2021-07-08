import axios from '@/libs/api.request'

/**
 * 获取字段数据
 * @returns {wx.RequestTask | never}
 */
export const getDataType = (params) => {
  return axios.request({
    url: 'Fields/index',
    method: 'get',
    params: params
  })
} 

export const upJson = (data) => {
  return axios.request({
    url: 'SaasDoc/upload',
    method: 'post',
    data
  })
}

export const del = (id) => {
  return axios.request({
    url: 'SaasDoc/delField',
    method: 'get',
    params: {
      id: id
    }
  })
}

/**
 * 新增字段
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'SaasDoc/addFields',
    method: 'post',
    data
  })
}

/**
 * 编辑字段
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'SaasDoc/editField',
    method: 'post',
    data
  })
}

export const getResponse = (params) => {
  return axios.request({
    url: 'SaasDoc/response',
    method: 'get',
    params: params
  })
}

export const getRequest = (params) => {
  return axios.request({
    url: 'SaasDoc/responseApi',
    method: 'get',
    params: params
  })
}