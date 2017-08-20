// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
/* import App from './myap'
import UserTemplate from './userTemplate' */
import Login from './login'

import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
/*
new Vue({
  el: '#app',
  // router,
  template: '<App/>',
  components: {
    App
  }
})

new Vue({
  el: '#repite',
  data: () => ({
    message: 'Am I truly an alligator?'
  })
})

new Vue({
  el: '#myform',
  template: '<UserTemplate/>',
  components: {
    UserTemplate
  }
})
*/
new Vue({
  el: '#app',
  router,
  template: '<Login/>',
  components: {
    Login
  }
})

