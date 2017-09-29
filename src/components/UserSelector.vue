<template>
  <el-select v-model="selectedUsers" filterable multiple allow-create :placeholder="placeholder">
    <el-option
      v-for="user in availableUsers"
      :label="user.username"
      :value="user.username"
      :key="user.id"
      >
    </el-option>
  </el-select>
</template>

<script>
import api from '../api'

export default {
    props: [
        'placeholder',
        'defaultUsers',
    ],

    data() {
      return {
        selectedUsers: [],
        availableUsers: [],
      }
    },

    watch: {
        value(newVal){
          this.selectedUsers = newVal
        },

        selectedUsers(newVal){
          this.$emit('input', this.selectedUsers)
        },
    },

    created: function() {
        this.selectedUsers = this.defaultUsers
        var self = this
        this.fetchUsers(true)
        this.fetchUsersInterval = setInterval(function(){ self.fetchUsers() }, 1000 * 5) // every five seconds
    },

    deleted: function() {
      clearInterval(this.fetchUsersInterval)
    },

    methods: {
        fetchUsers: function(force = false) {
          // lock requests so we dont spam
          if(this.fetchUsersLock && !force) {
              return
          }
          this.fetchUsersLock = true
          self = this
          api.getUsers(

            // Success
            function(response) {
              self.availableUsers = response.data.items
              self.fetchUsersLock = false
            }, 

            // Error
            function(error){
              self.$notify.error({
                title: 'Error',
                message: 'There was an error loading users, please try again later.'
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
            },

            // Always
            function(response) {
              
            }
          )
        }
    }
}
</script>
