import { parsePath, isObject, remove } from '../util'
let uid = 0
import { pushTarget, popTarget } from './dep'
export default class Watcher { 
  constructor (vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm
    vm._watchers.push(this)
    // options
    this.cb = cb
    this.id = ++uid
    this.active = true
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production' ? expOrFn.toString() : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      // eg: 'a.b.c'，parsePath方法返回了一个函数，接收obj参数，然后返回obj[a][b][c]的值
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function() {}
      }
    }
    this.value = this.get()
  }
  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get() {
    // 执行get()方法的时候，将这个watcher实例赋值给Dep.target，表示这个订阅者正在进行读取该值
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      // 读取vm上的指定属性，从而触发该属性的getter
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        console.error(`getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      if (this.deep) {
        traverse(value)
      }
      // 将这个watcher取出
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
  // 添加依赖
  addDep(dep) {
    // 某值的依赖收集器实例，如果这个依赖没有被收集过，则添加
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }
  // 清理老旧的依赖，把新的依赖传给depIds,然后置空newDepIds， deps与newDeps同理
  cleanupDeps() {
    let i = this.deps.length
    while(i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        // 删除依赖
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
  update() {
    // if(this.lazy) {
    //   this.dirty = true
    // } else if (this.sync) {
    //   this.run()
    // } else {
    this.run()
      // queueWatcher(this)
    // }
  }
  run() {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        isObject(value) ||
        this.deep
      ) {
        const oldValue = this.value
        this.value = value
        this.cb.call(this.vm, value, oldValue)
      }
    }
  }
  teardown() {
    if (this.active) {
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while(i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}