import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import { Loader } from './esriMap'


Loader.initialize("https://js.arcgis.com/4.18/");

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
