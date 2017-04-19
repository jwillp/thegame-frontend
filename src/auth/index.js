// Authentication Service
// Handles authentication and storage of JWT

import router from '../router'

// URL and endpoint constants
const API_URL = 'http://localhost/thegame/web/app_dev.php/api'
const LOGIN_URL = API_URL + '/users/login'
const REGISTER_URL = API_URL + '/users/register'

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  login(context, creds, redirect) {
    context.$http.post(LOGIN_URL, creds, (data) => {
      localStorage.setItem('token', data.token)

      this.user.authenticated = true

      // Redirect to a specified route
      if(redirect) {
        router.go(redirect)
      }

    }).error((err) => {
      context.error = err
    })
  },

  register(context, creds, redirect) {
    context.$http.post(REGISTER_URL, creds, (data) => {
      localStorage.setItem('token', data.token)

      this.user.authenticated = true

      if(redirect) {
        router.go(redirect)
      }

    }).error((err) => {
      context.error = err
    })
  },
  // To log out, we just need to remove the token
  logout() {
    localStorage.removeItem('token')
    this.user.authenticated = false
  },

  checkAuth() {
    var jwt = localStorage.getItem('token')
    if(jwt) {
      this.user.authenticated = true
    }
    else {
      this.user.authenticated = false
    }
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader() {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  }
}