// Service to connect to thegame api server
// Handles authentication and storage of JWT

import router from '../router'

// URL and endpoint constants
const API_URL = 'http://localhost/thegame/web/app_dev.php/api'
const LOGIN_URL = API_URL + '/users/login'
const REGISTER_URL = API_URL + '/users/register'

const CREATE_GAME_URL = API_URL + '/games/new'
const GET_GAMES_URL = API_URL + '/games'
const GET_GAME_URL = API_URL + '/games/'

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  login(context, creds, redirect, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: {
          'Authorization': 'Basic ' + btoa(creds.username + ':' + creds.password)
        }
    }
    context.$http.post(LOGIN_URL, creds, options).then(
      function(response) {
        localStorage.setItem('token', response.body.token)
        self.user.authenticated = true

        successCallback(response)

        // Redirect to a specified route
        if(redirect) {
          router.push(redirect)
        }
      },
      // error callback
      function(response) {
        errorCallback(response)
      }
    );
  },

  // Send data to the register url to register a user
  register(context, creds, successCallback, errorCallback) {
    context.$http.post(REGISTER_URL, creds)
                 .then(successCallback, errorCallback)
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
  },



  createGame(context, data, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }
    context.$http.post(CREATE_GAME_URL, data, options)
             .then(successCallback, errorCallback)
  },

  getGames(context, successCallback, errorCallback){
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }
    context.$http.get(GET_GAMES_URL, options)
                 .then(successCallback, errorCallback)
  },

  getGame(context, gameId, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }
    context.$http.get(GET_GAME_URL + gameId, options)
                 .then(successCallback, errorCallback)
  }
}