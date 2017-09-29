// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import api from './api'
import env from './env'
import ElementUI from 'element-ui'
import './assets/scss/element-theme/index.css'
//import 'element-ui/lib/theme-default/index.css'
import locale from 'element-ui/lib/locale/lang/en'


// import jquery + bootstrap js
import jQuery from 'jquery'
window.jQuery = window.$ = jQuery
require('bootstrap-sass')

Vue.use(VueResource)
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false



// Intercept console
// REDEFINE CONSOLE FOR DEBUG ENVIRONEMENT
// define a new console
var console = (function(defaultConsole){
    return {
        log: function(text){
            if(env.ENV == 'dev')
                defaultConsole.log(text);
            // Your code
        },
        info: function (text) {
            if(env.ENV == 'dev')
                defaultConsole.info(text);
            // Your code
        },
        warn: function (text) {
            if(env.ENV == 'dev')
                defaultConsole.warn(text);
            // Your code
        },
        error: function (text) {
            if(env.ENV == 'dev')
                defaultConsole.error(text);
            // Your code
        }
    };
}(window.console));

//Then redefine the old console
window.console = console;

// Intercept ajax requests to see if token is invalid
Vue.http.interceptors.push(function(request, next) {
  next(function(response) {
    if(response.status == 401){
        if(response.data.errors.length != 0){
            if(response.data.errors[0] == 'Invalid Token'){
                // We need to relogin
                api.logout()
                this.$notify.info({
                  title: 'Info',
                  message: 'You have been logged out automatically'
                });
                router.replace('/login')
            }
        }
    }
  })
})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
