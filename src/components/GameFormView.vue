<template>
    <div id="game-form" class="modal-container">
        <div class="modal-header">
            <h2>{{ header }}</h2>
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
                <!-- End date -->
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
                <div class="form-group">
                    <el-button type="primary" @click="createGame">Create</el-button>
                </div>
        </form>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

import api from '../api'
export default {
    props: ['header', 'url'],

    data: () => {
        return {
            fields: {
                title: '',
                description: '',
                start_date: '',
                end_date: ''
            },

            errors: {},

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

    methods: {
        createGame: function() {
            var self = this
            var response = api.createGame(this, this.fields,
                // SUCCES CALLBACK
                function(response) {
                    alert('COOL');
                },
                // ERROR CALLBACK
                function(response) {
                    console.log(response)
                    self.errors = response.body.errors
                }
            )
        }
    },
}
</script>