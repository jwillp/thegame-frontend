<template>
    <div id="newsfeed-view" class="well">
        <h1 class="text-center">
            <img src="./../assets/images/newsfeed.png" width="400px" alt="Newsfeed" class="title-image">
        </h1>
        <h2 class="text-center">Newsfeed</h2>
        <div class="news-list" v-loading="initialLoadInProgress" element-loading-text="Loading...">
            <div v-for="page in pages">
                <div v-for="news in page.news">
                    <NewsView :news="news"></NewsView>
                </div>
                <button 
                    v-if="page.number == pages.length && nextPage" 
                    v-on:click="loadNextPage()"
                    class="btn btn-primary" :disabled="loadMoreInProgress">
                        <span v-if="loadMoreInProgress">
                            Loading ...
                        </span>
                        <span v-else>
                            Load more ...
                        </span>
                </button>
            </div>
            <div v-if="pages.length == 0" class="panel panel-default">
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

const NEWS_PER_PAGE = 10

export default {
    props: ['gameId'],

    data: () => {
        return {
            // Pages of loaded events
            pages: [],  

            // Server number of the next page of results we should load
            // if value is null it means that there are no next page available
            nextPage: 1, 

            // If true indicates that the first load of newsfeed is in progress
            initialLoadInProgress: false,

            // Indicates wether or not a new page is currently being loaded
            loadMoreInProgress: false,

            // Indicates wether or not the list is being currently refreshed
            refreshInProgress: false,

            // Interval object of refresh
            refreshInterval: undefined,

            fetchLock: false,
            newsLoading: true,
            
        }
    },

    created: function() {
        document.title = 'The Game | Newsfeed' 
        var self = this
        this.initialLoadInProgress = true;
        this.loadNextPage();

        var self = this
       // this.refreshInterval = setInterval(function(){ self.refreshPages() }, 1000 * 10)
    },

    destroyed: function() {
        clearInterval(this.fetchInterval)
    },

    methods: {


        // Loads a specific page of results
        loadPage: function(page, _onSuccess) {
            //console.info("Loading page " + page + " ...")

            // Get Parameters
            var params =  {
                'per_page': NEWS_PER_PAGE,
                'page': page
            }

            var self = this

            // On Success functions
            var onSuccess = function(response) {
                //console.info("page load success")
                var data = response.data;
                // Index are 0 based but page numbers are 1 based
                // therefore index of a page = pageNumber - 1
                self.pages[data.current_page - 1] = {
                    // server number of the page
                    number : parseInt(data.current_page),
                    news: data.items
                }

                if(_onSuccess){
                    _onSuccess(response)
                }
            }

            // On Error function
            var onError = function(error) {
                self.$notify.error({
                  title: 'Error',
                  message: 'There was an error, please try again later.'
                });

                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  console.log(error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message);
                }
                console.log(error.config);
            }

            // On Always
            var onAlways = function(response) {
                // in all cases we are not loading results anymore
                self.loadMoreInProgress = false;
                self.refreshInProgress = false;
                self.initialLoadInProgress = false;
            }

            if(this.gameId) {
                // Game specific newsfeed
                api.getGameNews(this.gameId, params, onSuccess , onError, onAlways);
            } else {
                // General News Feed
                api.getNews(params, onSuccess, onError, onAlways);
            }
        },

        // Loads the next page of resulsts according to last server's response
        loadNextPage: function() {
            // If there is no next page to load we bail out
            if(!this.nextPage) return;
            this.loadMoreInProgress = true;
            var self = this
            this.loadPage(this.nextPage, function(response) {
                // Change the next page
                self.nextPage = response.data.next_page;
            });
        },

        // Refresh pages, refreshes all the already loaded pages
        refreshPages: function() {
            this.refreshInProgress = true;
            for (var i = 0; i < this.pages.length; i++) {
                var page = this.pages[i];
                this.loadPage(this.page);
            }
        }
    },

    components: {
        NewsView
    }
}
</script>