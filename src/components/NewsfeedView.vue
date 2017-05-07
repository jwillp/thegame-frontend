<template>
    <div id="newsfeed-view" class="well">
        <h1 class="text-center"><img src="./../assets/images/newsfeed.png" width="400px" alt="Newsfeed"></h1>
        <h2 class="text-center">Newsfeed</h2>
        <div class="news-list" v-loading="newsLoading" element-loading-text="Loading...">
            <div v-for="news in newsList">
                <NewsView :news="news"></NewsView>
            </div>

        </div>
    </div>
</template>

<script>
import api from '../api'
import router from '../router'

import NewsView from './NewsView'

export default {
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
            api.getNews(this, function(response) {
                self.newsList = response.body.items
                self.count = response.body.count
                self.fetchLock = false
                // initial loading
                if(self.newsLoading) {
                    self.newsLoading = false
                }
            }, function(response){
                console.log(response)
                // initial loading
                if(self.newsLoading) {
                    self.newsLoading = false
                }
            })
        }
    },

    components: {
        NewsView
    }
}
</script>