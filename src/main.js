import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { Security } from './js/Constant'
// import VueLoading from 'vue-loading-overlay'
// import 'vue-loading-overlay/dist/css/index.css'

const app = createApp(App)

window.AMapSecurityConfig = {
    securityJsCode: Security
};

// app.use(VueLoading)
app.use(ElementPlus)
app.mount('#app')

