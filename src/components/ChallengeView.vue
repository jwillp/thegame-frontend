<template>
    <div id="challenge-view" v-loading="challengeDataLoading">
        <div id="game-view-info">
            <div v-if="challenge">
                <div class="panel panel-default">
                  <div class="panel-body">
                    <h3>
                        <router-link :to="{name:'games_view', params:{ id: challenge.game.id }}">
                          {{ challenge.game.title }}
                        </router-link>
                    </h3>
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
                                <tr v-for="score in rankScores()" 
                                    :key="score.id" 
                                    :class="'rank-' + score.rank">
                                    <td>
                                        {{ score.rank }}
                                        <i v-if="score.rank == 1" class="glyphicon glyphicon-star"></i>
                                    </td>
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

            fetchDataInterval: undefined
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
        },

        rankScores: function() {
            var scores = this.challenge.scores

            // Score are supposed to be sorted by the server

            // Rank scores from 1 to N
            for (var i = 0; i < scores.length ; i++) {
              scores[i].rank = (i + 1);
            };

            return scores;
        },

        /**
         * Used to easily sort objects by a certain field
         * source: http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects
         * usage:
         *
         * Sort by price high to low
         * homes.sort(sort_by('price', true, parseInt));
         *
         * Sort by city, case-insensitive, A-Z
         * homes.sort(sort_by('city', false, function(a){return a.toUpperCase()}));
         */
        sortBy: function(field, reverse, primer) {
            var key = primer ?
               function(x) {return primer(x[field])} :
               function(x) {return x[field]};

            reverse = !reverse ? 1 : -1;

            return function (a, b) {
               return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            }
        }
    },
}
</script>

<style>

</style>
