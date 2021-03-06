import axios from '@/libs/api.request'

/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'SaasDoc/saasGroupIndex',
    method: 'get',
    params: params
  })
}

export const del = (id) => {
  return axios.request({
    url: 'SaasDoc/saasGroupDel',
    method: 'get',
    params: { 
      id: id
    }
  })
}

/**
 * 显示/隐藏应用组
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const changeStatus = (status, id) => {
  return axios.request({
    url: 'SaasDoc/saasChangeStatus',
    method: 'get',
    params: {
      status: status,
      id: id
    }
  })
}

/**
 * 获取列表【筛选项】
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const getAll = () => {
  return axios.request({
    url: 'InterfaceGroup/getAll',
    method: 'get'
  })
}

/**
 * 新增应用组
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'SaasDoc/saasGroupAdd',
    method: 'post',
    data
  })
}

/**
 * 编辑应用组
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'SaasDoc/saasGroupEdit',
    method: 'post',
    data
  })
}
