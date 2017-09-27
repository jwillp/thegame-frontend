// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'

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


import api from './api'
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
