<template>
    <div id="newsfeed-view" class="well">
        <h1 class="text-center">
            <img src="./../assets/images/newsfeed.png" width="400px" alt="Newsfeed" class="title-image">
        </h1>
        <h2 class="text-center">Newsfeed</h2>
        <div class="news-list" v-loading="newsLoading" element-loading-text="Loading...">
            <div v-for="news in newsList">
                <NewsView :news="news"></NewsView>
            </div>
            <div v-if="count == 0" class="panel panel-default">
                <div class="panel-body">
                    <p>There are no news to display ...</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import api from '../api'
import router from '../router'

import NewsView from './NewsView'

export default {
    props: ['gameId'],

    data: () => {
        return {
            newsList: [],
            count: -1,


            fetchLock: false,
            newsLoading: true,
            fetchInterval: undefined,
        }
    },

    created: function() {
        document.title = 'The Game | Newsfeed' 
        var self = this
        this.fetchData(true)
        this.fetchInterval = setInterval(function(){ self.fetchData() }, 1000 * 10)
    },

    destroyed: function() {
        clearInterval(this.fetchInterval)
    },

    methods: {
        fetchData: function(force = false) {
            console.log('FETCH NEWS')
            // lock requests so we dont spam
            if(this.fetchLock && !force) {
                return
            }
            this.fetchLock = true
            var self = this
            

            var onSuccess = function(response) {
                
                console.log(response)
                self.newsList = response.body.items
                self.count = response.body.count
                self.fetchLock = false
                // initial loading
                if(self.newsLoading) {
                    self.newsLoading = false
                }
            }

            var onError = function(response){
                console.log(response)
                this.$notify.error({
                  title: 'Error',
                  message: 'There was an error, please try again later.'
                });
                // initial loading
                if(self.newsLoading) {
                    self.newsLoading = false
                }
            }

            if(this.gameId) {
                api.getGameNews(this, this.gameId, onSuccess , onError);
            } else {
                api.getNews(this, onSuccess , onError);
            }
        }
    },

    components: {
        NewsView
    }
}
</script>