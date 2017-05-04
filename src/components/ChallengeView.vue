<template>
    <div id="challenge-view" v-loading="challeneDataLoading">
        <div id="game-view-info">
            <div v-if="challenge">
                <h1>{{ challenge.title }}</h1>
                <p>{{ challenge.description }}</p>
                <h3>{{ challenge.nb_points }}</h3>
                <el-button-group>
                  <el-button type="success" icon="check" @click="completeChallenge"></el-button>
                  <el-button type="info" :plain="true">{{ getUserNbTimes() }}</el-button>
                  <el-button type="danger" icon="close" @click="cancelChallenge"></el-button>
                </el-button-group>
                <div class="challenge-score-list">
                    <table>
                        <thead>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Number of times</th>
                            <th>Number of points</th>
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
            </div> <!-- .challenge -->
            <div v-else>
                Loading ...
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
            challeneDataLoading: true,

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
                if(self.challeneDataLoading) {
                    self.challeneDataLoading = false
                }
            }, function(responese){
                console.log(responese)

                self.fetchChallengeDataLock = false

                // initial loading
                if(self.challeneDataLoading) {
                    self.challeneDataLoading = false
                }
            })
        },

        completeChallenge: function() {
            api.completeChallenge(this, this.challenge.id,
            // success
            function(response) {
                this.fetchChallengeData(true)
            },

            // error
            function(responese){
                console.log(responese)
            })
        },

        cancelChallenge: function() {
            api.cancelChallenge(this, this.challenge.id,
            // success
            function(response) {
                this.fetchChallengeData(true)
            },

            // error
            function(responese){
                console.log(responese)
            })
        },

        getUserScore: function() {
            console.log(api.user.username)
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
