export default class Watcher {
  constructor() {
    console.log('new Watcher')
  }
  /**
   * Remove self from all dependencies' subscriber list.
   */
  teardown () {
    console.log('watcher is teardown')    
  }
}