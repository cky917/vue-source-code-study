export function initLifecycle() {
  console.log('initLifecycle')
}

export function callHook(vm, msg) {
  console.log(`callHook:${msg}`)
}