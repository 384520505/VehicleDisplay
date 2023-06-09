import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import VueLoading from 'vue-loading-overlay'
// import 'vue-loading-overlay/dist/css/index.css'

const app = createApp(App)

// app.use(VueLoading)
app.use(ElementPlus)
app.mount('#app')

