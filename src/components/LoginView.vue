<template>
    <div id="login-view">
        <h1>Login</h1>
        <p>Log in to your account to know what's up about the game</p>
        <form id="login-form" v-on:submit.prevent="login">
                <div class="form-error-block" v-if="errors">
                    <p class="form-error" v-for="error in errors">{{ error }}</p>
                </div>
            <div class="form-group">
                <input
                    v-model="credentials.username"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    required>
            </div>

            <div class="form-group">
                <input
                    v-model="credentials.password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    required>
            </div>
            <div class="form-group">
                <input type="submit" name="submit" value="Login">
            </div>
        </form>
    </div>
</template>

<script>
import api from '../api'
export default {
    data: function() {
        return {
            credentials: {
                username: '',
                password: '',
            },
            errors: {

            }
        }
    },

    methods: {
        login: function() {
            var self = this
            var response = api.login(this, this.credentials, null,
                // SUCCES CALLBACK
                function(response) {
                    console.log(response)
                },
                // ERROR CALLBACK
                function(response) {
                    self.errors = ['Invalid username or password']
                }
            );
        }
    }
}
</script>