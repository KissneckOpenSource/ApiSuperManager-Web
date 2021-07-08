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
}

export default new databaseTools()