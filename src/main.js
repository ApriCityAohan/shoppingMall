import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'virtual:windi.css'
import App from './App.vue'
import { router } from './router'
import store from './store'
import './permission'
import 'nprogress/nprogress.css'
import permission from '~/directive/permission.js'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
    .use(store)
    .use(ElementPlus, {
        locale: zhCn
    })
    .use(permission)
    .mount('#app')
