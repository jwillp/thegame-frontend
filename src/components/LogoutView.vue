<template>
    <div id="logout-view" class="well">
        <h1></h1>
    </div>
</template>

<script>
import api from '../api'
import router from '../router'
export default {

    created: function() {
        api.logout()
        this.$notify({
           title: 'Success',
           message: 'Successfully logged out',
           type: 'success'
         })
        router.replace('/')
    }
}
</script>