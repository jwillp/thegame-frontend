// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import api from './api'
import config from './config'
import ElementUI from 'element-ui'
import './assets/scss/element-theme/index.css'
//import 'element-ui/lib/theme-default/index.css'
import locale from 'element-ui/lib/locale/lang/en'


// import jquery + bootstrap js
import jQuery from 'jquery'
window.jQuery = window.$ = jQuery
require('bootstrap-sass')

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false



// Intercept console
// REDEFINE CONSOLE FOR DEBUG ENVIRONEMENT
// define a new console
var console = (function(defaultConsole){
    return {
        log: function(text){
            if(config.ENV == 'dev')
                defaultConsole.log(text);
            // Your code
        },
        info: function (text) {
            if(config.ENV == 'dev')
                defaultConsole.info(text);
            // Your code
        },
        warn: function (text) {
            if(config.ENV == 'dev')
                defaultConsole.warn(text);
            // Your code
        },
        error: function (text) {
            if(config.ENV == 'dev')
                defaultConsole.error(text);
            // Your code
        }
    };
}(window.console));

//Then redefine the old console
window.console = console;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
