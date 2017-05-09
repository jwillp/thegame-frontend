// Service to connect to thegame api server
// Handles authentication and storage of JWT

import router from '../router'

// URL and endpoint constants
const HOST = 'http://localhost/thegame/web/app_dev.php'

const API_URL = HOST + '/api'

const LOGIN_URL = API_URL + '/users/login'
const REGISTER_URL = API_URL + '/users/register'

const CREATE_GAME_URL = API_URL + '/games/new'
const GET_GAMES_URL = API_URL + '/games'
const GET_GAME_URL = API_URL + '/games/:id'
const GET_GAME_LEADERBOARD = API_URL + '/games/:id/leaderboard'
const UPDATE_GAME_URL = API_URL + '/games/:id'

const GET_CHALLENGES_URL = API_URL + '/games/:id/challenges'
const CREATE_CHALLENGE_URL = API_URL + '/games/:id/challenges/new'
const GET_CHALLENGE_URL = API_URL + '/challenges/:id'
const COMPLETE_CHALLENGE_URL = API_URL + '/challenges/:id/complete'
const CANCEL_CHALLENGE_URL = API_URL + '/challenges/:id/cancel'

const GET_NEWS_URL = API_URL + '/events'

const GET_USERS_URL = API_URL + '/users'


export default {

  // User object will let us check authentication status
  user: {
    username: '',
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
        self.user.username = creds.username
        localStorage.setItem('username', self.user.username)

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
    this.user.authenticated= jwt != undefined
    this.user.username = localStorage.getItem('username')
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
    context.$http.get(GET_GAME_URL.replace(':id', gameId), options)
                 .then(successCallback, errorCallback)
  },

  updateGame(context, gameId, data, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }
    context.$http.put(UPDATE_GAME_URL.replace(':id', gameId), data, options)
                 .then(successCallback, errorCallback)
  },

  getLeaderboard(context, gameId, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }
    context.$http.get(GET_GAME_LEADERBOARD.replace(':id',  gameId), options)
                 .then(successCallback, errorCallback)
  },

  getChallenges(context, gameId, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }
    context.$http.get(GET_CHALLENGES_URL.replace(':id', gameId), options)
                 .then(successCallback, errorCallback)
  },

  createChallenge(context, gameId, data, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }
    context.$http.post(CREATE_CHALLENGE_URL.replace(':id', gameId), data, options)
               .then(successCallback, errorCallback)
  },

  getChallenge(context, challengeId, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }
    context.$http.get(GET_CHALLENGE_URL.replace(':id',  challengeId), options)
                 .then(successCallback, errorCallback)
  },

  // Completes a challenge for currently authenticated user
  completeChallenge(context, challengeId, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }

    context.$http.post(COMPLETE_CHALLENGE_URL.replace(':id',  challengeId), {}, options)
                 .then(successCallback, errorCallback)
  },

  // Cancels a challenge score for an authenticated user
  cancelChallenge(context, challengeId, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }

    context.$http.post(CANCEL_CHALLENGE_URL.replace(':id',  challengeId), {}, options)
                 .then(successCallback, errorCallback)
  },

  getNews(context, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }
    context.$http.get(GET_NEWS_URL, options)
                 .then(successCallback, errorCallback)
  },

  getUsers(context, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }
    context.$http.get(GET_USERS_URL, options)
                 .then(successCallback, errorCallback)
  }
}