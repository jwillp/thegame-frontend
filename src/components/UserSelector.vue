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
          console.log("FETCH USERS")
          // lock requests so we dont spam
          if(this.fetchUsersLock && !force) {
              return
          }
          this.fetchUsersLock = true
          self = this
          api.getUsers(this, function(response) {
            console.log("USERS RECEIVED")
            self.availableUsers = response.body.items
            self.fetchUsersLock = false
          }, function(response){
            console.log("User fetch error")
            console.log(response)
            this.$notify.error({
              title: 'Error',
              message: 'There was an error loading users, please try again later.'
            });
          })
        }
    }
}
</script>
