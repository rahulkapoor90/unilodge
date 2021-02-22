import Vue from 'vue'
import VueRouter from 'vue-router'
import QuickPay from './views/QuickPay.vue'
import Complete from './views/Complete.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/',  name: 'quick-pay', component: QuickPay },
  { path: '/complete',  name: 'complete', component: Complete },
]

const router = new VueRouter({
  routes
})

export default router
