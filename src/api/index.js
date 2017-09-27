// Service to connect to thegame api server
// Handles authentication and storage of JWT

import router from '../router'
import axios from 'axios'

// URL and endpoint constants
const LOCAL_ENV = true

var HOST

if (LOCAL_ENV) {
  HOST = 'http://localhost/thegame-backend/web'
} else {
  HOST = 'http://138.197.145.66/thegame-backend/web'
}

const API_URL = HOST + '/api'

const LOGIN_URL = API_URL + '/users/login'
const REGISTER_URL = API_URL + '/users/register'

const CREATE_GAME_URL = API_URL + '/games/new'
const GET_GAMES_URL = API_URL + '/games'
const GET_GAME_URL = API_URL + '/games/:id'
const GET_GAME_LEADERBOARD = API_URL + '/games/:id/leaderboard'
const UPDATE_GAME_URL = API_URL + '/games/:id'
const DELETE_GAME_URL = API_URL + '/games/:id'

const GET_CHALLENGES_URL = API_URL + '/games/:id/challenges'
const CREATE_CHALLENGE_URL = API_URL + '/games/:id/challenges/new'
const DELETE_CHALLENGE_URL = API_URL + '/challenges/:id'
const GET_CHALLENGE_URL = API_URL + '/challenges/:id'
const COMPLETE_CHALLENGE_URL = API_URL + '/challenges/:id/complete'
const CANCEL_CHALLENGE_URL = API_URL + '/challenges/:id/cancel'

const GET_NEWS_URL = API_URL + '/events'

const GET_USERS_URL = API_URL + '/users'


export default {
  LOCAL_ENV : LOCAL_ENV,
  
  // User object will let us check authentication status
  user: {
    username: '',
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  login(creds, redirect, successCallback, errorCallback, alwaysCallback) {
    var self = this;
    var ax = axios.create({
      headers: {'Authorization': 'Basic ' + btoa(creds.username + ':' + creds.password)}
    })
    ax.post(LOGIN_URL)
      .then(function(response) {
        console.log(response)
        localStorage.setItem('token', response.data.token)
        self.user.authenticated = true
        self.user.username = creds.username
        localStorage.setItem('username', self.user.username)

        successCallback(response)

        // Redirect to a specific route
        if(redirect) {
          router.push(redirect)
        }
      })
      .catch(errorCallback)
      .then(alwaysCallback)
  },

  // Send data to the register url to register a user
  register(creds, successCallback, errorCallback, alwaysCallback) {
    axios.post(REGISTER_URL, creds)
    .then(successCallback)
    .catch(errorCallback)
    .then(alwaysCallback)
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


  createGame(data, successCallback, errorCallback, alwaysCallback) {
    var self = this
    var ax = axios.create({
      headers: self.getAuthHeader()
    })

    ax.post(CREATE_GAME_URL, data)
       .then(successCallback)
       .catch(errorCallback)
       .then(alwaysCallback)
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

  deleteGame(context, gameId, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }
    context.$http.delete(DELETE_GAME_URL.replace(':id', gameId), options)
                 .then(successCallback, errorCallback)
  },

  getGameNews(context, gameId, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }
    context.$http.get(GET_NEWS_URL + '?gameId=' + gameId, options)
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

  deleteChallenge(context, ch, successCallback, errorCallback) {
    var self = this
    var options = {
      headers: self.getAuthHeader()
    }
    context.$http.delete(DELETE_CHALLENGE_URL.replace(':id', ch), options)
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