import VueRouter from 'vue-router';

import Home from '../components/Home.vue';
import Map from '../components/Map.vue';

const routes = [
    { path: '/home', component: Home },
    { path: '/map', component: Map }
]
  
const router = new VueRouter({
    routes
})
  
export default router

