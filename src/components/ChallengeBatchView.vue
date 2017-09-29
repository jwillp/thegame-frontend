<template>
    <el-dialog title="Batch complete challenges" v-model="dialogVisible">

        <!-- Challenge Selection View -->
        <div v-show="currentView == 'SELECTION'">
            <div class="input-group">
              <input v-model="searchFilter" type="text" class="form-control" placeholder="Search for...">
              <span class="input-group-btn">
                <button class="btn btn-default" type="button" v-on:click="clearSearch()">Clear</button>
              </span>
            </div><!-- /input-group -->
            <div class="batch-challenge-list-selection">
                <ul>
                    <li class="" v-for="challenge in filterChallenges()">  
                        <div class="row">
                            
                            <div class="checkbox col-md-2"
                                 v-on:click="selectChallenge(challenge)"
                                 :class="{checked: isChallengeSelected(challenge)}">
                                <i 
                                    v-if="isChallengeSelected(challenge)"
                                    class="glyphicon glyphicon-ok"></i>
                            </div>
                            <div class="challenge-title col-md-10">
                                {{ challenge.title }}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="button-bar pull-right">
                <button class="btn btn-default" type="button" v-on:click="onCancel()">Cancel</button>
                <button class="btn btn-primary" type="button" v-on:click="displayConfirmationView()">Submit</button>
            </div>
        </div>

        <!-- Confirmation view -->
         <div v-if="currentView == 'CONFIRMATION'">
            <div class="info">
                <div class="alert alert-info" role="alert">
                    <strong>Heads up!</strong><br>
                    You are about to complete the challenges listed below. 
                    Please review your selection before submitting. 
                    If you want to make change, click "Go back".
                </div>
                <div class="batch-challenge-list-review">
                    <ul>
                        <li v-for="challenge in getSelectedChallenges()">{{ challenge.title }}</li>
                    </ul>
                </div>
            </div>
              
              <div class="button-bar pull-right">
                  <button class="btn btn-default" type="button" v-on:click="displaySelectionView()">Go back</button>
                  <button class="btn btn-primary" type="button" v-on:click="onConfirm()">Confirm</button>
              </div>
        </div>



        <div v-if="currentView == 'PROCESSING'">
            <p class="processing-message">Currently processing ...</p>
            <div v-loading="processing"></div>
            <div class="spacer"></div>
        </div>







    </el-dialog>
</template>

<script type="text/javascript">

import api from '../api'


export default {

    props: ["value", "challenges"],

    data: () => {
        return {
            // Indicates if the dialog is visible
            dialogVisible: false,

            // Indicates if the batch is processing
            processing: false,

            // list of selected challenges
            selectedChallengesIds: [],

            // The search bar entered terms
            searchFilter: '',

            // indicates the current view of the dialog
            // can be SELECTION. CONFIRMATION, PROCESSING
            currentView: 'SELECTION'
        }
    },

    watch: {
      value(newVal){
        this.dialogVisible = newVal;
      },

      dialogVisible(newVal){
        this.$emit('input', this.dialogVisible);
        if(newVal == false) {
            this.clearSearch();
        }
      }
    },

    methods: {
        batchCompleteChallenge: function() {
            var self = this
            this.processing = true;
            api.completeChallengeBatch({'ids': this.selectedChallengesIds},
                // Success
                function(response) {
                    console.log(response)
                    self.$notify({
                        title: 'Success',
                        message: 'Challenges completed successfully',
                        type: 'success'
                  });
                }, 

                // Error
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
                        message: 'There was an error creating the challenge, please try again later.'
                    });
                },

                // Always
                function(response) {
                    self.processing = false;
                    self.displaySelectionView();
                    self.onCancel();
                }
            );
        },

        onConfirm: function() {
            this.batchCompleteChallenge();
            this.displayProcessingView();
        },

        // Displays the confirmation view
        displayConfirmationView: function() {
            this.currentView = 'CONFIRMATION';
        },

        // Displays the selection view
        displaySelectionView: function() {
            this.currentView = 'SELECTION';
        },

        // Displays the processing view
        displayProcessingView: function() {
            this.currentView = 'PROCESSING';
        },

        // Called when the button "cancel" is clicked
        onCancel: function() {
            this.clearSearch();
            this.dialogVisible = false;
        },

        // Selects a challenge
        selectChallenge: function(challenge) {
            var index = this.selectedChallengesIds.indexOf(challenge.id);
            if(index == -1){
                this.selectedChallengesIds.push(challenge.id);
            } else {
                this.selectedChallengesIds.splice(index, 1);
            }
        },

        // indicates if a challenge is currently selected
        isChallengeSelected: function(challenge) {
            return this.selectedChallengesIds.indexOf(challenge.id) != -1;
        },

        // Filters the challenge list
        filterChallenges: function() {
            return this.challenges.filter((challenge) => {
                var titleMatch = challenge.title.toLowerCase().match(this.searchFilter.toLowerCase());

                return titleMatch; // false challenge removed from array
            });
        },

        // Returns the list of selected challenges
        getSelectedChallenges: function() {
            return this.challenges.filter((challenge) => {
                return this.isChallengeSelected(challenge);
            });
        },

        // Clears the search
        clearSearch: function() {
            this.searchFilter = '';
        }
    },
}
</script>

<style type="text/css">
.processing-message{
    margin-bottom: 50px;
}
.spacer {
    height: 50px;
}
</style>