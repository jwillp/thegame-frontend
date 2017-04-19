<template>

    <div id="register-success-view" v-if="registration_success">
        <h1>Registration sucess!</h1>
        <p>You may now <router-link :to="{name:'login'}">login</router-link></p>
    </div>

    <div id="register-view" v-else>
        <h1>Register</h1>
        <p>Create an account to be part of the game</p>
        <form v-on:submit.prevent="registerUser">
            <div class="form-group">
                <div class="form-error-block" v-if="errors.username">
                    <p class="form-error" v-for="error in errors.username">{{ error }}</p>
                </div>
                <input
                    v-model="credentials.username"
                    type="text"
                    name="username"
                    placeholder="Enter username">
            </div>

            <div class="form-group">
                <div class="form-error-block" v-if="errors.email">
                    <p class="form-error" v-for="error in errors.email">{{ error }}</p>
                </div>
                <input
                    v-model="credentials.email"
                    type="email"
                    name="email"
                    placeholder="Enter email">
            </div>

            <div class="form-group">
                <div class="form-error-block" v-if="errors.plain_password">
                    <p class="form-error" v-for="error in errors.plain_password.first">{{ error }}</p>
                </div>
                <input
                    v-model="credentials.plain_password"
                    type="password"
                    name="password"
                    placeholder="Enter password">
            </div>

            <div class="form-group">
                <div class="form-error-block" v-if="errors.plain_password_confirm">
                    <p class="form-error" v-for="error in errors.plain_password_confirm">{{ error }}</p>
                </div>
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
            },
            errors: {

            },
            registration_success: false
        }
    },

    methods: {
        registerUser: function() {

            // Test if passwords are the same
            if(this.credentials.plain_password != this.credentials.plain_password_confirm) {

                this.errors = {
                    plain_password_confirm: ["Passwords don't match"]
                }
                return
            }

            var creds = this.credentials
            var self = this
            var url = 'http://localhost/thegame/web/app_dev.php/api/users/register'
            this.$http.post(url, creds).then(response => {
                // success call back
                // TODO display registration complete page
                self.registration_success = true
              },
              response => {
                // error callback
                self.errors = response.body.errors
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