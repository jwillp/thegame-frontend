<template>
    <div id="gamelist-view">
        <div class="page-controls">
            <el-button type="primary" @click="dialogNewGameVisible = true">New Game</el-button>
        </div> <!-- /page-controls -->
        <div class="games" v-loading="gameLoading">
            <ul class="list">
                {{ count }}
                <li v-for="game in games">
                    {{ game.title  }} from {{ format(game.start_date) }} to {{ format(game.end_date) }}
                </li>
            </ul>
        </div>

        <GameFormDialogView v-model="dialogNewGameVisible"></GameFormDialogView>
    </div> <!-- /gamelist-view -->
</template>

<script>
import api from '../api'
import moment from 'moment'
import GameFormDialogView from './GameFormDialogView'

export default {
    data: () => {
        return {
            games: [],
            count: -1,

            fetchLock: false,
            gameLoading: true,

            dialogNewGameVisible: false
        }
    },

    created: function() {
        var self = this
        this.fetchData(true)
        setInterval(function(){ self.fetchData() }, 1000 * 10)
    },

    methods: {
        fetchData: function(force = false) {
            // lock requests so we dont spam
            if(this.fetchLock && !force) {
                return
            }
            this.fetchLock = true
            self = this
            api.getGames(this, function(response) {
                self.games = response.body.items
                self.count = response.body.count
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

        format: function(date) {
          return moment(date).format("YYYY/MM/DD [at] HH:mm")
        }
    },

    components: {
        GameFormDialogView
    }
}
</script>