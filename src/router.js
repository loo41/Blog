import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'

Vue.use(Router)

const router =  new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/view',
      name: 'view',
      component: resolve => require(['@/views/View.vue'], resolve)
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/view' && !store.state.article.length) {
    store.commit('getSetArticle')
  }
  next()
})

export default router
