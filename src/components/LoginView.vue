<template>
    <div id="login-view">
        <h1>Login</h1>
        <p>Log in to your account to know what's up about the game</p>
        <form id="login-form" v-on:submit.prevent="login">
                <div class="form-error-block" v-if="errors">
                    <p class="form-error" v-for="error in errors">
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

            <div class="form-group">
                <el-input
                    v-model="credentials.password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    required>
                </el-input>
            </div>
            <div class="form-group">
                <el-button type="primary" @click="login">Login</el-button>
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
                    router.replace('/games')

                },
                // ERROR CALLBACK
                function(response) {
                    console.log(response)
                    if(response.status == 0){
                        self.errors = ['Server Error, please try again later']
                        return;
                    }

                    self.errors = ['Invalid username or password']
                }
            );
        }
    }
}
</script>