<template>
    <div id="challengeList-view">
        <div class="page-controls">
            <el-button type="primary" @click="dialogNewChallengeVisible = true">New Challenge</el-button>
        </div> <!-- /page-controls -->

        <div class="challenges" v-loading="challengesLoading">
            <el-card class="box-card" v-for="challenge in challenges" :key="challenge.id">
              <div slot="header" class="clearfix">
                <span style="line-height: 36px;">
                    <router-link :to="{name:'challenge_view', params:{ id: challenge.id }}">{{ challenge.title }}</router-link>
                </span>
                <!-- <el-button style="float: right;" type="primary" @click="viewChallenge(challenge)">Open</el-button> -->
                <p>{{ challenge.description }}</p>
                <p>{{ challenge.nb_points }}</p>
              </div>
              <div class="text item">

              </div>
            </el-card>
        </div>

        <ChallengeFormView v-model="dialogNewChallengeVisible" :gameId="gameId"></ChallengeFormView>
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

    props: ['gameId'],

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
            console.log('FETCH CHALLENGES')
            // lock requests so we dont spam
            if(this.fetchLock && !force) {
                return
            }
            this.fetchLock = true
            self = this
            api.getChallenges(this, this.$route.params.id, function(response) {
                self.challenges = response.body.items
                self.count = response.body.count
                self.fetchLock = false
                // initial loading
                if(self.challengesLoading) {
                    self.challengesLoading = false
                }
            }, function(responese){
                console.log(responese)
                // initial loading
                if(self.challengesLoading) {
                    self.challengesLoading = false
                }
            })
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