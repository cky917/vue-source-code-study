import MyVue from './instance/index'
import { initGlobalAPI } from './global-api/index'

initGlobalAPI(MyVue)

window.MyVue = MyVue
export default MyVue