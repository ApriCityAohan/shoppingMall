import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import 'virtual:windi.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission'
import 'nprogress/nprogress.css'
createApp(App)
    .use(router)
    .use(store)
    .use(ElementPlus, {
        locale: zhCn
    })
    .mount('#app')
