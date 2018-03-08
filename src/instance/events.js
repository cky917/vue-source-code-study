export function initEvents() {
  console.log('initEvents')
}
export function eventsMixin(Vue) {
  Vue.prototype.$on = function() {
    console.log('$on')
  }

  Vue.prototype.$once = function() {
    console.log('$once')
  }

  Vue.prototype.$off = function() {
    console.log('$off')
  }

  Vue.prototype.$emit = function(event) {
    console.log('$emit')
  }
}