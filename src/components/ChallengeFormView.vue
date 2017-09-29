<template>
  <el-dialog title="Create new challenge" v-model="dialogVisible">
    <div id="challenge-form" class="modal-container">
      <form id="login-form" v-on:submit.prevent="createChallenge">
        <!-- title -->
        <div class="form-group">
            <div class="form-error-block" v-if="errors.title">
                <p class="form-error" v-for="error in errors.title">{{ error }}</p>
            </div>
            <el-input
                v-model="fields.title"
                type="text"
                name="title"
                placeholder="Enter title"
                required>
            </el-input>
        </div>
        <!-- description -->
        <div class="form-group">
            <div class="form-error-block" v-if="errors.description">
                <p class="form-error" v-for="error in errors.description">{{ error }}</p>
            </div>
            <el-input
                type="textarea"
                v-model="fields.description"
                name="description"
                placeholder="Enter description"
                required>
            </el-input>
        </div>
        <!-- start date -->
        <div class="form-group">
            <div class="form-error-block" v-if="errors.start_date">
                <p class="form-error" v-for="error in errors.start_date">{{ error }}</p>
            </div>

            <el-input-number v-model="fields.nb_points" :step="5"></el-input-number>
        </div>
      </form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="createChallenge" :loading="challengeInCreation">Create</el-button>
      <el-button @click="dialogVisible = false" :disabled="challengeInCreation">Cancel</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from 'moment'

import api from '../api'
export default {

    props: ["value", "gameId"],

    data: () => {
        return {
            dialogVisible: false,

            fields: {
                title: '',
                description: '',
                nb_points: 10
            },

            challengeInCreation: false,

            errors: {},
        }
    },


    created: function() {

    },

    watch: {
      value(newVal){
        this.dialogVisible = newVal
        console.log(this.dialogVisible)
      },

      dialogVisible(newVal){
        this.$emit('input', this.dialogVisible)
      }
    },

    methods: {
        createChallenge: function() {
          this.challengeInCreation = true
          var self = this
          var response = api.createChallenge(this.gameId, this.fields,
              // SUCCES CALLBACK
              function(response) {
                  console.log(response)
                  self.fields = {
                      title: '',
                      description: '',
                      nb_points: 10
                  },
                  self.dialogVisible = false
                  self.challengeInCreation = false

                  self.resetForm()
                  // TODO Display alert success
                  self.$notify({
                    title: 'Success',
                    message: 'Challenge created successfully',
                    type: 'success'
                  });
              },

              // ERROR CALLBACK
              function(error) {
                  console.log(error)
                  self.errors = error.data.errors || {}
                  self.challengeInCreation = false

                  if(!error.data.errors) {
                    self.$notify.error({
                      title: 'Error',
                      message: 'There was an error creating the challenge, please try again later.'
                    });
                  }

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
              },

              // ALWAYS
              function(response) {

              }
          )
        },

        resetForm: function() {
          this.fields = {
                title: '',
                description: '',
                nb_points: 10
          }
        }
    },
}
</script>