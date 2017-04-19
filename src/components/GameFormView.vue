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
                    <input
                        v-model="fields.title"
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        required>
                </div>
                <!-- description -->
                <div class="form-group">
                    <div class="form-error-block" v-if="errors.description">
                        <p class="form-error" v-for="error in errors.description">{{ error }}</p>
                    </div>
                    <textarea v-model="fields.description"
                              name="description"
                              placeholder="Enter description"
                              required>
                    </textarea>
                </div>
                <!-- start date -->
                <div class="form-group">
                    <div class="form-error-block" v-if="errors.start_date">
                        <p class="form-error" v-for="error in errors.start_date">{{ error }}</p>
                    </div>
                </div>
                <!-- End date -->
                <div class="form-group">
                    <div class="form-error-block" v-if="errors.end_date">
                        <p class="form-error" v-for="error in errors.end_date">{{ error }}</p>
                    </div>
                </div>
                <div class="form-group">
                    <input type="submit" name="submit" value="Create">
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
                start_date: 'today',
                end_date: 'today + 7'

            },

            errors: {

            }

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

    components: {
    }

}
</script>