<template>
  <div id="app">
    <div id="header">
      <div id="header-logo">
        <router-link :to="{name:'home'}">
          <img src="./assets/logo.png" width="50px">
        </router-link>
      </div>
      <ul id="header-navigation">
        <li><router-link :to="{name:'home'}">Home</router-link></li>
        <li v-if="!user.authenticated"><router-link :to="{name:'register'}" >Register</router-link></li>
        <li v-if="!user.authenticated"><router-link :to="{name:'login'}">Login</router-link></li>
        <li v-if="user.authenticated"><router-link :to="{name:'logout'}">Logout</router-link></li>
        <li><a href="http://vuejs.org">VueJs docs</a></li>
      </ul>
    </div> <!-- /header -->
    <div id="sidebar">

    </div>
    <router-view
      class="view"
      keep-alive
      transition
      transition-mode="out-in">
    </router-view>
  </div>
</template>

<script>
import auth from './api'
export default {
  name: 'app',
  data() {
    return {
      user: auth.user
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
