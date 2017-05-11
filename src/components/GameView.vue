<template>
    <div id="game-view" v-loading="gameDataLoading">
        <div id="game-view-info">
            <div v-if="game">
                <h1>
                    {{ game.title }}
                </h1>
                <p>from {{ format(game.start_date) }} to {{ format(game.end_date, true) }}</p>
                <p>Time left: {{ timeLeft(game.end_date) }}</p>
                <p v-if="game.visibility == 'VISIBILITY_PRIVATE'">
                    <i class="glyphicon glyphicon-lock"></i> Private
                </p>
                <p v-if="game.visibility == 'VISIBILITY_PUBLIC'">
                    <i class="glyphicon glyphicon-globe"></i> Public
                </p>
            </div>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" v-if="game">

            <el-tab-pane label="Newsfeed" name="newsfeed">
                <div class="well">
                    <h1 class="text-center"><img src="./../assets/images/newsfeed.png" width="400px" alt="Newsfeed"></h1>
                    <h2 class="text-center">Newsfeed</h2>
                </div>
            </el-tab-pane>

            <el-tab-pane label="Challenges" name="challenges">
                <div v-if="game">
                    <div id="challenge-list-container" class="well">
                        <h1 class="text-center"><img src="./../assets/images/challenge.png" width="400px" alt="Newsfeed"></h1>
                        <h2 class="text-center">Challenges</h2>
                        <ChallengeListView :gameId='game.id'></ChallengeListView>
                    </div>
                </div>
                <div v-else>
                    Loading ...
                </div>
            </el-tab-pane>

            <el-tab-pane label="Leaderboard" name="leaderboard">
                <div class="well">
                    <h1 class="text-center"><img src="./../assets/images/leaderboard.png" width="400px" alt="Newsfeed"></h1>
                    <h2 class="text-center">Leaderboard</h2>
                    <GameLeaderboardView :gameId="game.id"></GameLeaderboardView>
                </div>
            </el-tab-pane>

            <el-tab-pane label="Settings" name="settings" v-if="isCurrentUserAdmin()">
                <div id="game-settings" class="well">
                    <h1>Game Settings</h1>
                    <button class="btn btn-primary" @click="onDelete">
                        <i class="glyphicon glyphicon-trash"></i>&nbsp; 
                        Delete Game
                    </button>
                    <GameEditFormView :game="game"></GameEditFormView>
                </div>
            </el-tab-pane>

        </el-tabs>
    </div>
</template>

<script>
import api from '../api'
import router from '../router'
import moment from 'moment'

import ChallengeListView from './ChallengeListView'
import GameLeaderboardView from './GameLeaderboardView.vue'
import GameEditFormView from './GameEditFormView.vue'

export default {
    data: () => {
        return {
            activeName: 'newsfeed',

            game: undefined,
            fetchGameDataLock: false,
            gameDataLoading: true,

            fetchGameInterval: undefined,

            dialogNewGameVisible: false
        }
    },

    created: function() {
        var self = this
        this.fetchGameData(true)
        this.fetchGameInterval = setInterval(function(){ self.fetchGameData() }, 1000 * 10) // every ten seconds
    },

    destroyed: function() {
        clearInterval(this.fetchGameInterval)
    },

    methods: {
        fetchGameData: function(force = false) {
            // lock requests so we dont spam
            if(this.fetchGameDataLock && !force) {
                return
            }
            this.fetchGameDataLock = true
            self = this
            api.getGame(this, this.$route.params.id,  function(response) {
                self.game = response.body
                self.fetchGameDataLock = false
                document.title = 'The Game | ' + self.game.title
                // initial loading
                if(self.gameDataLoading) {
                    self.gameDataLoading = false
                }
            }, function(response){
                console.log(response)
                this.$notify.error({
                  title: 'Error',
                  message: 'There was an error, please try again later.'
                });
                // initial loading
                if(self.gameDataLoading) {
                    self.gameDataLoading = false
                }
            })
        },

        deleteGame: function() {
            self = this
            api.deleteGame(this, this.game.id,  function(response) {
                this.$notify.success({
                  title: 'Success',
                  message: 'The Game was successfully deleted'
                });
                router.replace('/')
            }, function(response){
                console.log(response)
                this.$notify.error({
                  title: 'Error',
                  message: 'There was an error, please try again later.'
                });
            })
        },

        format: function(date, displayTime) {
            var dateFormat = "YYYY/MM/DD"
            if(displayTime)
                dateFormat = "YYYY/MM/DD [at] HH:mm"

            return moment(date).format(dateFormat)
        },

        handleClick(tab, event) {
          //console.log(tab, event);
        },

        isCurrentUserAdmin: function(){
            for (var i = this.game.administrators.length - 1; i >= 0; i--) {
                if(this.game.administrators[i].username == api.user.username){
                    return true
                }
            }
            return false
        },

        timeLeft: function(endDate) {
            var now = moment()
            endDate = moment(endDate)
            if(now.isAfter(endDate)) {
                return "Finished"
            }else {
                return endDate.from(now)
                              .replace('in ', '')
                              .replace('a day', '1 day')
            }
        },

        onDelete: function() {
            this.$confirm('This will permanently delete the Game. Continue?', 'Warning', {
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
                this.deleteGame()
            })
        }
    },

    components: {
        ChallengeListView,
        GameLeaderboardView,
        GameEditFormView
    }
}
</script>