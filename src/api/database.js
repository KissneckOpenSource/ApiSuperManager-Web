import axios from '@/libs/api.request'

class databaseTools {
  constructor(){

  }

  /**
   * 获取数据库列表
   * @param username
   * @param password
   * @returns {never}
   */
  getDatabaseList(params) {
    return axios.request({
      url: 'CustomDataBase/databaseList',
      method: 'get',
      params:{
        page:1,
        size:9999
      }
    })
  }
  /**
   * 获取表列表
   * @param username
   * @param password
   * @returns {never}
   */
  getTableList(params) {
    return axios.request({
      url: 'CustomDataBase/designTableList',
      method: 'get',
      params
    })
  }
  /**
   * 创建数据库
   * @param username
   * @param password
   * @returns {never}
   */
   createDatabase(data) {
    return axios.request({
      url: 'CustomDataBase/addDatabase',
      method: 'post',
      data
    })
  }

  /**
   * 创建数据表
   * @param username
   * @param password
   * @returns {never}
   */
   createTable(data) {
    return axios.request({
      url: 'CustomDataBase/addDesignTable',
      method: 'post',
      data
    })
  }

  /**
   * 编辑数据表
   * @param username
   * @param password
   * @returns {never}
   */
   editTable(data) {
    return axios.request({
      url: 'CustomDataBase/editDesignTable',
      method: 'post',
      data
    })
  }

  /**
   * 编辑数据库模型
   * @param username
   * @param password
   * @returns {never}
   */
   editDatabase(data) {
    return axios.request({
      url: 'CustomDataBase/editDatabase',
      method: 'post',
      data
    })
  }

  /**
   * 删除数据库模型
   * @param username
   * @param password
   * @returns {never}
   */
   delDatabase(data) {
    return axios.request({
      url: 'CustomDataBase/delDatabase',
      method: 'post',
      data
    })
  }
  /**
   * 删除数据表
   * @param username
   * @param password
   * @returns {never}
   */
   delTable(params) {
    return axios.request({
      url: 'CustomDataBase/delDesignTable',
      method: 'get',
      params
    })
  }
  /**
   * 删除数据库模型
   * @param username
   * @param password
   * @returns {never}
   */
   getProperty(params) {
    return axios.request({
      url: 'CustomDataBase/designColumnList',
      method: 'get',
      params
    })
  }

  /**
   * 修改字段
   * @param username
   * @param password
   * @returns {never}
   */
   addField(data) {
    return axios.request({
      url: 'CustomDataBase/addDesignColumn',
      method: 'post',
      data
    })
  }

  /**
   * 修改字段
   * @param username
   * @param password
   * @returns {never}
   */
   editField(data) {
    return axios.request({
      url: 'CustomDataBase/editDesignColumn',
      method: 'post',
      data
    })
  }

  /**
   * 删除字段
   * @param username
   * @param password
   * @returns {never}
   */
   delField(params) {
    return axios.request({
      url: 'CustomDataBase/delDesignColumn',
      method: 'get',
      params
    })
  }
}

export default new databaseTools()