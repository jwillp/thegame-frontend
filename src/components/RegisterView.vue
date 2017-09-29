<template>

    <div id="register-success-view" v-if="registration_success" class="jumbotron">
        <h1>Registration sucess!</h1>
        <p>You may now <router-link :to="{name:'login'}">login</router-link></p>
    </div>

    <div id="register-view" class="well" v-else>
        <h1>Register</h1>
        <p>Create an account to be part of the game</p>
        <div class="form-error-block" v-if="errors.global">
            <p class="form-error" v-for="error in errors.global">{{ error }}</p>
        </div>
        <form v-on:submit.prevent="registerUser">
            <div class="form-group">
                <div class="form-error-block" v-if="errors.username">
                    <p class="form-error" v-for="error in errors.username">{{ error }}</p>
                </div>
                <el-input
                    v-model="credentials.username"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    required>
                </el-input>
            </div>

            <div class="form-group">
                <div class="form-error-block" v-if="errors.email">
                    <p class="form-error" v-for="error in errors.email">{{ error }}</p>
                </div>
                <el-input
                    v-model="credentials.email"
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    required>
                </el-input>
            </div>

            <div class="form-group">
                <div class="form-error-block" v-if="errors.plain_password">
                    <p class="form-error" v-for="error in errors.plain_password.first">{{ error }}</p>
                </div>
                <el-input
                    v-model="credentials.plain_password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    required>
                </el-input>
            </div>

            <div class="form-group">
                <div class="form-error-block" v-if="errors.plain_password_confirm" @keydown.enter="registerUser">
                    <p class="form-error" v-for="error in errors.plain_password_confirm">{{ error }}</p>
                </div>
                <el-input
                    v-model="credentials.plain_password_confirm"
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm password"
                    required>
                </el-input>
            </div>

            <div class="form-group">
                <el-button type="primary" @click="registerUser" :loading="registrationInProgress">Register</el-button>
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
            registration_success: false,

            registrationInProgress: false
        }
    },

    created: function() {
        document.title = 'The Game | Register' 
        if(api.user.authenticated) {
            router.replace('/')
        }
    },

    methods: {
        registerUser: function() {
            this.registrationInProgress = true
            // Test if passwords are the same (since server does not test for this)
            if(this.credentials.plain_password != this.credentials.plain_password_confirm) {

                this.errors = {
                    plain_password_confirm: ["Passwords don't match"]
                }
                return
            }

            var self = this
            var response = api.register(this.credentials,
                // SUCCES CALLBACK
                function(response) {
                    self.registration_success = true
                    self.registrationInProgress = false
                },

                // ERROR CALLBACK
                function(error) {
                    console.log(error)
                    self.registrationInProgress = false
                    self.errors = error.data.errors || {}

                    if(error.status == 500) {
                        self.errors = {
                            global: ['Server Error, please try again later']
                        }
                    }

                    if (error.response) {
                      // The request was made and the server responded with a status code
                      // that falls out of the range of 2xx
                      console.log(error.response.data);
                      console.log(error.response.status);
                      console.log(error.response.headers);
                    } else if (error.request) {
                      // The request was made but no response was received
                      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                      // http.ClientRequest in node.js
                      console.log(error.request);
                    } else {
                      // Something happened in setting up the request that triggered an Error
                      console.log('Error', error.message);
                    }
                    console.log(error.config);
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