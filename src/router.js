import Vue from 'vue'
import VueRouter from 'vue-router'
import QuickPay from './views/QuickPay.vue'
import Complete from './views/Complete.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/complete',  name: 'complete', component: Complete },
  { path: '*',  name: 'quick-pay', component: QuickPay },

]

const router = new VueRouter({
  routes
})

export default router
