<template>
    <div id="leaderboard-view" v-loading="leaderboardDataLoading">
        <div id="game-view-info">
            <div v-if="leaderboard">
                <div class="game-score-list">
                  <table class="table table-striped table-hover">
                      <thead>
                        <tr>        
                          <th>Rank</th>
                          <th>User</th>
                          <th>Total points</th>
                        </tr>
                      </thead>
                      <tbody>
                          <tr v-for="score in rankScores()" 
                              :key="score.id" 
                              :class="'rank-' + score.rank">
                              <td>
                                  {{ score.rank }}
                                  <i v-if="score.rank == 1" class="glyphicon glyphicon-star"></i>
                              </td>
                              <td>{{ score.user.username }}</td>
                              <td>{{ score.nbPoints }}</td>
                          </tr>
                      </tbody>
                  </table>
                </div>  <!-- .leaderboard-score-list -->
            </div>
        </div>
    </div>
</template>

<script>
import api from '../api'
import router from '../router'


export default {
    data: () => {
        return {
            leaderboard: [],
            fetchLeaderboardLock: false,
            leaderboardDataLoading: true,

            fetchDataInterval: undefined
        }
    },

    props: ['gameId'],

    created: function() {
        var self = this
        this.fetchLeaderboard(true)
        this.fetchDataInterval = setInterval(function(){ self.fetchLeaderboard() }, 1000 * 8) // every ten seconds
    },

    destroyed: function() {
        clearInterval(this.fetchDataInterval)
    },

    methods: {
        fetchLeaderboard: function(force = false) {
            // lock requests so we dont spam
            if(this.fetchLeaderboardLock && !force) {
                return
            }
            this.fetchLeaderboardLock = true
            var self = this
            api.getLeaderboard(this.gameId, 

              // SUCCESS 
              function(response) {

                self.leaderboard = response.data
                self.fetchLeaderboardLock = false
                // initial loading
                if(self.leaderboardDataLoading) {
                    self.leaderboardDataLoading = false
                }
              }, 

            // ERROR
              function(error){
                  self.fetchLeaderboardLock = false

                  // initial loading
                  if(self.leaderboardDataLoading) {
                      self.leaderboardDataLoading = false
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
              },

              // ALWAYS
              function(response) {

              }
          )
        },


        rankScores: function() {
            var scores = []
            for (var rank in this.leaderboard) {
                var data = this.leaderboard[rank]
                for (var j = data.length - 1; j >= 0; j--) {
                    var score = data[j]
                    score.rank = rank
                    scores.push(score)
                }
            }
            return scores
        }
    }
}
</script>

<style>

</style>
