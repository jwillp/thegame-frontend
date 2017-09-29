<template>
    <div id="challengeList-view">
        <div class="page-controls" v-if="game && !game.is_finished">
            <el-button type="primary" @click="dialogNewChallengeVisible = true">New Challenge</el-button>
            <el-button type="primary" @click="batchDialogVisible = true">Batch Complete</el-button>
        </div> <!-- /page-controls -->

        <div class="challenges" v-loading="initialLoadInProgress" element-loading-text="Loading...">
            <div v-for="page in pages">
              <div class="panel panel-default"  v-for="challenge in page.challenges" v-if="page" :key="challenge.id">
                <div class="panel-body">
                  <div class="row">
                    <div class="col-xs-10">
                      <h2 class="challenge-title">
                        <router-link :to="{name:'challenge_view', params:{ id: challenge.id }}">
                          {{ challenge.title }}
                        </router-link>
                      </h2>
                      <p>{{ challenge.description }}</p>
                      <p>Created by {{ challenge.created_by.username }}</p>
                    </div>
                    <div class="col-xs-2 text-right">
                      <router-link :to="{name:'challenge_view', params:{ id: challenge.id }}">
                        <h3>{{ challenge.nb_points }} pts</h3>
                      </router-link>
                      <!-- <el-button style="float: right;" type="primary" @click="viewGame(game)">Open</el-button> -->
                    </div>
                  </div> <!-- /.row -->
                </div> <!-- /.panel-body -->
              </div> <!-- /.panel -->
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
            </div> <!-- page v for -->
        </div> <!-- .challenges -->

        <ChallengeFormView  v-if="!game.is_finished"
                            v-model="dialogNewChallengeVisible" 
                            :gameId="game.id"></ChallengeFormView>

        <ChallengeBatchView v-if="!game.is_finished"
                            v-model="batchDialogVisible"
                            :challenges="getChallenges()"></ChallengeBatchView>
    </div> <!-- /challengeList-view -->
</template>

<script>
import api from '../api'
import router from '../router'
import moment from 'moment'

import ChallengeFormView from './ChallengeFormView'
import ChallengeBatchView from './ChallengeBatchView'


const CHALLENGES_PER_PAGE = 10

export default {


    data: () => {
        return {

            pages: [],  

            // Server number of the next page of results we should load
            // if value is null it means that there are no next page available
            nextPage: 1, 

            fetchLock: false,

            initialLoadInProgress: false,
            loadMoreInProgress: false,
            refreshInProgress: false,


            refreshInterval: undefined,

            dialogNewChallengeVisible: false,
            batchDialogVisible: false
        }
    },

    props: ['game'],

    created: function() {
        this.initialLoadInProgress = true;
        this.loadNextPage();
        var self = this
        this.refreshInterval = setInterval(function(){ self.refreshPages() }, 1000 * 10)
    },

    destroyed: function() {
        clearInterval(this.refreshInterval)
    },

    methods: {

        // Loads a specific page of results
        loadPage: function(page, onSuccess) {
            //console.info("Loading page " + page + " ...")
            var params =  {
                'per_page': CHALLENGES_PER_PAGE,
                'page': page
            }

            var gameId = this.game.id;

            var self = this
            api.getChallenges(gameId, params,
                // SUCCESS
                function(response) {
                    //console.info("page load success")
                    var data = response.data;
                    // Index are 0 based but page numbers are 1 based
                    // therefore index of a page = pageNumber - 1
                    self.pages[data.current_page - 1] = {
                        // server number of the page
                        number : parseInt(data.current_page),
                        challenges: data.items
                    }

                    if(onSuccess){
                        onSuccess(response)
                    }
                },

                // ERROR
                function(error) {
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
                    self.$notify.error({
                      title: 'Error',
                      message: 'There was an error, please try again later.'
                    });

                },

                // ALWAYS
                function(response) {
                    // in all cases we are not loading results anymore
                    self.loadMoreInProgress = false;
                    self.refreshInProgress = false;
                    self.initialLoadInProgress = false;
                }
            );
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

                // loadMoreInProgress
            });
        },

        // Refresh pages, refreshes all the already loaded pages
        refreshPages: function() {
            this.refreshInProgress = true;
            for (var i = 0; i < this.pages.length; i++) {
                var page = this.pages[i];
                this.loadPage(this.page);
            }
        },

        // Returns all the challenges
        getChallenges: function() {
            var challenges = []
            for (var i = 0; i < this.pages.length; i++) {
                var page = this.pages[i];
                for (var j = 0; j < page.challenges.length; j++) {
                    var challenge = page.challenges[j];
                    challenges.push(challenge);
                }
            }
            return challenges;
        },

        viewChallenge: function(challenge) {
            router.replace('/challenges/' + challenge.id)
        }
    },

    components: {
        ChallengeFormView,
        ChallengeBatchView
    }
}
</script>

<style>
    .page-controls {
        margin-bottom: 30px;
    }
</style>