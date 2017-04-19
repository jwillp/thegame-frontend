<template>
    <div id="login-view">
        <h1>Login</h1>
        <p>Log in to your account to know what's up about the game</p>
        <form id="login-form">
            <input
                v-model="credentials.username"
                type="text"
                name="username"
                placeholder="Enter username">

            <input
                v-model="credentials.password"
                type="password"
                name="password"
                placeholder="Enter password">
            <button class="btn btn-primary" @click="submit()">Login</button>
        </form>
    </div>
</template>

<script>
import auth from '../auth'
export default {
    data: function() {
        return {
            credentials: {
                username: '',
                password: ''
            }
        }
    },

    methods: {
        submit: function() {
            var credentials = {
                username: this.credentials.username,
                password: this.password.credentials
            }
            auth.login(this, credentials, 'home')
        }
    }
}
</script>
