<template>
    <div id="logout-view">
        <h1>Successfully logged out</h1>
        <p>You will be redirected in in a few moment ...</p>
    </div>
</template>

<script>
import api from '../api'
import router from '../router'
export default {

    created: function() {
        api.logout()
        setTimeout(function() {
            // Redirect to home
            router.replace('/')
        }, 2000)
    }
}
</script>