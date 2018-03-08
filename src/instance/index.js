import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../utils/index'

function MyVue(options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof MyVue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
    return
  }
  this._init(options)
}
initMixin(MyVue)
stateMixin(MyVue)
eventsMixin(MyVue)
lifecycleMixin(MyVue)
renderMixin(MyVue)

export default MyVue