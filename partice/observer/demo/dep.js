import { remove} from '../util'
let uid = 0
export default class Dep {
  constructor () {
    this.id = uid++
    this.subs = []
  }
  addSub (sub) {
    this.subs.push(sub)
  }
  removeSub (sub) {
    remove(this.subs, sub)
  }
  depend () {
    // 检查当前Dep.target是否存在以及判断这个watcher已经被添加到了相应的依赖当中，如果没有则添加订阅者(依赖)，如果已经被添加了那么就不做处理
    if (Dep.target) {
      // Dep.target为一个watcher
      Dep.target.addDep(this)
    }
  }
  notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

export function pushTarget (_target) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}