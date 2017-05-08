<template>
    <div id="gamelist-view">
        <div class="page-controls">
            <div class="panel panel-default">
              <div class="panel-body">
                <button class="btn btn-primary" @click="dialogNewGameVisible = true">New Game</button>
              </div>
            </div>
        </div> <!-- /page-controls -->

        <div class="games" v-loading="gameLoading"  element-loading-text="Loading...">
          
          <div class="panel panel-default"  v-for="game in games" :key="game.id">
            <div class="panel-body">
                <div class="col-xs-10">
                    <h2 class="challenge-title">
                      <router-link :to="{name:'games_view', params:{ id: game.id }}">
                        {{ game.title }}
                      </router-link>
                    </h2>
                    <p>{{ game.description }}</p>
                    <p class="text-primary">From <b>{{ format(game.start_date) }}</b> to <b>{{ format(game.end_date, true) }}</b></p>

                    <p v-if="game.visibility == 'VISIBILITY_PRIVATE'">
                        <i class="glyphicon glyphicon-lock"></i> Private
                    </p>
                    <p v-if="game.visibility == 'VISIBILITY_PUBLIC'">
                        <i class="glyphicon glyphicon-globe"></i> Public
                    </p>
                </div>
            </div> <!-- /.panel-body -->
          </div> <!-- /.panel -->
        </div>

        <GameFormDialogView v-model="dialogNewGameVisible"></GameFormDialogView>
    </div> <!-- /gamelist-view -->
</template>

<script>
import api from '../api'
import router from '../router'
import moment from 'moment'
import GameFormDialogView from './GameFormDialogView'

export default {
    data: () => {
        return {
            games: [],
            count: -1,

            fetchLock: false,
            gameLoading: true,
            fetchInterval: undefined,

            dialogNewGameVisible: false
        }
    },

    created: function() {
        var self = this
        this.fetchData(true)
        this.fetchInterval = setInterval(function(){ self.fetchData() }, 1000 * 10)
    },

    destroyed: function() {
      clearInterval(this.fetchInterval)
    },

    methods: {
        fetchData: function(force = false) {
            // lock requests so we dont spam
            if(this.fetchLock && !force) {
                return
            }
            this.fetchLock = true
            var self = this
            api.getGames(this, function(response) {
                self.games = response.body.items
                self.count = response.body.count
                self.fetchLock = false
                // initial loading
                if(self.gameLoading) {
                    self.gameLoading = false
                }
            }, function(response){
                console.log(response)
                this.$notify.error({
                  title: 'Error',
                  message: 'There was an error creating the challenge, please try again later.'
                });
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

        viewGame: function(game) {
            router.replace('/games/' + game.id)
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