import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueTouchRipple from 'vue-touch-ripple'
import 'vue-touch-ripple/dist/vue-touch-ripple.css'
import vucInput from 'vuc-input'
import vucPictureContrast from 'vuc-picture-contrast'
import VueMarkdown from 'vue-markdown'


Vue.use(vucPictureContrast)
Vue.use(VueMarkdown)
Vue.use(vucInput)
Vue.use(VueTouchRipple)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
