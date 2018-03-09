import Dep, { pushTarget, popTarget } from './dep'
import { parsePath, isObject } from './util'
import { traverse } from './traverse'
let uid = 0
export default class Watcher { 
  constructor (vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm
    // if (isRenderWatcher) {
    //   vm._watcher = this
    // }
    vm._watchers.push(this)

    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid
    this.active = true
    this.dirty = this.lazy
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      // eg: 'a.b.c'
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function() {}
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }
  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get() {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (error) {
      if (this.user) {
        console.error(`getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
  // 添加依赖
  addDep(dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  cleanupDeps() {
    let i = this.deps.length
    while(i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
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
  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
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
  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
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
  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  /**
   * Depend on all deps collected by this watcher.
   */
  depend() {
    let i = this.deps.length
    while(i--) {
      this.deps[i].depend()
    }
  }

  teardown() {
    if (this.active) {
      // if (!this.vm._isBeingDestroyed) {
      //   remove(this.vm._watchers, this)
      // }
      let i = this.deps.length
      while(i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}