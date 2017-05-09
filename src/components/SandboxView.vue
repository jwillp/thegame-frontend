<template>
  <div>
      <UserSelector
                    placeholder="User selector"
                    :default-users="initialUsers"
                    v-model="items"
                    ></UserSelector>

      <ul>
        <li v-for="item in items">{{ item }}</li>
      </ul>            
  </div>
</template>

<script>

import UserSelector from './UserSelector.vue'

export default {

  data() {
    return {
      items: [],

      initialUsers: ['admin']
     
    }
  },

  components: {
    UserSelector
  }

}
</script>
