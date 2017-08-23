import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Main from '@/components/main'
import Task from '@/components/tasks'
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
    }
  ]
})

