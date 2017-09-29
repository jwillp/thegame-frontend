<template>
    <div id="login-view" class="jumbotron">
        <h1>Login</h1>
        <p>Log in to your account to know what's up about the game</p>
        <form id="login-form" v-on:submit.prevent="login">
                <div class="form-error-block" v-if="errors">
                    <p v-for="error in errors">
                        <el-alert
                            type="error alert"
                            title="Login error"
                            :description="error"
                            :closable="false"
                            show-icon>
                          </el-alert>
                    </p>
                </div>
            <div class="form-group">
                <el-input
                    v-model="credentials.username"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    required>
                </el-input>
            </div>

            <div class="form-group" @keydown.enter="login">
                <el-input
                    v-model="credentials.password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    required>
                </el-input>
            </div>
            <div class="form-group">
                <el-button type="primary" @click="login" :loading="loginInProgress">Login</el-button>
            </div>
        </form>
    </div>
</template>

<script>
import router from '../router'
import api from '../api'

export default {
    data: function() {
        return {
            credentials: {
                username: '',
                password: '',
            },
            errors: {

            },

            loginInProgress: false
        }
    },

    created: function() {
        document.title = 'The Game | Register' 
        if(api.user.authenticated) {
            router.replace('/')
        }
    },

    methods: {
        login: function() {
            this.loginInProgress = true
            var self = this
            var response = api.login(this.credentials, null /* redirect */,
                // SUCCES CALLBACK
                function(response) {
                    console.log(response)
                    self.loginInProgress = false
                    router.replace('/games')
                    self.$notify({
                       title: 'Success',
                       message: 'Successfully logged in',
                       type: 'success'
                     })

                },
                // ERROR CALLBACK
                function(error) {

                    self.loginInProgress = false

                    if(error.status == 0 || error.status == 500){
                        self.errors = ['Server Error, please try again later']
                        return;
                    }

                    self.errors = ['Invalid username or password']

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
                },

                function(response) {}
            );
        }
    }
}
</script>