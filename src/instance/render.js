export function initRender() {
  console.log('initRender')
}

export function renderMixin(Vue) {
  Vue.prototype.$nextTick = function(fn) {
    console.log('$nextTick')
  }
  Vue.prototype._render = function() {
    console.log('_render')
  }
}