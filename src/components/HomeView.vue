<template>
    <div id="home-view">
        <h1>The Game</h1>
        <p>Welcome to the game</p>

        <router-link :to="{name:'login'}" class="btn btn-primary">Login</router-link>
        <router-link :to="{name:'register'}" class="btn btn-primary">Register</router-link>
    </div>
</template>
