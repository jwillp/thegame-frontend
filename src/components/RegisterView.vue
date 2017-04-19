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
                    placeholder="Enter username"
                    required>
            </div>

            <div class="form-group">
                <div class="form-error-block" v-if="errors.email">
                    <p class="form-error" v-for="error in errors.email">{{ error }}</p>
                </div>
                <input
                    v-model="credentials.email"
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    required>
            </div>

            <div class="form-group">
                <div class="form-error-block" v-if="errors.plain_password">
                    <p class="form-error" v-for="error in errors.plain_password.first">{{ error }}</p>
                </div>
                <input
                    v-model="credentials.plain_password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    required>
            </div>

            <div class="form-group">
                <div class="form-error-block" v-if="errors.plain_password_confirm">
                    <p class="form-error" v-for="error in errors.plain_password_confirm">{{ error }}</p>
                </div>
                <input
                    v-model="credentials.plain_password_confirm"
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm password"
                    required>
            </div>

            <div class="form-group">
                <input type="submit" name="submit" value="Register">
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

            // Test if passwords are the same (since server does not test for this)
            if(this.credentials.plain_password != this.credentials.plain_password_confirm) {

                this.errors = {
                    plain_password_confirm: ["Passwords don't match"]
                }
                return
            }

            var self = this
            var response = api.register(this, this.credentials,
                // SUCCES CALLBACK
                function(response) {
                    self.registration_success = true
                },
                // ERROR CALLBACK
                function(response) {
                    self.errors = response.body.errors
                }
            )
        }
    }
}
</script>

<style type="text/css">
    .form-group {
        margin-top: 20px;
    }
</style>