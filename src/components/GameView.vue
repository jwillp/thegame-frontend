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
                Newsfeed
            </el-tab-pane>

            <el-tab-pane label="Challenges" name="challenges">
                Challenges
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
export default {
    data: () => {
        return {
            activeName: 'newsfeed',
            id: -1,
            game: undefined,
            fetchLock: false,
            gameLoading: true,

            dialogNewGameVisible: false
        }
    },

    created: function() {
        this.id = this.$route.params.id

        var self = this
        this.fetchGameData(true)
        setInterval(function(){ self.fetchGameData() }, 1000 * 10) // every ten seconds
    },

    methods: {
        fetchGameData: function(force = false) {
            // lock requests so we dont spam
            if(this.fetchLock && !force) {
                return
            }
            this.fetchLock = true
            self = this
            api.getGame(this, this.id,  function(response) {
                self.game = response.body
                self.fetchLock = false
                // initial loading
                if(self.gameLoading) {
                    self.gameLoading = false
                }
            }, function(responese){
                console.log(responese)
                // initial loading
                if(self.gameLoading) {
                    self.gameLoading = false
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
    }
}
</script>