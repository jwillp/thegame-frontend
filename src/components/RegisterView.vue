<template>
    <div id="register-view">
        <h1>Register</h1>
        <p>Create an account to be part of the game</p>
        <form v-on:submit.prevent="registerUser">
            <div class="form-group">
            <input
                v-model="credentials.username"
                type="text"
                name="username"
                placeholder="Enter username">
            </div>

            <div class="form-group">
            <input
                v-model="credentials.email"
                type="email"
                name="email"
                placeholder="Enter email">
            </div>

            <div class="form-group">
            <input
                v-model="credentials.plain_password"
                type="password"
                name="password"
                placeholder="Enter password">
            </div>

            <div class="form-group">
            <input
                v-model="credentials.plain_password_confirm"
                type="password"
                name="password_confirmation"
                placeholder="Confirm password">
            </div>

            <div class="form-group">
                <input type="submit" name="submit" value="Register">
            </div>
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
                email: '',
                plain_password: '',
                plain_password_confirm: ''
            }
        }
    },

    methods: {
        registerUser: function() {
            var creds = this.credentials
            //auth.register(this, credentials, 'home')
            var url = 'http://localhost/thegame/web/app_dev.php/api/users/register'
            this.$http.post(url, creds).then(response => {
                // success call back
                console.log(response)
                // get body data
                this.someData = response.body;

              },
              response => {
                // error callback
                console.log(response)
              })
        }
    }
}
</script>

<style type="text/css">
    .form-group {
        margin-top: 20px;
    }
</style>