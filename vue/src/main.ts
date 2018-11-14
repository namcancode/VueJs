import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'bootstrap/scss/bootstrap.scss'
import plugins from '@/plugins'
import i18n from '@/plugins/i18n'
import lang from 'element-ui/lib/locale/lang/vi'
import locale from 'element-ui/lib/locale'

locale.use(lang)
Vue.use(plugins)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
