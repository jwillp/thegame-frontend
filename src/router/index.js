import Vue from 'vue'
import Router from 'vue-router'

import HomeView from '@/components/HomeView'
import RegisterView from '@/components/RegisterView'
import LoginView from '@/components/LoginView'
import LogoutView from '@/components/LogoutView'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView
    }
  ]
})

