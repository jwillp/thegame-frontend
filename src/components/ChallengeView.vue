<template>
    <div id="challenge-view" v-loading="challengeDataLoading">
        <div id="game-view-info">
            <div v-if="challenge">
                <div class="panel panel-default">
                  <div class="panel-body">
                    <h1>{{ challenge.title }}</h1>
                    <p>{{ challenge.description }}</p>
                    <h3>{{ challenge.nb_points }} pts</h3>
                  </div>
                  <div class="panel-footer">
                    <div class="btn-group">
                      <a class="btn btn-danger" @click="cancelChallenge">
                        <i class="glyphicon glyphicon-remove"></i>
                      </a>
                      <a class="btn btn-default">
                        {{ getUserNbTimes() }}
                      </a>
                      <a class="btn btn-success" @click="completeChallenge">
                        <i class="glyphicon glyphicon-ok"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div class="well">
                  <div class="challenge-score-list">
                        <table class="table table-striped table-hover">
                            <thead>
                              <tr>        
                                <th>Rank</th>
                                <th>User</th>
                                <th>Number of times</th>
                                <th>Number of points</th>
                              </tr>
                            </thead>
                            <tbody>
                                <tr v-for="score in challenge.scores" :key="score.id">
                                    <td>{{ score.id }}</td>
                                    <td>{{ score.user.username }}</td>
                                    <td>{{ score.nb_times }}</td>
                                    <td>{{ score.nb_times * challenge.nb_points }}</td>
                                </tr>
                            </tbody>
                        </table>
                  </div>  <!-- .challenge-score-list -->
                </div><!-- /.panel -->
            </div> <!-- .challenge -->
            <div v-else>
                
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
            challenge: undefined,
            fetchChallengeDataLock: false,
            challengeDataLoading: true,

            fetchDataInterval: undefined,

            dialogNewGameVisible: false
        }
    },

    created: function() {
        var self = this
        this.fetchChallengeData(true)
        this.fetchDataInterval = setInterval(function(){ self.fetchChallengeData() }, 1000 * 10) // every ten seconds
    },

    destroyed: function() {
        clearInterval(this.fetchDataInterval)
    },

    methods: {
        fetchChallengeData: function(force = false) {
            // lock requests so we dont spam
            if(this.fetchChallengeDataLock && !force) {
                return
            }
            this.fetchChallengeDataLock = true
            self = this
            api.getChallenge(this, this.$route.params.id,  function(response) {
                self.challenge = response.body
                self.fetchChallengeDataLock = false
                // initial loading
                if(self.challengeDataLoading) {
                    self.challengeDataLoading = false
                }
            }, function(response){
                console.log(response)

                self.fetchChallengeDataLock = false

                // initial loading
                if(self.challengeDataLoading) {
                    self.challengeDataLoading = false
                }
            })
        },

        completeChallenge: function() {

            // Visually change it now (live feedback)
            var score = this.getUserScore()
            if(score) {
                score.nb_times++;
            }

            api.completeChallenge(this, this.challenge.id,
            // success
            function(response) {
                this.fetchChallengeData(true)
            },

            // error
            function(response){
                console.log(response)
            })
        },

        cancelChallenge: function() {

            // Visually change it now (live feedback)
            var score = this.getUserScore();
            if(score) {
                score.nb_times--
                if(score.nb_times < 0) score.nb_times = 0
            }

            api.cancelChallenge(this, this.challenge.id,
            // success
            function(response) {
                this.fetchChallengeData(true)
            },

            // error
            function(response){
                console.log(response)
            })
        },

        getUserScore: function() {
            for (var i = this.challenge.scores.length - 1; i >= 0; i--) {
                var score = this.challenge.scores[i]
                if (score.user.username == api.user.username) {
                    return score
                }
            }
            return undefined
        },

        getUserNbTimes: function() {
            var score = this.getUserScore()
            return score ? score.nb_times : 0
        }
    },
}
</script>

<style>

</style>
