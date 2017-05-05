<template>
    <div id="logout-view" class="well">
        <h1>Successfully logged out</h1>
    </div>
</template>

<script>
import api from '../api'
import router from '../router'
export default {

    created: function() {
        api.logout()
    }
}
</script>