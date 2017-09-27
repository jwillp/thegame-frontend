<template>
    <div id="challengeList-view">
        <div class="page-controls" v-if="game && !game.is_finished">
            <el-button type="primary" @click="dialogNewChallengeVisible = true">New Challenge</el-button>
        </div> <!-- /page-controls -->

        <div class="challenges" v-loading="challengesLoading" element-loading-text="Loading...">
          <div class="panel panel-default"  v-for="challenge in challenges" :key="challenge.id">
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
        </div>

        <ChallengeFormView  v-if="!game.is_finished"
                            v-model="dialogNewChallengeVisible" 
                            :gameId="game.id"></ChallengeFormView>
    </div> <!-- /challengeList-view -->
</template>

<script>
import api from '../api'
import router from '../router'
import moment from 'moment'

import ChallengeFormView from './ChallengeFormView'

export default {
    data: () => {
        return {
            challenges: [],
            count: -1,

            fetchLock: false,
            challengesLoading: true,
            challengeInterval: undefined,

            dialogNewChallengeVisible: false
        }
    },

    props: ['game'],

    created: function() {
        var self = this
        this.fetchData(true)
        this.challengeInterval = setInterval(function(){ self.fetchData() }, 1000 * 10)
    },

    destroyed: function() {
        clearInterval(this.challengeInterval)
    },

    methods: {
        fetchData: function(force = false) {
            // lock requests so we dont spam
            if(this.fetchLock && !force) {
                return
            }
            this.fetchLock = true
            var self = this
            api.getChallenges(this.$route.params.id, 

                // SUCCESS
                function(response) {
                    self.challenges = response.data.items
                    self.count = response.data.count
                    self.fetchLock = false
                    // initial loading
                    if(self.challengesLoading) {
                        self.challengesLoading = false
                    }
                }, 

                // ERROR
                function(response){
                    console.log(response)

                    self.$notify.error({
                      title: 'Error',
                      message: 'There was an error, please try again later.'
                    });

                    // initial loading
                    if(self.challengesLoading) {
                        self.challengesLoading = false
                    }
                },

                // ALWAYS
                function(response) {

                }
            )
        },

        viewChallenge: function(challenge) {
            router.replace('/challenges/' + challenge.id)
        }

    },

    components: {
        ChallengeFormView
    }
}
</script>

<style>
    .page-controls {
        margin-bottom: 30px;
    }
</style>