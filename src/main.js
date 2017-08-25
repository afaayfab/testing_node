// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
/* import App from './myap'
import UserTemplate from './userTemplate' */
// import Login from './login'

import BootstrapVue from 'bootstrap-vue'
import App from './App'
import Users from './components/users'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueLayers from 'vuelayers'
import ol3 from './components/ol3'

Vue.use(VueLayers)
// now all components installed and ready to use
new Vue({  
  
})
Vue.use(BootstrapVue)
import router from './router'

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  render: h => h(App)
})

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
*//*
new Vue({
  el: '#app',
  router,
  template: '<Login/>',
  components: {
    Login
  }
})
*/
