<template>
  <div id="app">

    <nav class="navbar navbar-default navbar-static-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link :to="{name:'home'}" class="navbar-brand">
            <img class="logo" src="./assets/images/logo_min.png" height="50px">
          </router-link>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li><router-link :to="{name:'home'}">Home</router-link></li>

            <!-- Authenticated -->
            <li v-if="user.authenticated"><router-link :to="{name:'newsfeed'}">Newsfeed</router-link></li>
            <li v-if="user.authenticated"><router-link :to="{name:'games'}">Games</router-link></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li v-if="user.authenticated">
              <a href="#">
                <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                {{ user.username }}
              </a>
            </li>
            <li v-if="user.authenticated"><router-link :to="{name:'logout'}">Logout</router-link></li>

            <li v-if="!user.authenticated"><router-link :to="{name:'login'}">Login</router-link></li>
            <li v-if="!user.authenticated"><router-link :to="{name:'register'}" >Register</router-link></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>


    <div class="alert alert-info fixed-top" role="alert" v-if="LOCAL_ENV">
        <i class="glyphicon glyphicon-exclamation-sign"></i>
        <strong>Watchout!</strong> The current server environement is localhost!
    </div>

    <div id="main-container" class="container">
      <transition :name="transitionName">
        <router-view class="view"keep-alive></router-view>
      </transition>
    </div> <!-- page wrapper -->
    
  </div><!-- #app -->
</template>

<script>
import config from './config'
import api from './api'

// Check the users auth status when the app starts
api.checkAuth()

export default {
  name: 'app',
  data() {
    return {
      user: api.user,
      LOCAL_ENV: config.HOST.includes('localhost'),
      activeIndex: "home",
      transitionName: 'slide-right'
    }
  },

  methods: {
    handleSelect: function() {

    }
  },

  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  }

}
</script>

<style lang="scss">
@import "src/assets/scss/style.scss";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
