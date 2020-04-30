import Vue from 'vue'

import _ from 'lodash'
Vue.prototype._ = _

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import ace from 'ace-builds'

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters

import dataV from '@jiaminghi/data-view'

import { onInput } from './utils/format'

Vue.use(ace)
Vue.use(dataV)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false
/* 输入值为数字 */
const numberInput = {
  bind(el, binding, vnode) {
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener('input', onInput(el, ele, binding, vnode), false)
  }
}
Vue.directive('number-input', numberInput)

const vue = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

export default vue
