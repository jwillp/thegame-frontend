import Vue from 'vue'
import Router from 'vue-router'

import HomeView from '@/components/HomeView'
import RegisterView from '@/components/RegisterView'
import LoginView from '@/components/LoginView'
import LogoutView from '@/components/LogoutView'
import GameListView from '@/components/GameListView'
import GameView from '@/components/GameView'
import ChallengeView from '@/components/ChallengeView'
import NewsfeedView from '@/components/NewsfeedView'

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
    },
    {
      path: '/games',
      name: 'games',
      component: GameListView
    },
    {
      path: '/games/:id',
      name: 'games_view',
      component: GameView
    },
    {
      path: '/challenge/:id',
      name: 'challenge_view',
      component: ChallengeView
    },
    {
      path: '/newsfeed',
      name: 'newsfeed',
      component: NewsfeedView
    },
    {
      path: '/user/:id',
      name: 'user_profile',
      component: HomeView
    }
  ]
})

