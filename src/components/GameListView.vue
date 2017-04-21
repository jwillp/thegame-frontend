<template>
    <div id="gamelist-view">
        <div class="page-controls">
            <el-button type="primary" @click="dialogNewGameVisible = true">New Game</el-button>
        </div> <!-- /page-controls -->
        <hr>
        <div class="games" v-loading="gameLoading">
            <el-card class="box-card" v-for="game in games">
              <div slot="header" class="clearfix">
                <span style="line-height: 36px;">{{ game.title }}</span>
                <el-button style="float: right;" type="primary">Open</el-button>
              </div>
              <div class="text item">
                from {{ format(game.start_date) }} to {{ format(game.end_date) }}
              </div>
            </el-card>
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

<style>
    .box-card {
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
</style>