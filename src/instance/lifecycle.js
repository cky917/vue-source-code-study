export function initLifecycle() {
  console.log('initLifecycle')
}

export function callHook(vm, msg) {
  console.log(`callHook:${msg}`)
}

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function () {
    console.log('_update')
  }
  Vue.prototype.$forceUpdate = function() {
    console.log('$forceUpdate')
  }
  Vue.prototype.$destroy = function () {
    console.log('$destroy')
  }
}