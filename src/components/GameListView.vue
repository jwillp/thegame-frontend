<template>
    <div id="gamelist-view">
        <div class="page-controls">
            <el-button type="primary">New Game</el-button>
        </div> <!-- /page-controls -->
        <div class="games">
            <ul class="list">
                {{ count }}
                <li v-for="game in games">
                    {{ game.title  }} from {{ format(game.start_date) }} to {{ format(game.end_date) }}
                </li>
            </ul>
        </div>
        <GameFormView title="Create new game" url="s"></GameFormView>
    </div> <!-- /gamelist-view -->
</template>

<script>
import api from '../api'
import moment from 'moment'
import GameFormView from './GameFormView'

export default {
    data: () => {
        return {
            games: [],
            count: -1,

            fetchLock: false
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
            console.debug('fetch')
            self = this
            api.getGames(this, function(response) {
                console.log("fetch callback")
                self.games = response.body.items
                self.count = response.body.count
                self.fetchLock = false
            }, function(responese){
                console.log(responese)
            })
        },

        format: function(date) {
          return moment(date).format("YYYY/MM/DD [at] HH:mm")
        }
    },

    components: {
        GameFormView
    }
}
</script>