import { observe } from './observer'
import Watcher from './watcher'
function Vue3(options) {
  this._init(options)
}

Vue3.prototype._init = function(options) {
  const vm = this
  vm.$options = options || {}
  vm._watchers = []
  if (vm.$options.data) initData(vm)
}
function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}

  // ...省略data的校验步骤
  const keys = Object.keys(data)
  let i = keys.length
  while (i--) {
    const key = keys[i]
    // ...省略data的key值校验步骤
    // 遍历 data 的 key，把 data 上的属性代理到 vm 实例上
    proxy(vm, '_data', key)
  }
  observe(data, true /* asRootData */)
}

// https://cn.vuejs.org/v2/api/#vm-watch
Vue3.prototype.$watch = function (expOrFn, cb, options) {
  const vm = this
  // if (isPlainObject(cb)) {
  //   return createWatcher(vm, expOrFn, cb, options)
  // }
  options = options || {}
  options.user = true
  const watcher = new Watcher(vm, expOrFn, cb, options)
  if (options.immediate) {
    cb.call(vm, watcher.value)
  }
  return function unwatchFn() {
    watcher.teardown()
  }
}

function getData(data, vm) {
  try {
    return data.call(vm, vm)
  } catch (e) {
    console.error(e)
    return {}
  }
}
function noop() {}

function proxy(target, sourceKey, key) {
  const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  }
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

window.Vue3 = Vue3