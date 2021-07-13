import {
    login,
    logout,
    getUserInfo
  } from '@/api/user'
  import { resetRouter } from '@/router'
  import { setToken, getToken } from '@/libs/util'
  import { filterAsyncRouter } from '@/libs/router-utils'
  
  export default {
    state: {
        choosenFirstLevel:{},// 选中的树一级
        choosenSecondLevel:{},// 选中的树二级
        choosenThirdLevel:{},// 选中的树三级
    },
    mutations: {
     
    },
    actions: {
      
    }
  }
  