import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { Security } from './js/Constant'
// import router from './router/router.js'
// import VueLoading from 'vue-loading-overlay'
// import 'vue-loading-overlay/dist/css/index.css'

const app = createApp(App)

window._AMapSecurityConfig = {
    securityJsCode: Security
};

// app.use(VueLoading)
app.use(ElementPlus)
// app.use(router)
app.mount('#app')

