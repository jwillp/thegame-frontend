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
          <router-link :to="{name:'home'}" class="navbar-brand">The Game</router-link>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li><router-link :to="{name:'home'}">Home</router-link></li>

            <!-- Authenticated -->
            <li v-if="user.authenticated"><router-link :to="{name:'games'}">Games</router-link></li>
            <li v-if="user.authenticated"><router-link :to="{name:'logout'}">Logout</router-link></li>

          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li v-if="user.authenticated"><a href="#">
                <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                {{ user }}
              </a>
            </li>
            <li v-if="user.authenticated"><router-link :to="{name:'logout'}">Logout</router-link></li>

            <li v-if="!user.authenticated"><router-link :to="{name:'login'}">Login</router-link></li>
            <li v-if="!user.authenticated"><router-link :to="{name:'register'}" >Register</router-link></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    <div id="main-container" class="container">
      <router-view
        class="view"
        keep-alive
        transition
        transition-mode="out-in">
      </router-view>
    </div> <!-- page wrapper -->
    
  </div><!-- #app -->
</template>

<script>
import api from './api'

// Check the users auth status when the app starts
api.checkAuth()

export default {
  name: 'app',
  data() {
    return {
      user: api.user,


      activeIndex: "home"
    }
  },

  methods: {
    handleSelect: function() {

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
