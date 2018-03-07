/* @flow */

import { mergeOptions } from '../util/index'
// https://cn.vuejs.org/v2/api/#Vue-mixin
// 全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。插件作者可以使用混入，向组件注入自定义的行为。不推荐在应用代码中使用。
export function initMixin(Vue) {
  Vue.mixin = function(mixin) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
