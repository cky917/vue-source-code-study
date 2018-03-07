import MyVue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from './utils/env'

initGlobalAPI(MyVue)

Object.defineProperty(MyVue.prototype, '$isServer', {
  get: isServerRendering
})

Object.defineProperty(MyVue.prototype, '$ssrContext', {
  get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

MyVue.version = '__VERSION__'
window.MyVue = MyVue

export default MyVue