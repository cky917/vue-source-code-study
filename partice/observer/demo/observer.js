import { isObject } from '../util'
import { arrayMethods } from './array'
import Dep from './dep'
export function observe(value, asRootData) {
  // 如果不是对象，直接返回
  if (!isObject(value)) {
    return
  }
  let ob
  // 如果value对象上有__ob__属性，而且这个属性是Observer类的一个实例
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    // 否则ob为一个新的Oserver实例
    ob = new Observer(value)
  }
  // 如果是vm.$data, 那么 ob.vmCount++
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}
export function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

export class Observer {
  // value
  // dep
  // vmCount // number of vms that has this object as root $data
  constructor(value) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    // 让value的'__ob__'属性等于这个实例
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      // 第一次初始化时， obj: vm._data  keys[i]: key, obj[keys[i]]: value
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
  /**
   * Observe a list of Array items.
   */
  observeArray (items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
/**
 * Define a reactive property on an Object.
 */
export function defineReactive(obj, key, val, customSetter, shallow) {
  const dep = new Dep() // 该值的依赖收集器

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  const getter = property && property.get
  const setter = property && property.set

  let childOb = !shallow && observe(val) // 返回的是一个Observer实例

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) { // 当订阅者存在的时候，才进行依赖收集
        dep.depend() // 依赖收集，
        if (childOb) { // 深度watch
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) {
        // 如果值没有改变 或者类似 NaN !== NaN这种情况
        return
      }
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}

function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}