import { observe } from './observer'
import { isPlainObject } from './util'
import Watcher from './watcher'

function Vue2(options) {
  this._init(options)
}

Vue2.prototype._init = function (options) {
  const vm = this
  vm.$options = options || {}
  vm._watchers = []
  if (vm.$options.data) initData(vm)
}
// https://cn.vuejs.org/v2/api/#vm-watch
Vue2.prototype.$watch = function (expOrFn, cb, options) {
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

function createWatcher(vm, keyOrFn, handler, options) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(keyOrFn, handler, options)
}

function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
 
  // ...省略data的校验步骤
  const keys = Object.keys(data)
  let i = keys.length
  while(i--) {
    const key = keys[i]
    // ...省略data的key值校验步骤
    // 遍历 data 的 key，把 data 上的属性代理到 vm 实例上
    proxy(vm, '_data', key)
  }
  observe(data, true /* asRootData */)
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

window.Vue2 = Vue2