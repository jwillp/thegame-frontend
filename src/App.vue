<template>
  <div id="app">
    <div id="header">
      <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">
          <div id="header-logo">
            <router-link :to="{name:'home'}">
              <img src="./assets/logo.png" width="50px">
            </router-link>
          </div>
        </el-menu-item>
        <el-menu-item index="1"><router-link :to="{name:'home'}">Home</router-link></el-menu-item>

        <!-- Unauthenticated -->
        <el-menu-item v-if="!user.authenticated" index="2"><router-link :to="{name:'register'}" >Register</router-link></el-menu-item>
        <el-menu-item v-if="!user.authenticated" index="3"><router-link :to="{name:'login'}">Login</router-link></el-menu-item>
        <!-- Authenticated -->
        <el-menu-item v-if="user.authenticated" index="4"><router-link :to="{name:'games'}">Games</router-link></el-menu-item>
        <el-menu-item v-if="user.authenticated" index="5"><router-link :to="{name:'logout'}">Logout</router-link></el-menu-item>
      </el-menu>
      <div class="line"></div>
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

body {
  margin: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
