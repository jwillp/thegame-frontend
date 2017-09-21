<template>
    <div id="home-view" class="jumbotron">
        <h1><img src="../assets/images/logo.png" class="img-responsive" alt="The Game"></h1>
        <p>Welcome to the game</p>

        <router-link :to="{name:'login'}" class="btn btn-primary">Login</router-link>
        <router-link :to="{name:'register'}" class="btn btn-primary">Register</router-link>
    </div>
</template>


<script>
import router from '../router'
import api from '../api'

export default {
    created: function(){
        document.title = 'The Game | Home' 
        if(api.user.authenticated) {
            router.replace('/games')
        }
    }
}
</script>