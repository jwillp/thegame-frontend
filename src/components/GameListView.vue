<template>
    <div id="gamelist-view">
        <div class="page-controls">
            <button>New Game</button>
        </div> <!-- /page-controls -->
        <div class="games">
            <ul class="list">
                <li v-for="game in games">
                    {{ game.title }} from {{ game.start_date }} to {{ game.end_date }}
                </li>
            </ul>
        </div>
        <GameFormView title="Create new game" url="s"></GameFormView>
    </div> <!-- /gamelist-view -->
</template>

<script>
import GameFormView from './GameFormView'
export default {
    data: () => {
        return {
            games: []
        }
    },
    components: {
        GameFormView
    }
}
</script>