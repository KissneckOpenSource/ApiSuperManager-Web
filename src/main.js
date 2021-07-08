import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'view-design'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import './index.less'
import '@/assets/icons/iconfont.css'

// vue-mouse-menu
import menu from 'vue-mouse-menu' 
Vue.use(menu);

//lodash
import _ from 'lodash'
Vue.prototype._ = _

// 拖拽·缩放·画布插件
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
Vue.component('vue-draggable-resizable', VueDraggableResizable)


Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

// 挂载全局使用的方法
Vue.prototype.hasRule = (access) => {
  return new Promise((resolve, reject) => {
    try {
      store.dispatch('getUserInfo').then(user => {
        resolve(user.access && user.access.includes('admin/' + access))
      })
    } catch (error) {
      reject(error)
    }
  })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
