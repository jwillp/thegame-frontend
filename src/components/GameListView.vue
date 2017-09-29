<template>
    <div id="gamelist-view">
        <div class="page-controls">
            <div class="panel panel-default">
              <div class="panel-body">
                <button class="btn btn-primary" @click="dialogNewGameVisible = true">New Game</button>
                <div class="btn-group" role="group" aria-label="filter">
                    <button 
                        type="button" 
                        class="btn btn-default"  
                        v-bind:class="[progressFilter == 'IN_PROGRESS' ? 'btn-primary' : 'btn-default' ]"
                        v-on:click="toggleProgressFilter('IN_PROGRESS')">
                        In progress
                    </button>
                    <button 
                        type="button" 
                        class="btn btn-default" 
                        v-bind:class="[progressFilter == 'FINISHED' ? 'btn-primary' : 'btn-default' ]" 
                        v-on:click="toggleProgressFilter('FINISHED')">
                        Finished
                    </button>
                    <button 
                          type="button" 
                          class="btn" 
                          v-bind:class="[progressFilter == 'ALL' ? 'btn-primary' : 'btn-default' ]"
                          v-on:click="toggleProgressFilter('ALL')">
                          All
                    </button>
                </div>
              </div>
            </div>
        </div> <!-- /page-controls -->

        <div class="games" v-loading="gameLoading"  element-loading-text="Loading...">
          
          <div class="panel panel-default"  v-for="game in games" :key="game.id" v-if="canDisplayGame(game)">
            <div class="panel-body">
                <div class="col-xs-10">
                    <h2 class="challenge-title">
                      <router-link :to="{name:'games_view', params:{ id: game.id }}">
                        {{ game.title }}
                      </router-link>
                    </h2>
                    <p>Created by <a href="">{{ game.created_by.username }}</a></p>
                    <p>{{ game.description }}</p>
                    <p class="text-primary">
                        From <b>{{ format(game.start_date) }}</b> 
                        to <b>{{ format(game.end_date, true) }}</b>
                    </p>
                    <p>Time left: 

                        <b class="text-warning" v-if="game.is_finished">{{ timeLeft(game.end_date) }}</b>
                        <span v-else>{{ timeLeft(game.end_date) }}</span>
                    </p>

                    <p v-if="game.visibility == 'VISIBILITY_PRIVATE'">
                        <i class="glyphicon glyphicon-lock"></i> Private
                    </p>
                    <p v-if="game.visibility == 'VISIBILITY_PUBLIC'">
                        <i class="glyphicon glyphicon-globe"></i> Public
                    </p>
                </div>
            </div> <!-- /.panel-body -->
          </div> <!-- /.panel -->


          <div class="well" v-if="games.length == 0">
              There are no games yet ... <button class="btn btn-primary" @click="dialogNewGameVisible = true">Create one now!</button> 
          </div>
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

            dialogNewGameVisible: false,


            progressFilter: 'ALL'
        }
    },

    created: function() {
        document.title = 'The Game | Games'
        var self = this
        this.fetchData(true)
        this.fetchInterval = setInterval(self.fetchData, 1000 * 10)
    },

    destroyed: function() {
      clearInterval(this.fetchInterval)
    },

    methods: {
        // Fetches the data from the server
        fetchData: function(force = false) {
            // lock requests so we dont spam
            if(this.fetchLock && !force) {
                return
            }
            this.fetchLock = true
            var self = this
            api.getGames(
                // Success
                function(response) {
                    self.games = response.data.items
                    self.count = response.data.count
                    self.fetchLock = false
                }, 

                // Error
                function(response){
                    console.log(response)
                    self.$notify.error({
                        title: 'Error',
                        message: 'There was an error loading games, please try again later.'
                    });
                },

                // Always
                function(response) {
                    // initial loading
                    if(self.gameLoading) {
                        self.gameLoading = false
                    }
                }
            );
        },

        // Formats time TODO move in a util file
        format: function(date, displayTime) {
            var dateFormat = "YYYY/MM/DD"
            if(displayTime)
                dateFormat = "YYYY/MM/DD [at] HH:mm"

            return moment(date).format(dateFormat)
        },

        // Inidcates how much time is left until a certain date
        // TODO: Move in a util file
        timeLeft: function(endDate) {
            var now = moment()
            endDate = moment(endDate)
            if(now.isAfter(endDate)) {
                return "Finished"
            }else {
                return endDate.from(now)
                              .replace('in ', '')
                              .replace('a day', '1 day');
            }
        },

        // Changes the current page to a game's page
        viewGame: function(game) {
            router.replace('/games/' + game.id)
        },

        // Changes the current filter
        toggleProgressFilter: function(filter) {
            this.progressFilter = filter;
        },

        // Indicates if a game can be displayed given the current filter
        canDisplayGame: function(game) {
            if(this.progressFilter == 'ALL') return true;



            if(this.progressFilter == 'IN_PROGRESS' && !game.is_finished)
                return true;

            if(this.progressFilter == 'FINISHED' && game.is_finished)
                return true;

            return false;
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