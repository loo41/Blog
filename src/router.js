import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Main from './views/Main.vue'
import Home from './views/Home.vue'

Vue.use(Router)

const router =  new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/pc',
      name: 'pc',
      component: Home
    },
    {
      path: '/view',
      name: 'view',
      component: resolve => require(['@/views/View.vue'], resolve)
    },
    {
      path: '/mobile',
      name: 'mobile',
      component: resolve => require(['@/views/M.vue'], resolve)
    },
    {
      path: '/m-view',
      name: 'm-view',
      component: resolve => require(['@/views/M-View.vue'], resolve)
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (!store.state.article.length) {
    store.commit('getSetArticle')
  }
  if (JSON.stringify(store.state.userInfo) == '{}') {
    store.dispatch('getUserInfo')
  }
  next()
})

export default router
