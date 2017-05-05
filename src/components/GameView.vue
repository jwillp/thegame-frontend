<template>
    <div id="game-view">
        <div id="game-view-info">

            <div v-if="game">
                <h1>{{ game.title }}</h1>
                <p>from {{ format(game.start_date) }} to {{ format(game.end_date, true) }}</p>
            </div>
            <div v-else>
                Loading ...
            </div>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">

            <el-tab-pane label="Newsfeed" name="newsfeed">
                <div class="well">
                    <h1 class="text-center"><img src="./../assets/images/newsfeed.png" width="400px" alt="Newsfeed"></h1>
                    <h2 class="text-center">Newsfeed</h2>
                </div>
            </el-tab-pane>

            <el-tab-pane label="Challenges" name="challenges">
                <div v-if="game">
                    <div class="well">
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
                Leaderboard
            </el-tab-pane>

            <el-tab-pane label="Config" name="config">
                Config
            </el-tab-pane>

        </el-tabs>
    </div>
</template>

<script>
import api from '../api'
import router from '../router'
import moment from 'moment'

import ChallengeListView from './ChallengeListView'

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
                // initial loading
                if(self.gameDataLoading) {
                    self.gameDataLoading = false
                }
            }, function(responese){
                console.log(responese)
                // initial loading
                if(self.gameDataLoading) {
                    self.gameDataLoading = false
                }
            })
        },

        format: function(date, displayTime) {
            var dateFormat = "YYYY/MM/DD"
            if(displayTime)
                dateFormat = "YYYY/MM/DD [at] HH:mm"

            return moment(date).format(dateFormat)
        },

        handleClick(tab, event) {
          console.log(tab, event);
        }
    },

    components: {
        ChallengeListView
    }
}
</script>