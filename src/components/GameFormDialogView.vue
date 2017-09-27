<template>
  <el-dialog title="Create new game" v-model="dialogVisible">
    <div id="game-form" class="modal-container">
      <form id="login-form" v-on:submit.prevent="createGame">
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

            <el-date-picker
                  v-model="fields.start_date"
                  type="datetime"
                  format="yyyy/MM/dd HH:mm"
                  placeholder="Select start date and time"
                  :picker-options="pickerOptions">
            </el-date-picker>
        </div>
        <!-- end date -->
        <div class="form-group">
            <div class="form-error-block" v-if="errors.end_date">
                <p class="form-error" v-for="error in errors.end_date">{{ error }}</p>
            </div>
            <el-date-picker
                  v-model="fields.end_date"
                  type="datetime"
                  format="yyyy/MM/dd HH:mm"
                  placeholder="Select start date and time"
                  :picker-options="pickerOptions">
            </el-date-picker>
        </div>

        <!-- Visibility -->
        <div class="form-group">
          <p>Visibility</p>
          <el-radio-group v-model="visibility">
            <el-radio-button label="Public"><i class="glyphicon glyphicon-globe">&nbsp;</i>Public</el-radio-button>
            <el-radio-button label="Private"><i class="glyphicon glyphicon-lock">&nbsp;</i>Private</el-radio-button>
          </el-radio-group>
        </div>
      </form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="createGame" :loading="gameInCreation">Create</el-button>
      <el-button @click="dialogVisible = false" :disabled="gameInCreation">Cancel</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from 'moment'

import api from '../api'
export default {

    props: ["value"],

    data: () => {
        return {
            dialogVisible: false,

            gameInCreation: false,

            fields: {
                title: '',
                description: '',
                start_date: '',
                end_date: ''
            },

            errors: {},

            visibility: 'Public',

            pickerOptions: {
              shortcuts: [{
                text: 'Today',
                onClick(picker) {
                  picker.$emit('pick', new Date());
                }
              },
              {
                text: 'Tomorrow',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() + 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                }
              },
              {
                text: 'Next week',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', date);
                }
              }]
            },
        }
    },

    created: function() {

    },

    watch: {
      value(newVal){
        this.dialogVisible = newVal
      },

      dialogVisible(newVal){
        this.$emit('input', this.dialogVisible)
      },

      visibility: function(newValue) {
        newValue = newValue + ''
        this.fields.visibility = 'VISIBILITY_' + newValue.toUpperCase()
      }
    },

    methods: {
        createGame: function() {
          this.gameInCreation = true
          var self = this
          api.createGame(this.fields,
              // SUCCES CALLBACK
              function(response) {
                self.dialogVisible = false

                self.resetForm()
                this.$notify({
                  title: 'Success',
                  message: 'Game created successfully',
                  type: 'success'
                });
              },
              // ERROR CALLBACK
              function(response) {
                console.log(response)
                self.errors = response.data.errors || {}

                if(!response.data.errors) {
                  this.$notify.error({
                    title: 'Error',
                    message: 'There was an error creating the game, please try again later.'
                  });
                }
              },

              // always callback
              function(response) {
                self.gameInCreation = false
              }
          );
        },

        resetForm: function() {
          this.fields = {
                title: '',
                description: '',
                start_date: '',
                end_date: '',
                visibility: 'Public'
           }
        }
    },
}
</script>