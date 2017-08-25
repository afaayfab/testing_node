import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Main from '@/components/main'
import Users from '@/components/users'
import Map from '@/components/ol3'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      name: 'NotFound',
      component: {
        template: '<h1>Not Found</h1>'
      }
    },
    {
      path: '/main',
      name: 'main view',
      component: Main
    },
    {
      path: '/users',
      name: 'users scafolding',
      component: Users
    },
    {
      path: '/map',
      name: 'mapLayer',
      component: Map
    }
  ]
})

