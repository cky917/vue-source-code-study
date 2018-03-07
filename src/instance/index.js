import { initMixin } from './init'
function MyVue(options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof MyVue)) {
    console.error('Vue is a constructor and should be called with the `new` keyword')
    return
  }
  this._init(options)
}
initMixin(MyVue)

export default MyVue